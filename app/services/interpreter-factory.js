import Ember from 'ember';


export default Ember.Service.extend({
  pilas: Ember.inject.service(),

  /**
   * Retorna un intérprete preparado para ejecutar el código que
   * se le envíe como argumento.
   *
   * El código se ejecutará de manera aislada, en un entorno protegido
   * sin acceso al exterior (no tendrá acceso a ember, pilas, window, ni nada...)
   * así que las únicas funciones a las que podrá acceder están detalladas
   * en la función _initFunction, que aparece más abajo.
   */
  crearInterprete(codigo, callback_cuando_ejecuta_bloque, actorId) {
    return new Interpreter(codigo, (interpreter, scope) => {
      return this._initFunction(interpreter, scope, callback_cuando_ejecuta_bloque, actorId);
    });
  },

  /**
   * Inicializa el intérprete y su scope inicial, para que
   * pueda usar funcioens como "hacer", "console.log" etc..
   */
  _initFunction(interpreter, scope, callback_cuando_ejecuta_bloque, actorId) {
    /**
     * Cola de mensajes de este interprete
     *
     * Cuando un mensaje previamente conectado es emitido se guarda el mismo
     * en esta cola, que luego puede ser consultada por el codigo corriendo
     * dentro del interprete.
     */
    interpreter.pilas_msg_queue = [];

    /**
     * Indica si el codigo corriendo dentro del interprete ya ejecuto
     * out_mensajes_configurados para indicar que terminó de conectarse a
     * mensajes.
     */
    interpreter.pilas_mensajes_configurados = false; // Este interprete todavia no configuro sus mensajes

    let pilasService = this.get('pilas');
    var actor = pilasService.evaluar(`pilas.obtener_actor_por_id("${actorId}");`);

    var console_log_wrapper = function(txt) {
      txt = txt ? txt.toString() : '';
      return interpreter.createPrimitive(console.log(txt));
    };

    interpreter.setProperty(scope, 'console_log', interpreter.createNativeFunction(console_log_wrapper));

    // Esto deberia estar en otro lado, es un comportamiento que lo unico que
    // hace es llamar a una función.
    var ComportamientoLlamarCallback = function(args) {
      this.argumentos = args;

      this.iniciar = function() {
      };

      this.actualizar = function() {
        this.argumentos.callback();
        return true;
      };

      this.eliminar = function() {
      };
    };

    // Genera la función "out_hacer" que se llamará dentro del intérprete.
    //
    // Esta función encadenará dos comportamientos para simplificar el uso
    // de funciones asincrónicas. Agregará el comportamiento que represente
    // la acción que el usuario quiere hacer con el actor y luego agregará
    // otro comportamiento para indicar que la tarea asincrónica terminó.
    //
    // Por ejemplo, si en el código se llama a la función hacer así:
    //
    //      hacer("Saltar", {});
    //      hacer("Caminar", {pasos: 20});
    //
    // Internamente la función hará que el actor primero "salte" y luego
    // "camine" 20 pasos.
    var hacer_wrapper = function(comportamiento, params, callback) {
      comportamiento = comportamiento ? comportamiento.toString() : '';
      params = params ? params.toString() : '';
      params = JSON.parse(params);
      var clase_comportamiento = pilasService.evaluar(`
        var comportamiento = null;

        if (window['${comportamiento}']) {
          comportamiento = ${comportamiento};
        } else {
          if (pilas.comportamientos['${comportamiento}']) {
            comportamiento = pilas.comportamientos['${comportamiento}'];
          } else {
            throw new Error("No existe un comportamiento llamado '${comportamiento}'.");
          }
        }

        comportamiento;
      `);

      actor.hacer_luego(clase_comportamiento, params);
      actor.hacer_luego(ComportamientoLlamarCallback, {callback});
    };

    interpreter.setProperty(scope, 'out_hacer', interpreter.createAsyncFunction(hacer_wrapper));

    /**
     * Llama a callback_cuando_ejecuta_bloque con el id del bloque en ejecucion.
     */
    function out_highlightBlock(id) {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(callback_cuando_ejecuta_bloque.call(this, id));
    }

    interpreter.setProperty(scope, 'highlightBlock', interpreter.createNativeFunction(out_highlightBlock));

    /**
     * Conecta este interprete a un mensaje
     *
     * Al recibirse el mensaje el mismo se encolara en la cola de mensajes
     * de este interprete.
     */
    var out_conectar_al_mensaje = function(mensaje) {
      mensaje = mensaje ? mensaje.toString() : '';

      actor.conectar_al_mensaje(mensaje,
        (function (msg) {
            return function () {
              interpreter.pilas_msg_queue.push(msg);
              if(interpreter.pilas_msg_callback !== undefined)
              {
                var callback = interpreter.pilas_msg_callback;
                interpreter.pilas_msg_callback = undefined;
                callback();
              }
            };
          })(mensaje)
      );
    };

    interpreter.setProperty(scope, 'out_conectar_al_mensaje', interpreter.createNativeFunction(out_conectar_al_mensaje));

    /**
     * Retorna y desencola el proximo mensaje de la cola de mensajes o false, si
     * no hay mensajes pendientes.
     */
    function out_proximo_mensaje() {
      var msg = false;
      if(interpreter.pilas_msg_queue.length > 0)
      {
        msg = interpreter.pilas_msg_queue.shift();
      }

      return interpreter.createPrimitive(msg);
    }

    interpreter.setProperty(scope, 'out_proximo_mensaje', interpreter.createNativeFunction(out_proximo_mensaje));

    /**
     * Esperar hasta que la cola de mensajes no este vacía.
     */
    function out_esperar_mensaje(callback) {
      if(interpreter.pilas_msg_queue.length > 0)
      {
        callback();
      }
      else
      {
        interpreter.pilas_msg_callback = callback;
      }
    }

    interpreter.setProperty(scope, 'out_esperar_mensaje', interpreter.createAsyncFunction(out_esperar_mensaje));

    /**
     * Permite al codigo corriendo dentro del interprete indicar que ya se
     * conecto a todos los mensajes que le interesa escuchar.
     *   Esta función no invoca al callback para continuar la ejecución.
     * interpreter.pilas_mensajes_configurados_callback debe ser invocada de
     * manera externa para continuar. Esto permite a un agente externo sincronizar
     * múltiples interpretes, esperando a que todos hayan configurado sus mensajes
     * antes de continuar.
     */
    function out_mensajes_configurados(callback) {
      interpreter.pilas_mensajes_configurados = true;
      interpreter.pilas_mensajes_configurados_callback = callback;
    }

    interpreter.setProperty(scope, 'out_mensajes_configurados', interpreter.createAsyncFunction(out_mensajes_configurados));

    /**
     * Desconecta este interprete de todos los mensajes.
     */
    function out_desconectar_mensajes() {
      actor.desconectar_mensajes();
    }

    interpreter.setProperty(scope, 'out_desconectar_mensajes', interpreter.createNativeFunction(out_desconectar_mensajes));
  }
});

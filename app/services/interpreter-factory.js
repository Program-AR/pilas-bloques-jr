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
  crearInterprete(codigo, callback_cuando_ejecuta_bloque) {
    return new Interpreter(codigo, (interpreter, scope) => {
      return this._initFunction(interpreter, scope, callback_cuando_ejecuta_bloque);
    });
  },

  /**
   * Inicializa el intérprete y su scope inicial, para que
   * pueda usar funcioens como "hacer", "console.log" etc..
   */
  _initFunction(interpreter, scope, callback_cuando_ejecuta_bloque) {

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

    let pilasService = this.get('pilas');

    // Genera la función "out_hacer" que se llamará dentro del intérprete.
    //
    // Esta función encadenará dos comportamientos para simplificar el uso
    // de funciones asincrónicas. Agregará el comportamiento que represente
    // la acción que el usuario quiere hacer con el actor y luego agregará
    // otro comportamiento para indicar que la tarea asincrónica terminó.
    //
    // Por ejemplo, si en el código se llama a la función hacer así:
    //
    //      hacer(actor_id, "Saltar", {});
    //      hacer(actor_id, "Caminar", {pasos: 20});
    //
    // Internamente la función hará que el actor primero "salte" y luego
    // "camine" 20 pasos.
    var hacer_wrapper = function(actor_id, comportamiento, params, callback) {
      actor_id = actor_id ? actor_id.toString() : '';
      comportamiento = comportamiento ? comportamiento.toString() : '';
      params = params ? params.toString() : '';
      params = JSON.parse(params);
      var actor = pilasService.evaluar(`pilas.obtener_actor_por_id("${actor_id}");`);
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


    function out_highlightBlock(id) {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(callback_cuando_ejecuta_bloque.call(this, id));
    }

    interpreter.setProperty(scope, 'highlightBlock', interpreter.createNativeFunction(out_highlightBlock));

    var out_conectar_al_mensaje = function(actor_id, mensaje, funcion, callback) {
      actor_id = actor_id ? actor_id.toString() : '';
      mensaje = mensaje ? mensaje.toString() : '';
      let comportamiento = "ConectarMensaje";

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

      //let highlightBlock = out_highlightBlock;
      //let hacer = hacer_wrapper;

      //let codigo_para_la_funcion = atob(funcion_serializada);

      var actor = pilasService.evaluar(`pilas.obtener_actor_por_id("${actor_id}");`);

      actor.hacer_luego(clase_comportamiento, {mensaje: mensaje, funcion_a_ejecutar: funcion});
      actor.hacer_luego(ComportamientoLlamarCallback, {callback});
    };

    interpreter.setProperty(scope, 'out_conectar_al_mensaje', interpreter.createAsyncFunction(out_conectar_al_mensaje));

  }

});

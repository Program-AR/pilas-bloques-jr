import Ember from 'ember';
import enviromnent from '../../config/environment';

export default Ember.Route.extend({
  pilas: Ember.inject.service(),
  blocksGallery: Ember.inject.service(),
  interpreterFactory: Ember.inject.service(),
  fondos: Ember.inject.service(),

  activate() {
    this.get("blocksGallery").start();
  },

  model(params) {
    return this.store.find('scene', params.scene_id);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('classes', model.get('aux-classes'));

    this.get('fondos').cargarFondosDisponibles(model.get('aux-background'));

    controller.set('currentActor', null);
    controller.set('workspaceFromCurrentActor', '');
  },

  afterModel(model) {
    return Ember.RSVP.hash({
      classes: this.store.findAll('class'),
      backgrounds: this.store.findAll('background')
    }).then((data) => {
      model.set('aux-classes', data.classes);
      model.set('aux-background', data.backgrounds);
    });
  },

  _obtener_codigo_desde_workspace(workspace_en_formato_xml) {
    var lang = Blockly.MyLanguage;
    lang.addReservedWords('code');

    let headless = new Blockly.Workspace();
    let xml = Blockly.Xml.textToDom(workspace_en_formato_xml);

    Blockly.Xml.domToWorkspace(xml, headless);
    let codigoDesdeWorkspace = lang.workspaceToCode(headless);
    headless.dispose();

    return codigoDesdeWorkspace;
  },

  actions: {
    guardarYRegresar() {
      this.get("pilas").obtenerCapturaDePantallaEnMinuatura().then((data) => {
        this.get('controller').sincronizarDesdePilasAModelos();

        this.currentModel.get('project').set("screenshot", data);

        this.currentModel.save().then(() => {
          this.transitionTo('index');
        });
      });
    },

    ejecutar() {
      // Una lista diccionarios que tiene el actor y el código del workspace completo.
      // (por ejemplo [{actor: actor, codigo: 'hacer(...) ....'}])
      let listaDeCodigos = [];

      // Guarda el workspace del actor actual.
      this.controllerFor('editor.scene').sincronizarWorkspaceAlActorActual();
      this.get('controller').definir_modo_edicion(false);
      this.get('controller').set("ejecutando", true);

      // Por cada actor obtiene su workspace como código y lo carga
      // en la listaDeCodigos.
      this.currentModel.get('actors').forEach((actor) => {
        let codigoDesdeWorkspace = this._obtener_codigo_desde_workspace(actor.get('workspaceXMLCode'));

        let codigoCompleto = js_beautify(`
          // -------------------------------------------------------
          var msg_handlers = {};

          function atender_mensajes() {
            var msg = out_proximo_mensaje();

            if (msg) {
              atender_mensaje(msg);
            }
          }

          function atender_mensaje(msg) {

            if (msg_handlers[msg] === undefined) {

              return;
            }

            for (var i = 0; i < msg_handlers[msg].length; i++) {
              msg_handlers[msg][i]();
            }

            atender_mensajes();
          }

          function hacer(comportamiento, params) {
            out_hacer(comportamiento, JSON.stringify(params));
            atender_mensajes();
          }

          function cambiar_fondo(fondo) {
            out_cambiar_fondo(fondo);
          }

          function conectar_al_mensaje(mensaje, funcion) {

            if (msg_handlers[mensaje] === undefined) {
              msg_handlers[mensaje] = [];
              out_conectar_al_mensaje(mensaje);
            }

            msg_handlers[mensaje].push(funcion);
          }

          function desconectar_mensajes() {
            out_desconectar_mensajes();
          }

          function main() {
            desconectar_mensajes();
            ${codigoDesdeWorkspace}
          }

          main();

          while(1) {
            out_esperar_mensaje();
            atender_mensajes();
          }

        `);

        listaDeCodigos.push({actorId: actor.get('actorId'), codigo: codigoCompleto, interprete: null});
      });

      if (enviromnent.mostrarCodigoAEjecutarEnLaConsola) {
        console.warn("Mostrando código generado a continuación porque se activó 'mostrarCodigoAEjecutarEnLaConsola' en las preferencias de entorno:");

        listaDeCodigos.map((item) => {
          console.log("//Codigo para ", item.actorId, "\n", item.codigo);
        });
      }

      // Crear un interprete por actor y correrlos paralelamente
      listaDeCodigos.forEach((item) => {
        item.interprete = this.get('interpreterFactory').crearInterprete(
          item.codigo,
          (pieza) => { this.get('controller').cuando_se_ejecuta_bloque(pieza, item.actorId); },
          item.actorId
        );
      });

      /*
       * Ejecuta un intérprete y mantiene una promesa en suspenso hasta
       * que el intérprete termine de ejecutar todo el código.
       */
      function ejecutarInterpreteHastaTerminar(nombreIdentificador, interprete, condicion_de_corte) {

        return new Ember.RSVP.Promise((success, reject) => {

          function execInterpreterUntilEnd(interpreter) {
            let running;

            // Si el usuario solicitó terminar el programa deja
            // de ejecutar el intérprete.
            if (condicion_de_corte()) {
              success();
              return;
            }

            try {
              running = interpreter.run();
            } catch(e) {
              reject(e);
            }

            if (running) {
              // No terminó, algún comportamiento está en ejecución, así
              // que se re-planifica para continuar más tarde.
              if(interpreter.pilas_mensajes_configurados_callback !== undefined)
              {
                var todos_configurados = true;
                listaDeCodigos.forEach((item) => {
                  todos_configurados = todos_configurados && item.interprete.pilas_mensajes_configurados;
                });
                if(todos_configurados)
                {
                  listaDeCodigos.forEach((item) => {
                    var callback = item.interprete.pilas_mensajes_configurados_callback;
                    item.interprete.pilas_mensajes_configurados_callback = undefined;
                    callback();
                  });
                }
              }
              setTimeout(execInterpreterUntilEnd, 10, interpreter);
            } else {
              success();
            }
          }

          execInterpreterUntilEnd(interprete);

        }, `Intérprete para el actor ${nombreIdentificador}`);

      }


      // Listos,... preparados, ... ahora corran todos

      let condicion_de_corte = () => {
        return ! this.get('controller').get("ejecutando");
      };

      let promesasDeInterpretes = listaDeCodigos.map((item) => {
        return ejecutarInterpreteHastaTerminar(item.clase, item.interprete, condicion_de_corte);
      });

      let label = "Contenedor de promesas de intérpretes";

      // Espera a que todos los intérpretes terminen y cambia el estado
      // de ejecución. Esta promesa siempre retorna exitosamente, incluso
      // si alguno de los intérpretes falla.
      Ember.RSVP.allSettled(promesasDeInterpretes, label).then((result) => {

        // Detecta si finalizó por una interrupción del usuario.
        if (this.get('controller').get("ejecutando")) {
          // En este caso, el usuario interrumpió pulsando el botón detener.
          this.get('controller').set("finalizado", true);
        } else {
          // En este caso, finalizó porque ya se ejecutó todo el código.
          this.get('controller').set("finalizado", false);
        }

        this.get('controller').set("ejecutando", false);

        if (result.mapBy('state').indexOf('rejected') > -1) {
          console.error("Terminó la ejecución pero surgieron los siguientes errores:");

          result.mapBy('reason').forEach((reason) => {
            if (reason) {
              console.error(reason);
            }
          });

          console.error("Se detendrá la ejecución completa del programa.");
        }

      });

    },

    detener() {
      this.get('controller').reiniciar();
      this.get('controller').set("ejecutando", false);
      this.get('controller').set("finalizado", false);
      this.get('controller').definir_modo_edicion(true);
    },

    reiniciar() {
      this.send('detener');
    }
  }
});

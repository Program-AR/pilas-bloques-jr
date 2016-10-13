import Ember from 'ember';
import enviromnent from '../../config/environment';

export default Ember.Route.extend({
  pilas: Ember.inject.service(),
  blocksGallery: Ember.inject.service(),
  interpreterFactory: Ember.inject.service(),

  activate() {
    this.get("blocksGallery").start();
  },

  model(params) {
    return this.store.find('scene', params.scene_id);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('classes', model.get('aux-classes'));
    controller.set('fondosDisponibles', model.get('aux-background'));

    controller.set('currentActor', null);
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
      // Una lista con el identificador del actor, su clase y el código del workspace completo.
      // (por ejemplo [{actorId: 'AA223', clase: 'Aceituna', codigo: 'receptor.decir ....'}])
      let listaDeCodigos = [];

      // Guarda el workspace del actor actual.
      this.controllerFor('editor.scene').sincronizarWorkspaceAlActorActual();
      this.get('controller').definir_modo_edicion(false);

      this.get('controller').set("ejecutando", true);

      // Por cada actor obtiene su workspace como código y lo carga
      // en la listaDeCodigos.
      this.currentModel.get('actors').forEach((actor) => {

        let codigoDesdeWorkspace = this._obtener_codigo_desde_workspace(actor.get('workspaceXMLCode'));

        // El código completo a ejecutar es exactamente el mismo del workspace,
        // pero con la declaración de una variable 'receptor' que señalará
        // al actor dueño del workspace.

        let actorId = actor.get('actorId');
        let actorClass = actor.get('class.className');

        let codigoCompleto = js_beautify(`
          // -------------------------------------------------------
          // Comienza el código para el actor de clase ${actorClass}:

          var actor_id = '${actorId}';

          function hacer(actor, comportamiento, params) {
            out_hacer(actor, comportamiento, JSON.stringify(params));;
          }

          ${codigoDesdeWorkspace}
        `);

        listaDeCodigos.push({actorId: actorId, clase: actorClass, codigo: codigoCompleto, interprete: null});
      });

      if (enviromnent.mostrarCodigoAEjecutarEnLaConsola) {
        listaDeCodigos.map((item) => {
          console.log(item.codigo);
        });
      }

      // Crear un interprete por actor y correrlos paralelamente
      listaDeCodigos.forEach((item) => {
        item.interprete = this.get('interpreterFactory').crearInterprete(item.codigo);
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
        this.get('controller').set("ejecutando", false);
        this.get('controller').definir_modo_edicion(true);

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
      this.get('controller').definir_modo_edicion(true);
    }
  }
});

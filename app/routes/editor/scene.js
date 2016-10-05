import Ember from 'ember';

export default Ember.Route.extend({
  pilas: Ember.inject.service(),
  blocksGallery: Ember.inject.service(),

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
      this.controllerFor('editor.scene').sincronizarWorkspaceAlActorActual();


      var listaDeCodigos = [];

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
          var actor_id = '${actorId}';   // referencia a ${actorClass};

          function hacer(actor, comportamiento, params) {
            // Invocar a la accion fuera del interprete
            out_hacer(actor, comportamiento, JSON.stringify(params));;
          }

          console_log("volvimos del callback");

          ${codigoDesdeWorkspace}
        `);

        listaDeCodigos.push(codigoCompleto);
      });

      listaDeCodigos.forEach((texto) => {
        console.warn("Comienza el código para un actor:");
        console.log(texto);
      });

      let pilasService = this.get('pilas');

      function initFunction(interpreter, scope) {
        var console_log_wrapper = function(txt) {
            txt = txt ? txt.toString() : '';
            return interpreter.createPrimitive(console.log(txt));
        };

        interpreter.setProperty(scope, 'console_log', interpreter.createNativeFunction(console_log_wrapper));

        // Esto deberia estar en otro lado, es un comportamiento que lo unico que
        // hace es llamar a una funcion
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

        // Agrega un comportamiento a un actor
        // Agrega otro comportamiento luego para hacer correr el callback que indica
        // al interprete que la accion async termino.
        var hacer_wrapper = function(actor_id, comportamiento, params, callback) {
            actor_id = actor_id ? actor_id.toString() : '';
            comportamiento = comportamiento ? comportamiento.toString() : '';
            params = params ? params.toString() : '';
            params = JSON.parse(params);
            var actor = pilasService.evaluar(`pilas.obtener_actor_por_id("${actor_id}");`);
            var clase_comportamiento = pilasService.evaluar(`pilas.comportamientos.${comportamiento}`);
            actor.hacer_luego(clase_comportamiento, params);
            actor.hacer_luego(ComportamientoLlamarCallback, {callback});
        };

        interpreter.setProperty(scope, 'out_hacer', interpreter.createAsyncFunction(hacer_wrapper));
      }

      function execInterpreterUntilEnd(interpreter) {
        if (interpreter.run()) {
          // No terminó, esta esperando evento
          setTimeout(execInterpreterUntilEnd, 10, interpreter);
        }
      }

      // Crear un interprete por actor y correrlos paralelamente

      let interpretes = listaDeCodigos.map((codigo) => {
        return new Interpreter(codigo, initFunction);
      });

      // Listos,... preparados, ... ahora corran todos

      interpretes.forEach((interprete) => {
        execInterpreterUntilEnd(interprete);
      });

    }
  }
});

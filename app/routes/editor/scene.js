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

      var lang = Blockly.MyLanguage;
      lang.addReservedWords('code');

      var listaDeCodigos = [];

      // Por cada actor obtiene su workspace como código y lo carga
      // en la listaDeCodigos.
      this.currentModel.get('actors').forEach((actor) => {

        var headless = new Blockly.Workspace();
        let xml = Blockly.Xml.textToDom(actor.get('workspaceXMLCode'));

        Blockly.Xml.domToWorkspace(xml, headless);
        let codigoDesdeWorkspace = lang.workspaceToCode(headless);
        headless.dispose();

        // El código completo a ejecutar es exactamente el mismo del workspace,
        // pero con la declaración de una variable 'receptor' que señalará
        // al actor dueño del workspace.

        let actorId = actor.get('actorId');
        let actorClass = actor.get('class.className');

        let codigoCompleto = js_beautify(`
          var receptor = pilas.obtener_actor_por_id('${actorId}');   // referencia a ${actorClass};

          ${codigoDesdeWorkspace}
        `);

        listaDeCodigos.push(codigoCompleto);
      });

      listaDeCodigos.forEach((texto) => {
        console.warn("Comienza el código para un actor:");
        console.log(texto);
      });

      let pilasService = this.get('pilas');

      // Para obtener el handle de pilas desde una consola se puede
      // incluir una linea aquí de tipo: window.pilasService = pilasService
      // y luego usar algo como: pilas = pilasService.evaluar('pilas')

      function initFunction(interpreter, scope) {

        var obtener_actor_por_id_wrapper = function(id) {
          id = id ? id.toString() : '';
          return interpreter.createPrimitive(pilasService.evaluar('pilas.obtener_actor_por_id'));
        };

        var pilasObjectWrapper = interpreter.createObject(interpreter.OBJECT);
        interpreter.setProperty(scope, 'pilas', pilasObjectWrapper);

        interpreter.setProperty(pilasObjectWrapper, 'obtener_actor_por_id', interpreter.createNativeFunction(obtener_actor_por_id_wrapper));
      }

      let code = listaDeCodigos.join("");
      var myInterpreter = new Interpreter(code, initFunction);
      myInterpreter.run();

    }
  }
});

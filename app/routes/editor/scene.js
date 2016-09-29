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

    controller.set('currentActor', model.get('actors.firstObject'));
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
          (function () {
            var receptor = pilas.obtener_actor_por_id('${actorId}');   // referencia a ${actorClass};

            console.log(receptor);

            ${codigoDesdeWorkspace}
          })();
        `);


        listaDeCodigos.push(codigoCompleto);
      });

      listaDeCodigos.forEach((texto) => {
        console.warn("Comienza el código para un actor:");
        console.log(texto);
      });

      this.get('pilas').evaluar(listaDeCodigos.join(""));

    }
  }
});

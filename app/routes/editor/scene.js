import Ember from 'ember';

export default Ember.Route.extend({
  pilas: Ember.inject.service(),

  model(params) {
    return this.store.find('scene', params.scene_id);
  },

  setupController(controller, model) {
    controller.set('currentActor', null);
    controller.set('model', model);

    this.store.findAll('class').then((data) => {
      controller.set('classes', data);
    });

    this.store.findAll('background').then((data) => {
      controller.set('fondosDisponibles', data);
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
    }
  }
});

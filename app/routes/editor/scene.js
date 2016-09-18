import Ember from 'ember';

export default Ember.Route.extend({
  pilas: Ember.inject.service(),

  model(params) {
    return this.store.find('scene', params.scene_id);
  },

  actions: {
    guardarYRegresar() {
      this.get("pilas").obtenerCapturaDePantallaEnMinuatura().then((data) => {
        console.log("Este proyecto es id: " + this.currentModel.get('project.id'));

        this.currentModel.get('project').set("screenshot", data);

        this.currentModel.save().then(() => {
          this.transitionTo('index');
        });
      });
    }
  }
});

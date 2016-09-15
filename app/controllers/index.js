import Ember from 'ember';

export default Ember.Controller.extend({
  blocks: ['controls_if'],
  pilas: Ember.inject.service(),

  actions: {
    onReady(/*pilas*/) {
      //pilas.definir_modo_edicion(true);
      this.get("pilas").evaluar(`pilas.definir_modo_edicion(true);`);
    },

    crearActor(clase) {
      this.get("pilas").evaluar(`
        var actor = new pilas.actores['${clase}'];
      `);
    }
  }
});

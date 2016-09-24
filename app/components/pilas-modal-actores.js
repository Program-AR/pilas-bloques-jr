import Ember from 'ember';

export default Ember.Component.extend({
  clasesDeActores: null,

  actions: {
    seleccionar(actor) {
      this.sendAction('cuandoSeleccionaActor', actor);
    }
  }
});

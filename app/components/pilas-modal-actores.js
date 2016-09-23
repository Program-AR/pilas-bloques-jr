import Ember from 'ember';

export default Ember.Component.extend({
  actores: [
      {nombre: "actor.mono", clase: 'Mono'},
      {nombre: "actor.aceituna", clase: 'Aceituna'},
  ],

  actions: {
    seleccionar(actor) {
      this.sendAction('cuandoSeleccionaActor', actor);
    }
  }
});

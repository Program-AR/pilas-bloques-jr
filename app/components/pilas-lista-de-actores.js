import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pilas-lista-de-actores'],
  actorSeleccionado: null,
  actions: {
    onSelect(actor) {
      this.sendAction("onSelect", actor);
    }
  }
});

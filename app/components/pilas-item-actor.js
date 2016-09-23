import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  estaSeleccionado: Ember.computed('actorSeleccionado', 'actor', function() {
    return this.get('actor') === this.get('actorSeleccionado');
  }),

  actions: {
    onSelect(actor) {
      this.sendAction("onSelect", actor);
    }
  }
});

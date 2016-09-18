import Ember from 'ember';

export default Ember.Route.extend({
  afterModel(model /*, transition*/) {
    // Direcciona a la escena 1 por omisión.
    this.transitionTo('editor.scene', model, model.get('scenes.firstObject'));
  }
});

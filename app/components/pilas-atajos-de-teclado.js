import Ember from 'ember';
import { EKMixin, keyDown } from 'ember-keyboard';

export default Ember.Component.extend(EKMixin, {

  ejecutarUsandoAtajo: Ember.on(keyDown('Enter+cmd'), function() {
    if (!this.get('ejecutando')) {
      this.sendAction('ejecutar');
    }
  }),

  detenerUsandoAtajo: Ember.on(keyDown('Escape'), function() {
    if (this.get('ejecutando')) {
      this.sendAction('detener');
    }
  }),

});

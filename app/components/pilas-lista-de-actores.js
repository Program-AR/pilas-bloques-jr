import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pilas-lista-de-actores-container'],
  pilas: null,  // se espera como parámetro.
  actores: Ember.computed.alias('pilas.actores')
});

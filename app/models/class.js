import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  className: DS.attr('string'),
  actors: DS.hasMany('actor'),
  blocks: DS.attr(),

  thumbPath: Ember.computed('className', function() {
    let nombre = this.get('className').toLowerCase();
    return `data/miniaturas/actores/miniatura.actor.${nombre}.png`;
  })
});

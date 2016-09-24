import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  className: DS.attr('string'),
  actors: DS.hasMany('actor'),

  thumbPath: Ember.computed('className', function() {
    let nombre = this.get('className').toLowerCase();
    return `data/thumb.actor.${nombre}.png`;
  })
});

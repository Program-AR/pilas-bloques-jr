import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),

  fullName: Ember.computed('name', function() {
    let name = this.get('name');
    return `${name}.png`;
  }),

  thumbPath: Ember.computed('fullName', function() {
    let fullName = this.get('fullName');
    return `data/thumb.${fullName}`;
  })
});

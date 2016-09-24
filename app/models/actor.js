import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  class: DS.belongsTo('class'),
  actorId: DS.attr('string'),
  x: DS.attr('number'),
  y: DS.attr('number'),
  scene: DS.belongsTo('scene'),
  workspaceXMLCode: DS.attr('string'),

  iconPath: Ember.computed('class', function() {
    let name = this.get('class.className');

    if (name) {
      name = name.toLowerCase();
      return `data/icono.${name}.png`;
    }
  })
});

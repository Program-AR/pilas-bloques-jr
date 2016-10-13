import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  class: DS.belongsTo('class'),
  actorId: DS.attr('string'),
  x: DS.attr('number'),
  y: DS.attr('number'),
  scene: DS.belongsTo('scene'),
  workspaceXMLCode: DS.attr('string'),

  iconPath: Ember.computed('class.className', function() {
    let name = this.get('class.className').toLowerCase();
    return `data/miniaturas/iconos/icono.${name}.png`;
  })
});

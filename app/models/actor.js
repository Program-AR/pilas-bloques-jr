import DS from 'ember-data';

export default DS.Model.extend({
  class: DS.attr('string'),
  actorId: DS.attr('string'),
  x: DS.attr('number'),
  y: DS.attr('number'),
  scene: DS.belongsTo('scene'),
  workspaceXMLCode: DS.attr('string')
});

import DS from 'ember-data';

export default DS.Model.extend({
  class: DS.attr('string'),
  metadata: DS.attr('string'),
  scene: DS.belongsTo('scene')
});

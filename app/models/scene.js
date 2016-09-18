import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  project: DS.belongsTo('project'),
  background: DS.attr('string'),
  actors: DS.hasMany('actor')
});

import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  screenshot: DS.attr('string'),
  scenes: DS.hasMany('scene')
});

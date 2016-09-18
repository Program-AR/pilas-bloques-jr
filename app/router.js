import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('editor', {path: "/editor/:project_id"}, function() {
    this.route('scene', {path: "/scene/:scene_id"});
  });
});

export default Router;

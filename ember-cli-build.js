/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {

  var app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['data', 'favicon'],
    },
    minifyJS: { enabled: false },
  });

  app.import('vendor/beautify.js');
  app.import('vendor/acorn_interpreter.js');

  process.setMaxListeners(1000);

  var extraAssets = new Funnel('bower_components/pilasweb', {
    srcDir: '/dist',
    include: ['**'],
    destDir: '/libs/'
  });

  return app.toTree(extraAssets);
};

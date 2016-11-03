/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'pilas-bloques-jr',
    environment: environment,
    rootURL: '/',
    locationType: 'hash',
    desactivarLogsDeMirage: true,
    electronLiveReload: false,
    mostrarCodigoAEjecutarEnLaConsola: true,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'electron') {
    delete ENV['rootURL'];
    ENV.electronLiveReload = true;

    ENV['ember-cli-mirage'] = {
      enabled: true
    };
  }

  if (environment === 'electron-production') {
    delete ENV['rootURL'];
    ENV.electronLiveReload = false;

    ENV['ember-cli-mirage'] = {
      enabled: true
    };
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.locationType = 'hash';
    ENV.rootURL = '/pilas-bloques-jr/';
    ENV['ember-cli-mirage'] = {
      enabled: true
    };
  }


  return ENV;
};

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('pilas-canvas', 'Integration | Component | pilas canvas', {
  integration: true
});

test('invoca al callback al iniciar', function(assert) {


  return new Ember.RSVP.Promise((success) => {

    this.on('onReady', function(/*pilas*/) {
      assert.equal(this.$().text().trim(), '');
      //callback(pilas, resolve, context.get('pilas'));
      success();
    });

    this.render(hbs`{{pilas-canvas onReady="onReady"}}`);

  });
});

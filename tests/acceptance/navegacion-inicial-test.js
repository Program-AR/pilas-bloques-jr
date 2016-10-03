import { test } from 'qunit';
import moduleForAcceptance from 'pilas-bloques-jr/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | navegacion inicial');

test('visiting /navegacion-inicial', function(assert) {
  visit('/');

  andThen(function() {
    return pauseTest();
    assert.equal(currentURL(), '/navegacion-inicial');
  });
});

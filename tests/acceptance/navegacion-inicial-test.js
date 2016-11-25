import { test } from 'qunit';
import moduleForAcceptance from 'pilas-bloques-jr/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | navegacion inicial');

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
    click("#crear-proyecto");
  });

  andThen(function() {
    let url = currentURL();
    assert.ok(url.match(/editor/), "Ingresó al editor");
  });

});

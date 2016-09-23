import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-modal-actores', 'Integration | Component | pilas modal actores', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pilas-modal-actores}}`);
  assert.equal(this.$().text().trim(), 'Seleccioná un actor');
});

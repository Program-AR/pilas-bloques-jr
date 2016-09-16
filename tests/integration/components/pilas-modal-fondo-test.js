import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-modal-fondo', 'Integration | Component | pilas modal fondo', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pilas-modal-fondo pilas_iframe_url="pepe" name='pilas-modal-fondo'}}`);
  assert.equal(this.$().text().trim(), 'Seleccioná un fondo');
});

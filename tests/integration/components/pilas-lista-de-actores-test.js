import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-lista-de-actores', 'Integration | Component | pilas lista de actores', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pilas-lista-de-actores}}`);
  assert.equal(this.$().text().trim(), 'No hay actores por el momento');
});

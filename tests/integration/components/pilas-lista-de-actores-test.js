import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-lista-de-actores', 'Integration | Component | pilas lista de actores', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pilas-lista-de-actores}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pilas-lista-de-actores}}
      template block text
    {{/pilas-lista-de-actores}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

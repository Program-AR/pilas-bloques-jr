import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-atajos-de-teclado', 'Integration | Component | pilas atajos de teclado', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pilas-atajos-de-teclado}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pilas-atajos-de-teclado}}
      template block text
    {{/pilas-atajos-de-teclado}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

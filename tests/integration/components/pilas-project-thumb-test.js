import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pilas-project-thumb', 'Integration | Component | pilas project thumb', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pilas-project-thumb}}`);
  assert.ok(this.$().text());
});

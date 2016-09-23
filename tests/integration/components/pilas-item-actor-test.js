import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('pilas-item-actor', 'Integration | Component | pilas item actor', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{pilas-item-actor}}`);

  assert.equal(this.$().text().trim(), '');

  let actor = new Ember.Object({
    class: 'ClaseDeEjemplo'
  });

  this.set('actor', actor);
  this.render(hbs`{{pilas-item-actor actor=actor}}`);

  assert.equal(this.$().text().trim(), "ClaseDeEjemplo");
  assert.equal(this.$('a')[0].classList.length, 1, 'No tiene clase signada, no está seleccionado.');

  this.set("actorSeleccionado", actor);
  this.set('actor', actor);
  this.render(hbs`{{pilas-item-actor actorSeleccionado=actorSeleccionado actor=actor}}`);
  assert.equal(this.$('a')[0].classList.length, 2, 'Tiene una clase para indicar que el actor está seleccionado.');
});

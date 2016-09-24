import { moduleForModel, test } from 'ember-qunit';

moduleForModel('class', 'Unit | Model | class', {
  needs: ['model:actor']
});

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});

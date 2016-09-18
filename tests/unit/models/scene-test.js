import { moduleForModel, test } from 'ember-qunit';

moduleForModel('scene', 'Unit | Model | scene', {
  // Specify the other units that are required for this test.
  needs: ['model:project', 'model:actor']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

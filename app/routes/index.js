import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('project');
  },

  actions: {
    crearUnProyectoNuevo() {
      this.controller.set('creandoProyecto', true);

      let projectRecord = this.store.createRecord('project', {
        title: 'Nuevo título'
      });

      projectRecord.get('scenes').createRecord({
        title: 'main',
        background: 'fondo.cangrejo_aguafiestas.png'
      }).save();

      projectRecord.save().then(() => {
        this.controller.set('creandoProyecto', false);
        this.transitionTo('editor', projectRecord);
      });
    }
  }
});

import Ember from 'ember';

export default Ember.Controller.extend({
  blocks: ['controls_if'],
  pilas: Ember.inject.service(),
  remodal: Ember.inject.service(),

  actions: {
    onReady(/*pilas*/) {
      //pilas.definir_modo_edicion(true);
      this.get("pilas").evaluar(`pilas.definir_modo_edicion(true);`);
    },

    crearActor(clase) {
      this.get("pilas").evaluar(`
        var actor = new pilas.actores['${clase}'];
      `);
    },

    abrirModalFondo() {
      this.get('remodal').open('pilas-modal-fondo');
    },

    cuandoSeleccionaFondo(fondo) {
      this.get("pilas").sustituirFondo(fondo.nombre + ".png");
      this.get('remodal').close('pilas-modal-fondo');
    }
  }
});

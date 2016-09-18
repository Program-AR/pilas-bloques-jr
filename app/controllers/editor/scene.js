import Ember from 'ember';

export default Ember.Controller.extend({
  blocks: ['controls_if'],
  pilas: Ember.inject.service(),
  remodal: Ember.inject.service(),

  actions: {

    onReady(/*pilas*/) {
      this.get("pilas").sustituirFondo(this.model.get('background'));
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
      let nombreCompletoDelFondo = fondo.nombre + ".png";

      this.get("pilas").sustituirFondo(nombreCompletoDelFondo);
      this.model.set('background', nombreCompletoDelFondo);
      this.get('remodal').close('pilas-modal-fondo');
    }
  }
});

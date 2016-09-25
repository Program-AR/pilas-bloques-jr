import Ember from 'ember';

export default Ember.Component.extend({
  fondosDisponibles: null,

  actions: {
    seleccionar(fondo) {
      this.sendAction('cuandoSeleccionaFondo', fondo);
    }
  }
});

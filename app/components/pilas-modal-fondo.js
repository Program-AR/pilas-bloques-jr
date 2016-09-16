import Ember from 'ember';

export default Ember.Component.extend({
  fondos: [
      {nombre: "fondo.cangrejo_aguafiestas"},
      {nombre: "fondo.tresNaranjas"},
      {nombre: "fondo.tito-cuadrado"},
      {nombre: "fondo.fiestadracula"},
      {nombre: "fondo.elPlanetaDeNano"},
  ],

  actions: {
    seleccionar(fondo) {
      this.sendAction('cuandoSeleccionaFondo', fondo);
    }
  }
});

import Ember from 'ember';

export default Ember.Service.extend({
  listaDeFondos: null,

  cargarFondosDisponibles(fondos) {
    this.set('listaDeFondos', fondos);
  },

  obtenerFondosParaDropdown() {
    return this.get('listaDeFondos').map((fondo) => {
      return [{src: fondo.get('thumbPath'), width: 40, height: 40, alt: fondo.get('name')}, fondo.get('name')];
    });
  }

});

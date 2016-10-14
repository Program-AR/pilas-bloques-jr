class Sandia extends ActorAnimado {

  constructor(x, y) {
    super(x, y, {grilla: 'actores/actor.Sandia.png', cantColumnas: 5, cantFilas: 1});

    this.definirAnimacion("parado", [0], 6, true);
    this.definirAnimacion("comida", [1], 12);
  }

  consumir() {
    this.cargarAnimacion('comida');
  }

}

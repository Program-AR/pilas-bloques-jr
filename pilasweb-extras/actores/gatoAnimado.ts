class GatoAnimado extends ActorAnimado {

  constructor(x, y) {
    super(x, y, {grilla: 'actores/actor.GatoAnimado.png', cantColumnas: 7, cantFilas: 7});

    this.definirAnimacion("parado", [0], 6, true);
    this.definirAnimacion("saltar", [46], 6);
    this.definirAnimacion("hablar", [3, 5, 4, 5], 8);
  }

}

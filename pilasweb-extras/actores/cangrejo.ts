class Cangrejo extends ActorAnimado {

  constructor(x, y) {
    super(x, y, {grilla: 'actores/actor.CangrejoAnimado.png', cantColumnas: 8, cantFilas: 3});

    this.definirAnimacion("parado", [0, 1, 2, 3, 4, 5, 6, 7], 6, true);
    //this.definirAnimacion("correr", [9, 10, 11, 12, 13], 12);
    //this.definirAnimacion("recoger", [17, 18, 19, 20, 21, 21, 21, 19, 19], 6);
    this.definirAnimacion("saltar", [8], 6);
    this.definirAnimacion("hablar", [14, 15, 22, 15], 5);
  }

}

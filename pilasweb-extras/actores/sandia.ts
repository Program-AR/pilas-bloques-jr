class Sandia extends ActorAnimado {
  cantidadDeMordidas: number = 0;

  constructor(x, y) {
    super(x, y, {grilla: 'actores/actor.Sandia.png', cantColumnas: 5, cantFilas: 1});

    this.definirAnimacion("parado", [0], 6, true);
    this.definirAnimacion("comida1", [1], 12);
    this.definirAnimacion("comida2", [2], 12);
    this.definirAnimacion("comida3", [3], 12);
    this.definirAnimacion("comida4", [4], 12);
  }

  consumir() {
    this.cantidadDeMordidas += 1;

    if (this.cantidadDeMordidas > 4) {
      this.cantidadDeMordidas = 4;
      console.warn("TODO: Se intentó consumir mas de 4 veces esta sandia. ¿Ocultamos el actor?.");
    }

    this.cargarAnimacion('comida' + this.cantidadDeMordidas);
  }

}

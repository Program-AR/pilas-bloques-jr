class Consumir extends ComportamientoAnimado {
  contadorDeSegundos: number;
  segundosAEsperar: number;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.contadorDeSegundos = 0;
    this.segundosAEsperar = 1;

    if (this.receptor['consumir']) {
      this.receptor.consumir();
    } else {
      throw new Error("No se puede consumir el actor indicado.");
    }
  }

  actualizar() {
    this.contadorDeSegundos += 1/60.0;

    if (this.contadorDeSegundos > this.segundosAEsperar) {
      return true;
    }
  }
}

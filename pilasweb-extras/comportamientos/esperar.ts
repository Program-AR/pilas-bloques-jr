class EsperarSegundos extends ComportamientoAnimado {
  contadorDeSegundos: number;
  segundosAEsperar: number;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.contadorDeSegundos = 0;
    this.segundosAEsperar = this.obtenerArgumento('segundos');
  }

  actualizar() {
    this.contadorDeSegundos += 1/100.0;

    this.receptor.avanzarAnimacion();

    if (this.contadorDeSegundos > this.segundosAEsperar) {
      return true;
    }
  }
}

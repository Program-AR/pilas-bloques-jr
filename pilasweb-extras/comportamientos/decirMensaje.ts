class DecirMensaje extends ComportamientoAnimado {
  tiempoParaAvanzar: number = 3;
  globo;

  iniciar(receptor) {
    super.iniciar(receptor);
    let mensaje = this.obtenerArgumento('mensaje');
    this.globo = new pilas.actores.Globo(this.receptor, mensaje);
    this.receptor.cargarAnimacion('hablar');
  }

  actualizar() {
    super.actualizar();
    this.avanzarAnimacion();

    this.tiempoParaAvanzar -= 1/60;

    if (this.tiempoParaAvanzar < 0) {
      return true;
    }
  }
}

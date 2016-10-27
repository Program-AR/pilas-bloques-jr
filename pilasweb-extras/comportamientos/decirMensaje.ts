class DecirMensaje extends ComportamientoAnimado {
  tiempoParaAvanzar: number = 3.2;
  globo;

  iniciar(receptor) {
    super.iniciar(receptor);
    let mensaje = this.obtener_mensaje();
    this.globo = new pilas.actores.Globo(this.receptor, mensaje);
    this.receptor.cargarAnimacion('hablar');
  }

  obtener_mensaje() {
    return this.obtenerArgumento('mensaje');
  }

  actualizar() {
    super.actualizar();
    this.avanzarAnimacion();

    this.tiempoParaAvanzar -= 1/60;

    if (this.tiempoParaAvanzar < 0) {
      this.receptor.cargarAnimacion('parado');
      return true;
    }
  }
}

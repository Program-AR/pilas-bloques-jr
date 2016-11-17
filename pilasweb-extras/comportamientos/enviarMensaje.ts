class EnviarMensaje extends ComportamientoAnimado {

  iniciar(receptor) {
    super.iniciar(receptor);
    this.receptor.emitir_mensaje(this.obtenerArgumento('mensaje'));
  }

  actualizar() {
    return true;
  }
}

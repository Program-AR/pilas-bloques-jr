class ComportamientoAnimado extends Comportamiento {

  iniciar(receptor) {
    super.iniciar(receptor);
  }

  /**
   * Intenta obtener un argumento enviado al realizar el comportamiento.
   *
   * Este método arrojará un error si el argumento no se envía al
   * realizar el comportamiento.
   *
   * Por ejemplo, si llamamos a:
   *
   *  >> actor.hacer_luego(UnComportamiento, {tiempo: 2, ejemplo: 'a'}
   *
   *  Este método respondería:
   *
   *  >> this.obtenerArgumento('tiempo')   ->   2
   *  >> this.obtenerArgumento('ejemplo')  ->  'a'
   *  >> this.obtenerArgumento('otro')     ->  ARROJARÁ UN ERROR
   */
  obtenerArgumento(nombre) {
    if (this.argumentos[nombre] === undefined) {
      throw new Error(`Falta el argumento obligatorio '${nombre}'.`);
    }

    return this.argumentos[nombre];
  }

  actualizar() {
  }

  /**
   * Intenta avanzar la animación actual si el actor entiene el mensaje.
   *
   * Si el actor no admite animaciones evita dar un error.
   */
  avanzarAnimacion() {
    if (this.receptor['avanzarAnimacion']) {
      return this.receptor.avanzarAnimacion();
    }
  }
}

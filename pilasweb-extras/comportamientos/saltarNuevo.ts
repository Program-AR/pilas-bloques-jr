class SaltarNuevo extends ComportamientoAnimado {
  posicionInicialY: number;
  velocidadVertical: number;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.posicionInicialY = receptor.y;
    this.velocidadVertical = 15;
  }

  actualizar() {
    this.velocidadVertical -= 0.5;

    this.receptor.y += this.velocidadVertical;

    // Si toca el suelo detiene el comportamiento.
    if (this.receptor.y < this.posicionInicialY) {
      this.receptor.y = this.posicionInicialY;
      return true;
    }
  }
}

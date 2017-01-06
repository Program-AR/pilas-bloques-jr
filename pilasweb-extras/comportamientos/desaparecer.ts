class Desaparecer extends ComportamientoAnimado {

  iniciar(receptor) {
    super.iniciar(receptor);
  }

  actualizar() {
    super.actualizar();
    this.receptor.transparencia += 1;

    if (this.receptor.transparencia >= 100) {
      this.receptor.transparencia = 100;
      return true;
    }
  }
}

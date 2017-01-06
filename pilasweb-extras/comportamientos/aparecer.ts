class Aparecer extends ComportamientoAnimado {

  iniciar(receptor) {
    super.iniciar(receptor);
  }

  actualizar() {
    super.actualizar();
    this.receptor.transparencia -= 1;

    if (this.receptor.transparencia <= 0) {
      this.receptor.transparencia = 0;
      return true;
    }
  }
}

class CaminarHaciaLaDerecha extends ComportamientoAnimado {
  contador: number;
  longitud: number;
  velocidad: number;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.receptor.cargarAnimacion('caminar');
    this.contador = 0;
    this.velocidad = 3;
    this.longitud = 40;
  }

  actualizar() {
    this.avanzarAnimacion();
    this.receptor.x += this.velocidad;
    this.contador += 1;

    if (this.contador > this.longitud) {
      this.receptor.cargarAnimacion('parado');
      return true;
    }
  }
}

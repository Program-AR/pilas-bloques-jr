///<reference path="../../dist/libs/pilasweb.d.ts"/>

class ActorAnimado extends Actor {
  opciones;

  constructor(x, y, opciones) {
    super("aceituna.png", x, y);

    this.sanitizarOpciones(opciones);
    this.imagen = this.animacionPara(this.opciones.grilla);
  }

  sanitizarOpciones(ops) {
    this.opciones = ops;
    //this.opciones.cuadrosCorrer = ops.cuadrosCorrer || this.seguidillaHasta(ops.cantColumnas) || [0];
    //this.opciones.cuadrosParado = ops.cuadrosParado || [0];
    this.opciones.cantColumnas = ops.cantColumnas || this.opciones.cuadrosCorrer.length;
    this.opciones.cantFilas = ops.cantFilas || 1;
  }

  definirAnimacion(nombre, cuadros, velocidad, cargarla = false) {
    this._imagen.definir_animacion(nombre, cuadros, velocidad);

    if (cargarla) {
      this.cargarAnimacion(nombre);
    }
  }

  cargarAnimacion(nombre) {
    this._imagen.cargar_animacion(nombre);
  }

  animacionPara(nombre) {
    return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
  }
}
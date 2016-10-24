///<reference path="../../dist/libs/pilasweb.d.ts"/>

class ActorAnimado extends Actor {
  opciones;

  constructor(x, y, opciones) {
    super("sin_imagen.png", x, y);

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
    if (!this._imagen.animaciones[nombre]) {
      console.warn(`No se puede cargar la animación '${nombre}', se ignorará la llamada a 'cargarAnimacion'.`);
      return;
    }

    this._imagen.cargar_animacion(nombre);
  }

  animacionPara(nombre) {
    return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
  }

  avanzarAnimacion() {
    return this._imagen.avanzar();
  }

}

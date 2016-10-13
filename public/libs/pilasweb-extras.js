var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ActorAnimado = (function (_super) {
    __extends(ActorAnimado, _super);
    function ActorAnimado(x, y, opciones) {
        _super.call(this, "aceituna.png", x, y);
        this.sanitizarOpciones(opciones);
        this.imagen = this.animacionPara(this.opciones.grilla);
    }
    ActorAnimado.prototype.sanitizarOpciones = function (ops) {
        this.opciones = ops;
        this.opciones.cantColumnas = ops.cantColumnas || this.opciones.cuadrosCorrer.length;
        this.opciones.cantFilas = ops.cantFilas || 1;
    };
    ActorAnimado.prototype.definirAnimacion = function (nombre, cuadros, velocidad, cargarla) {
        if (cargarla === void 0) { cargarla = false; }
        this._imagen.definir_animacion(nombre, cuadros, velocidad);
        if (cargarla) {
            this.cargarAnimacion(nombre);
        }
    };
    ActorAnimado.prototype.cargarAnimacion = function (nombre) {
        this._imagen.cargar_animacion(nombre);
    };
    ActorAnimado.prototype.animacionPara = function (nombre) {
        return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
    };
    return ActorAnimado;
}(Actor));
var Cangrejo = (function (_super) {
    __extends(Cangrejo, _super);
    function Cangrejo(x, y) {
        _super.call(this, x, y, { grilla: 'actores/cangrejo.png', cantColumnas: 8, cantFilas: 3 });
        this.definirAnimacion("parado", [0, 1, 2, 3, 4, 5, 6, 7], 6, true);
        this.definirAnimacion("correr", [9, 10, 11, 12, 13], 12);
        this.definirAnimacion("recoger", [17, 18, 19, 20, 21, 21, 21, 19, 19], 6);
    }
    Cangrejo.prototype.avanzarAnimacion = function () {
        return this._imagen.avanzar();
    };
    return Cangrejo;
}(ActorAnimado));
var ComportamientoAnimado = (function (_super) {
    __extends(ComportamientoAnimado, _super);
    function ComportamientoAnimado() {
        _super.apply(this, arguments);
    }
    ComportamientoAnimado.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
    };
    ComportamientoAnimado.prototype.obtenerArgumento = function (nombre) {
        if (this.argumentos[nombre] === undefined) {
            throw new Error("Falta el argumento obligatorio '" + nombre + "'.");
        }
        return this.argumentos[nombre];
    };
    ComportamientoAnimado.prototype.actualizar = function () {
    };
    return ComportamientoAnimado;
}(Comportamiento));
var EsperarSegundos = (function (_super) {
    __extends(EsperarSegundos, _super);
    function EsperarSegundos() {
        _super.apply(this, arguments);
    }
    EsperarSegundos.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.contadorDeSegundos = 0;
        this.segundosAEsperar = this.obtenerArgumento('segundos');
    };
    EsperarSegundos.prototype.actualizar = function () {
        this.contadorDeSegundos += 1 / 60.0;
        if (this.receptor['avanzarAnimacion']) {
            this.receptor.avanzarAnimacion();
        }
        if (this.contadorDeSegundos > this.segundosAEsperar) {
            return true;
        }
    };
    return EsperarSegundos;
}(ComportamientoAnimado));

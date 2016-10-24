var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ActorAnimado = (function (_super) {
    __extends(ActorAnimado, _super);
    function ActorAnimado(x, y, opciones) {
        _super.call(this, "sin_imagen.png", x, y);
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
        if (!this._imagen.animaciones[nombre]) {
            console.warn("No se puede cargar la animaci\u00F3n '" + nombre + "', se ignorar\u00E1 la llamada a 'cargarAnimacion'.");
            return;
        }
        this._imagen.cargar_animacion(nombre);
    };
    ActorAnimado.prototype.animacionPara = function (nombre) {
        return pilas.imagenes.cargar_animacion(nombre, this.opciones.cantColumnas, this.opciones.cantFilas);
    };
    ActorAnimado.prototype.avanzarAnimacion = function () {
        return this._imagen.avanzar();
    };
    return ActorAnimado;
}(Actor));
var Cangrejo = (function (_super) {
    __extends(Cangrejo, _super);
    function Cangrejo(x, y) {
        _super.call(this, x, y, { grilla: 'actores/actor.CangrejoAnimado.png', cantColumnas: 8, cantFilas: 3 });
        this.definirAnimacion("parado", [0, 1, 2, 3, 4, 5, 6, 7], 6, true);
        this.definirAnimacion("saltar", [8], 6);
        this.definirAnimacion("hablar", [14, 15, 22, 15], 5);
    }
    return Cangrejo;
}(ActorAnimado));
var GatoAnimado = (function (_super) {
    __extends(GatoAnimado, _super);
    function GatoAnimado(x, y) {
        _super.call(this, x, y, { grilla: 'actores/actor.GatoAnimado.png', cantColumnas: 7, cantFilas: 7 });
        this.definirAnimacion("parado", [0], 6, true);
        this.definirAnimacion("saltar", [46], 6);
        this.definirAnimacion("hablar", [3, 5, 4, 5], 8);
    }
    return GatoAnimado;
}(ActorAnimado));
var Sandia = (function (_super) {
    __extends(Sandia, _super);
    function Sandia(x, y) {
        _super.call(this, x, y, { grilla: 'actores/actor.Sandia.png', cantColumnas: 5, cantFilas: 1 });
        this.cantidadDeMordidas = 0;
        this.definirAnimacion("parado", [0], 6, true);
        this.definirAnimacion("comida1", [1], 12);
        this.definirAnimacion("comida2", [2], 12);
        this.definirAnimacion("comida3", [3], 12);
        this.definirAnimacion("comida4", [4], 12);
    }
    Sandia.prototype.consumir = function () {
        this.cantidadDeMordidas += 1;
        if (this.cantidadDeMordidas > 4) {
            this.cantidadDeMordidas = 4;
            console.warn("TODO: Se intentó consumir mas de 4 veces esta sandia. ¿Ocultamos el actor?.");
        }
        this.cargarAnimacion('comida' + this.cantidadDeMordidas);
    };
    return Sandia;
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
    ComportamientoAnimado.prototype.avanzarAnimacion = function () {
        if (this.receptor['avanzarAnimacion']) {
            return this.receptor.avanzarAnimacion();
        }
    };
    return ComportamientoAnimado;
}(Comportamiento));
var Consumir = (function (_super) {
    __extends(Consumir, _super);
    function Consumir() {
        _super.apply(this, arguments);
    }
    Consumir.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.contadorDeSegundos = 0;
        this.segundosAEsperar = 1;
        if (this.receptor['consumir']) {
            this.receptor.consumir();
        }
        else {
            throw new Error("No se puede consumir el actor indicado.");
        }
    };
    Consumir.prototype.actualizar = function () {
        this.contadorDeSegundos += 1 / 60.0;
        if (this.contadorDeSegundos > this.segundosAEsperar) {
            return true;
        }
    };
    return Consumir;
}(ComportamientoAnimado));
var DecirMensaje = (function (_super) {
    __extends(DecirMensaje, _super);
    function DecirMensaje() {
        _super.apply(this, arguments);
        this.tiempoParaAvanzar = 3;
    }
    DecirMensaje.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        var mensaje = this.obtenerArgumento('mensaje');
        this.globo = new pilas.actores.Globo(this.receptor, mensaje);
        this.receptor.cargarAnimacion('hablar');
    };
    DecirMensaje.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        this.avanzarAnimacion();
        this.tiempoParaAvanzar -= 1 / 60;
        if (this.tiempoParaAvanzar < 0) {
            return true;
        }
    };
    return DecirMensaje;
}(ComportamientoAnimado));
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
        this.avanzarAnimacion();
        if (this.contadorDeSegundos > this.segundosAEsperar) {
            return true;
        }
    };
    return EsperarSegundos;
}(ComportamientoAnimado));
var SaltarNuevo = (function (_super) {
    __extends(SaltarNuevo, _super);
    function SaltarNuevo() {
        _super.apply(this, arguments);
    }
    SaltarNuevo.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.posicionInicialY = receptor.y;
        this.velocidadVertical = 15;
        this.receptor.cargarAnimacion('saltar');
    };
    SaltarNuevo.prototype.actualizar = function () {
        this.avanzarAnimacion();
        this.velocidadVertical -= 0.5;
        this.receptor.y += this.velocidadVertical;
        if (this.receptor.y < this.posicionInicialY) {
            this.receptor.y = this.posicionInicialY;
            this.receptor.cargarAnimacion('parado');
            return true;
        }
    };
    return SaltarNuevo;
}(ComportamientoAnimado));

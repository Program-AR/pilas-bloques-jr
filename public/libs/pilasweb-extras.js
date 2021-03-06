var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ActorAnimado = (function (_super) {
    __extends(ActorAnimado, _super);
    function ActorAnimado(x, y, opciones) {
        var _this = _super.call(this, "sin_imagen.png", x, y) || this;
        _this.sanitizarOpciones(opciones);
        _this.imagen = _this.animacionPara(_this.opciones.grilla);
        return _this;
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
        var _this = _super.call(this, x, y, { grilla: 'actores/actor.CangrejoAnimado.png', cantColumnas: 8, cantFilas: 3 }) || this;
        _this.definirAnimacion("parado", [0, 1, 2, 3, 4, 5, 6, 7], 6, true);
        _this.definirAnimacion("saltar", [8], 6);
        _this.definirAnimacion("hablar", [14, 15], 5);
        return _this;
    }
    return Cangrejo;
}(ActorAnimado));
var GatoAnimado = (function (_super) {
    __extends(GatoAnimado, _super);
    function GatoAnimado(x, y) {
        var _this = _super.call(this, x, y, { grilla: 'actores/actor.GatoAnimado.png', cantColumnas: 7, cantFilas: 7 }) || this;
        _this.definirAnimacion("parado", [0], 6, true);
        _this.definirAnimacion("saltar", [46], 6);
        _this.definirAnimacion("hablar", [3, 5, 4, 5], 8);
        return _this;
    }
    return GatoAnimado;
}(ActorAnimado));
var Sandia = (function (_super) {
    __extends(Sandia, _super);
    function Sandia(x, y) {
        var _this = _super.call(this, x, y, { grilla: 'actores/actor.Sandia.png', cantColumnas: 5, cantFilas: 1 }) || this;
        _this.cantidadDeMordidas = 0;
        _this.definirAnimacion("parado", [0], 6, true);
        _this.definirAnimacion("comida1", [1], 12);
        _this.definirAnimacion("comida2", [2], 12);
        _this.definirAnimacion("comida3", [3], 12);
        _this.definirAnimacion("comida4", [4], 12);
        return _this;
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
        return _super.apply(this, arguments) || this;
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
var Aparecer = (function (_super) {
    __extends(Aparecer, _super);
    function Aparecer() {
        return _super.apply(this, arguments) || this;
    }
    Aparecer.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
    };
    Aparecer.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        this.receptor.transparencia -= 1;
        if (this.receptor.transparencia <= 0) {
            this.receptor.transparencia = 0;
            return true;
        }
    };
    return Aparecer;
}(ComportamientoAnimado));
var CaminarHacia = (function (_super) {
    __extends(CaminarHacia, _super);
    function CaminarHacia() {
        return _super.apply(this, arguments) || this;
    }
    CaminarHacia.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.receptor.cargarAnimacion('caminar');
        this.contador = 0;
        this.velocidad = 3;
        this.longitud = 20;
    };
    CaminarHacia.prototype.actualizar = function () {
        this.realizar_movimiento();
        this.avanzarAnimacion();
        this.contador += 1;
        if (this.contador > this.longitud) {
            this.receptor.cargarAnimacion('parado');
            return true;
        }
    };
    CaminarHacia.prototype.realizar_movimiento = function () {
    };
    return CaminarHacia;
}(ComportamientoAnimado));
var CaminarHaciaLaDerecha = (function (_super) {
    __extends(CaminarHaciaLaDerecha, _super);
    function CaminarHaciaLaDerecha() {
        return _super.apply(this, arguments) || this;
    }
    CaminarHaciaLaDerecha.prototype.realizar_movimiento = function () {
        this.receptor.x += this.velocidad;
    };
    return CaminarHaciaLaDerecha;
}(CaminarHacia));
var CaminarHaciaLaIzquierda = (function (_super) {
    __extends(CaminarHaciaLaIzquierda, _super);
    function CaminarHaciaLaIzquierda() {
        return _super.apply(this, arguments) || this;
    }
    CaminarHaciaLaIzquierda.prototype.realizar_movimiento = function () {
        this.receptor.x -= this.velocidad;
    };
    return CaminarHaciaLaIzquierda;
}(CaminarHacia));
var CaminarHaciaArriba = (function (_super) {
    __extends(CaminarHaciaArriba, _super);
    function CaminarHaciaArriba() {
        return _super.apply(this, arguments) || this;
    }
    CaminarHaciaArriba.prototype.realizar_movimiento = function () {
        this.receptor.y += this.velocidad;
    };
    return CaminarHaciaArriba;
}(CaminarHacia));
var CaminarHaciaAbajo = (function (_super) {
    __extends(CaminarHaciaAbajo, _super);
    function CaminarHaciaAbajo() {
        return _super.apply(this, arguments) || this;
    }
    CaminarHaciaAbajo.prototype.realizar_movimiento = function () {
        this.receptor.y -= this.velocidad;
    };
    return CaminarHaciaAbajo;
}(CaminarHacia));
var ConectarMensaje = (function (_super) {
    __extends(ConectarMensaje, _super);
    function ConectarMensaje() {
        return _super.apply(this, arguments) || this;
    }
    ConectarMensaje.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        var mensaje = this.obtenerArgumento('mensaje');
        var funcion_a_ejecutar = this.obtenerArgumento('funcion_a_ejecutar');
        this.receptor.conectar_al_mensaje(mensaje, funcion_a_ejecutar);
    };
    ConectarMensaje.prototype.actualizar = function () {
        return true;
    };
    return ConectarMensaje;
}(ComportamientoAnimado));
var Consumir = (function (_super) {
    __extends(Consumir, _super);
    function Consumir() {
        return _super.apply(this, arguments) || this;
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
        var _this = _super.apply(this, arguments) || this;
        _this.tiempoParaAvanzar = 3.2;
        return _this;
    }
    DecirMensaje.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        var mensaje = this.obtener_mensaje();
        this.globo = new pilas.actores.Globo(this.receptor, mensaje);
        this.receptor.cargarAnimacion('hablar');
    };
    DecirMensaje.prototype.obtener_mensaje = function () {
        return this.obtenerArgumento('mensaje');
    };
    DecirMensaje.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        this.avanzarAnimacion();
        this.tiempoParaAvanzar -= 1 / 60;
        if (this.tiempoParaAvanzar < 0) {
            this.receptor.cargarAnimacion('parado');
            return true;
        }
    };
    return DecirMensaje;
}(ComportamientoAnimado));
var DecirPosicion = (function (_super) {
    __extends(DecirPosicion, _super);
    function DecirPosicion() {
        return _super.apply(this, arguments) || this;
    }
    DecirPosicion.prototype.obtener_mensaje = function () {
        var x = this.receptor.x;
        var y = this.receptor.y;
        return "Mi posici\u00F3n es (" + x + ", " + y + ")";
    };
    return DecirPosicion;
}(DecirMensaje));
var Desaparecer = (function (_super) {
    __extends(Desaparecer, _super);
    function Desaparecer() {
        return _super.apply(this, arguments) || this;
    }
    Desaparecer.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
    };
    Desaparecer.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        this.receptor.transparencia += 1;
        if (this.receptor.transparencia >= 100) {
            this.receptor.transparencia = 100;
            return true;
        }
    };
    return Desaparecer;
}(ComportamientoAnimado));
var EnviarMensaje = (function (_super) {
    __extends(EnviarMensaje, _super);
    function EnviarMensaje() {
        return _super.apply(this, arguments) || this;
    }
    EnviarMensaje.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.receptor.emitir_mensaje(this.obtenerArgumento('mensaje'));
    };
    EnviarMensaje.prototype.actualizar = function () {
        return true;
    };
    return EnviarMensaje;
}(ComportamientoAnimado));
var EsperarSegundos = (function (_super) {
    __extends(EsperarSegundos, _super);
    function EsperarSegundos() {
        return _super.apply(this, arguments) || this;
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
        return _super.apply(this, arguments) || this;
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

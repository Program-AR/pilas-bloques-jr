class CaminarHacia extends ComportamientoAnimado {
  contador: number;
  longitud: number;
  velocidad: number;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.receptor.cargarAnimacion('caminar');
    this.contador = 0;
    this.velocidad = 3;
    this.longitud = 20;
  }

  actualizar() {
    this.realizar_movimiento(); // template method
    this.avanzarAnimacion();
    this.contador += 1;

    if (this.contador > this.longitud) {
      this.receptor.cargarAnimacion('parado');
      return true;
    }
  }

  realizar_movimiento() {
    // Template method
  }
}

class CaminarHaciaLaDerecha extends CaminarHacia {
  realizar_movimiento() {
    this.receptor.x += this.velocidad;
  }
}


class CaminarHaciaLaIzquierda extends CaminarHacia {
  realizar_movimiento() {
    this.receptor.x -= this.velocidad;
  }
}

class CaminarHaciaArriba extends CaminarHacia {
  realizar_movimiento() {
    this.receptor.y += this.velocidad;
  }
}

class CaminarHaciaAbajo extends CaminarHacia {
  realizar_movimiento() {
    this.receptor.y -= this.velocidad;
  }
}

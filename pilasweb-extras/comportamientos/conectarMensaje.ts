class ConectarMensaje extends ComportamientoAnimado {
  globo;

  iniciar(receptor) {
    super.iniciar(receptor);
    let mensaje = this.obtenerArgumento('mensaje');
    let funcion_a_ejecutar = this.obtenerArgumento('funcion_a_ejecutar');

    // NOTA: Aquí la función no se recibe correctamente.
    this.receptor.conectar_al_mensaje(mensaje, funcion_a_ejecutar);
  }

  actualizar() {
    return true;
  }
}

class DecirPosicion extends DecirMensaje {

  obtener_mensaje() {
    let x = this.receptor.x;
    let y = this.receptor.y;

    return `Mi posición es (${x}, ${y})`;
  }

}

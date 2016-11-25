import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pilas-splitter-container'],
  panelIzquierdoID: null,
  panelDerechoID: null,
  deslizador: null,

  didInsertElement() {

    if (this.get('deslizador')) {
      this.definirAnchoPanelIzquierdo(420 - this.get('deslizador'));
    }

    this.$('#splitter').on("mousedown", (event) => {
      event.preventDefault();

      $('#over-splitter').show();

      let initialX = event.pageX;
      let initialWidth = this.obtenerAnchoPanelIzquierdo();

      $('#over-splitter').on("mousemove", (event) => {
        let dx = (event.pageX - initialX);
        let newWidth = initialWidth + dx;

        // Aplica límites de tamaño, entre 200 y 800.
        newWidth = Math.max(newWidth, 200);
        newWidth = Math.min(newWidth, 800);

        this.definirAnchoPanelIzquierdo(newWidth);

        $(window).trigger('resize');
        window.dispatchEvent(new Event('resize'));
      });

      $('.over-splitter').on("mouseup", function() {
        $('.over-splitter').off("mousemove");
        $('.over-splitter').hide();
      });

    });

  },

  obtenerPanelIzquierdo() {
    let panelIzquierdo = '#' + this.get("panelIzquierdoID");
    return $(panelIzquierdo);
  },

  definirAnchoPanelIzquierdo(ancho) {
    this.set('deslizador', 420 - ancho);
    this.obtenerPanelIzquierdo().width(ancho);
  },

  obtenerAnchoPanelIzquierdo() {
    return this.obtenerPanelIzquierdo().width();
  },

});

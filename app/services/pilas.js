import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Service.extend(Ember.Evented, {
  iframe: null,
  actorCounter: 0,
  pilas: null,
  loading: true,
  nombreDeLaEscenaActual: null,
  actores: [], /* Una lista con los actores de la escena. */
  temporallyCallback: null, /* almacena el callback para avisar si pilas
                               se reinició correctamente. */

  /**
   * Instancia pilas-engine con los atributos que le envíe
   * el componente x-canvas.
   *
   * Este método realiza una conexión con el servicio pilas, y
   * se llamará automáticamente ante dos eventos: se agrega el
   * componente x-canvas a un template o se ha llamado a `reload`
   * en el servicio pilas.
   *
   * @public
   */
  inicializarPilas(iframeElement, options) {
    this.set("iframe", iframeElement);
    this.set("loading", true);

    return new Ember.RSVP.Promise((success) => {
      let width = options.width;
      let height = options.height;
      let listaImagenes = ['fondo.cangrejo_aguafiestas.png',
                           'fondo.elPlanetaDeNano.png',
                           'fondo.fiestadracula.png',
                           'fondo.tito-cuadrado.png',
                           'fondo.tresNaranjas.png',
                          ];
      let listaImagenesSerializada = listaImagenes.join("|");

      var code = `
        var canvasElement = document.getElementById('canvas');
        var listaImagenes = "${listaImagenesSerializada}".split("|");
        var opciones = {ancho: ${width},
                        alto: ${height},
                        canvas: canvasElement,
                        data_path: '${ENV.rootURL}data',
                        imagenesExtra: listaImagenes,
                      };

        var pilas = pilasengine.iniciar(opciones);

        pilas;
      `;

      let pilas = iframeElement.contentWindow.eval(code);


      this.conectarEventos();

      pilas.onready = () => {

        //this.sustituirFondo('fondo.cangrejo_aguafiestas.png');

        //this.get('actividad').iniciarEscena();
        //var contenedor = document.getElementById('contenedor-blockly');
        //this.get('actividad').iniciarBlockly(contenedor);

        //if (this.get('actividad')['finalizaCargarBlockly']) {
        //  this.get('actividad').finalizaCargarBlockly();
        //}

        success(pilas);

        /*
         * Si el usuario llamó a "reload" desde este servicio, tendría
         * que existir una promesa en curso, así que estas lineas se
         * encargan de satisfacer esa promesa llamando al callback success.
         */
        if (this.get("temporallyCallback")) {
          this.get("temporallyCallback")(pilas);
          this.set("temporallyCallback", null);
        }

        this.set("loading", false);

      };

      pilas.ejecutar();

      this.on('seAgregaUnActor', (/*datos*/) => {
        this.set('actores', this.obtenerListaDeActores());
      });

      this.on('seEliminaUnActor', (/*datos*/) => {
        this.set('actores', this.obtenerListaDeActores());
      });

      this.on('comienzaAMoverUnActor', (actor) => {
        console.log(actor);
      });

    });
  },

  /**
   * Libera los eventos y recursos instanciados por este servicio.
   *
   * @method liberarRecursos
   * @public
   */
  liberarRecursos() {
    this.desconectarEventos();
  },

  /**
   * Captura cualquier mensaje desde el iframe y lo propaga
   * como un evento de ember evented.
   *
   * Los eventos que se originan en el iframe tienen la forma:
   *
   *     {
   *       tipo: "tipoDeMensaje"    # Cualquiera de los listados más arriba.
   *       detalle: [...]           # string con detalles para ese evento.
   *     }
   *
   * Sin embargo esta función separa esa estructura para que sea más
   * sencillo capturarla dentro de ember.
   *
   * Por ejemplo, si queremos capturar un error (como hace la batería de tests),
   * podemos escribir:
   *
   *     pilas.on('errorDeActividad', function(motivoDelError) {
   *       // etc...
   *     });
   *
   * @method contectarEventos
   * @private
   *
   */
  conectarEventos() {
    $(window).on("message.fromIframe", (e) => {
      let datos = e.originalEvent.data;
      this.trigger(datos.tipo, datos);
    });
  },

  /**
   * Se llama automáticamente para desconectar los eventos del servicio.
   *
   * @method desconectarEventos
   * @private
   */
  desconectarEventos() {
    $(window).off("message.fromIframe");
  },

  inicializarEscena(iframeElement, nombreDeLaEscena) {
    let codigo = `
      var escena = new ${nombreDeLaEscena}();
      pilas.mundo.gestor_escenas.cambiar_escena(escena);
    `;

    this.evaluar(codigo);
    this.set("nombreDeLaEscenaActual", nombreDeLaEscena);
  },

  /**
   * Evalúa código reiniciando completamente la biblioteca.
   *
   * @method ejecutarCodigo
   * @public
   */
  ejecutarCodigo(codigo) {
    this.reiniciar().then(() => {
      let iframeElement = this.get("iframe");
      iframeElement.contentWindow.eval(codigo);
    });
  },

  /**
   * Ejecuta el código reiniciando la escena rápidamente.
   *
   * @method ejecutarCodigoSinReiniciar
   * @public
   *
   * @todo convertir en método privado.
   */
  ejecutarCodigoSinReiniciar(codigo) {

    if (this.get("loading")) {
      console.warn("Cuidado, no se puede ejecutar antes de que pilas cargue.");
      return;
    }

    let iframeElement = this.get("iframe");

    this.reiniciarEscenaCompleta();

    iframeElement.contentWindow.eval(codigo);
  },

  /**
   * Retorna una captura de pantalla de la escena en formato png/base64
   *
   * @method obtenerCapturaDePantalla
   * @public
   */
  obtenerCapturaDePantalla() {
    let iframeElement = this.get("iframe");
    return iframeElement.contentWindow.document.getElementById('canvas').toDataURL('image/png');
  },

  /**
   * Retorna una captura de pantalla en formato miniatura (105x120)
   *
   * @method obtenerCapturaDePantallaEnMinuatura
   * @public
   */
  obtenerCapturaDePantallaEnMinuatura() {
    return new Ember.RSVP.Promise((success) => {

      function resizedataURL(datas, wantedWidth, wantedHeight) {
          let img = document.createElement('img');

          img.onload = function() {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');

            canvas.width = wantedWidth;
            canvas.height = wantedHeight;

            ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);
            let dataURI = canvas.toDataURL();
            success(dataURI);
            img.src = "";
          };

          img.src = datas;
      }

      let data = this.obtenerCapturaDePantalla();
      resizedataURL(data, 105, 120);
    });
  },

  /**
   * Realiza un reinicio rápido de la escena actual.
   *
   * @method reiniciarEscenaCompleta
   * @private
   */
  reiniciarEscenaCompleta() {
    let iframeElement = this.get("iframe");
    iframeElement.contentWindow.eval("pilas.reiniciar();");
    this.inicializarEscena(iframeElement, this.get("nombreDeLaEscenaActual"));
  },

  /**
   * Permite reiniciar pilas por completo.
   *
   * La acción de reinicio se realiza re-cargando el iframe
   * que contiene a pilas, así que se va a volver a llamar al
   * método `instanciarPilas` automáticamente.
   *
   * Este método retorna una promesa, que se cumple cuando pilas se
   * halla cargado completamente.
   *
   * @method reiniciar
   * @private
   */
  reiniciar() {
    return new Ember.RSVP.Promise((success) => {
      if (this.get("loading")) {
        console.warn("Cuidado, se está reiniciando en medio de la carga.");
      }

      this.set("loading", true);
      this.get("iframe").contentWindow.location.reload(true);

      /* Guarda el callback  para que se llame luego de la carga de pilas. */
      this.set("temporallyCallback", success);
    });
  },

  /**
   * Evalúa código directamente, sin reiniciar de ninguna forma.
   *
   * @method evaluar
   * @public
   */
  evaluar(codigo) {
    let iframeElement = this.get("iframe");
    return iframeElement.contentWindow.eval(codigo);
  },

  sustituirFondo(imagen_de_fondo) {
    this.evaluar(`
      pilas.escena_actual().fondo.imagen = "${imagen_de_fondo}";
      pilas.escena_actual().fondo.z = 2000;
    `);

  },


  obtenerListaDeActores() {
    return this.evaluar(`
      pilas.obtener_actores_en_la_escena().map(function(actor) {
        return actor.getClassName();
      });
    `);
  },

  descatarAlActorPorId(idActor) {
    return this.evaluar(`
      var actor = pilas.obtener_actor_por_id("${idActor}");
      var dt = 100;

      function ponerSombra(actor) {
        var color = "rgba(0,0,0,0.5)";
        actor.sprite.shadow = new createjs.Shadow(color, 5, 5, 2);
      }

      function quitarSombra(actor) {
        actor.sprite.shadow = null;
      }


      ponerSombra(actor);

      setTimeout(function() {
        quitarSombra(actor);
      }, dt);

      setTimeout(function() {
        ponerSombra(actor);
      }, dt * 2);

      setTimeout(function() {
        quitarSombra(actor);
      }, dt * 3);

    `);
  }


});

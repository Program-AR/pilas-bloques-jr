import Ember from 'ember';

export default Ember.Controller.extend({
  pilas: Ember.inject.service(),
  remodal: Ember.inject.service(),
  currentActor: null,

  /* Retorna los bloques que se podrían utilizar con el actor seleccionado */
  blocksForCurrentActor: Ember.computed('currentActor', function() {

    if (this.get('currentActor.class') === "Mono") {
      return ['controls_if'];
    }

    return [];
  }),

  sincronizarDesdePilasAModelos() {
    this.model.get('actors').forEach((actor) => {
      let actorId = actor.get('actorId');
      let objetoActor = this.get('pilas').evaluar(`pilas.obtener_actor_por_id("${actorId}")`);
      actor.set('x', objetoActor.x);
      actor.set('y', objetoActor.y);
    });
  },

  crearActor(clase) {
    let actor = this.get("pilas").evaluar(`
      var actor = new pilas.actores['${clase}'];
      actor;
    `);

    let actorId = actor.id;
    let data = actor.serializar();

    let record = this.store.createRecord('actor', {
      class: data.clase,
      actorId: actorId,
      x: data.x,
      y: data.y,
      scene: this.model
    });

    record.save();
  },

  actions: {

    onReady(/*pilas*/) {
      this.get("pilas").sustituirFondo(this.model.get('background'));

      this.model.get('actors').forEach((actor) => {
        let data = actor.getProperties("class", "x", "y", "actorId");

        this.get("pilas").evaluar(`
          actor = new pilas.actores['${data.class}']();
          actor.x = ${data.x};
          actor.y = ${data.y};
          actor.id = '${data.actorId}';
        `);
      });

      this.get("pilas").evaluar(`pilas.definir_modo_edicion(true);`);
    },


    abrirModalFondo() {
      this.get('remodal').open('pilas-modal-fondo');
    },

    abrirModalActores() {
      this.get('remodal').open('pilas-modal-actores');
    },

    cuandoSeleccionaFondo(fondo) {
      let nombreCompletoDelFondo = fondo.nombre + ".png";

      this.get("pilas").sustituirFondo(nombreCompletoDelFondo);
      this.model.set('background', nombreCompletoDelFondo);
      this.get('remodal').close('pilas-modal-fondo');
    },

    cuandoSeleccionaActor(actor) {
      this.crearActor(actor.clase);
      this.get('remodal').close('pilas-modal-actores');
    },

    onSelect(actor) {
      this.get("pilas").descatarAlActorPorId(actor.get('actorId'));
      this.set('currentActor', actor);
      console.log("Ha seleccionado al actor " + actor);
    }
  }
});

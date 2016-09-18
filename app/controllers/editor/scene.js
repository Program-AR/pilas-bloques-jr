import Ember from 'ember';

export default Ember.Controller.extend({
  blocks: ['controls_if'],
  pilas: Ember.inject.service(),
  remodal: Ember.inject.service(),

  sincronizarDesdePilasAModelos() {
    this.model.get('actors').forEach((actor) => {
      let actorId = actor.get('actorId');
      let objetoActor = this.get('pilas').evaluar(`pilas.obtener_actor_por_id("${actorId}")`);
      actor.set('x', objetoActor.x);
      actor.set('y', objetoActor.y);
    });
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

    abrirModalFondo() {
      this.get('remodal').open('pilas-modal-fondo');
    },

    cuandoSeleccionaFondo(fondo) {
      let nombreCompletoDelFondo = fondo.nombre + ".png";

      this.get("pilas").sustituirFondo(nombreCompletoDelFondo);
      this.model.set('background', nombreCompletoDelFondo);
      this.get('remodal').close('pilas-modal-fondo');
    }
  }
});

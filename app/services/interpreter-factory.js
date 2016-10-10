import Ember from 'ember';


export default Ember.Service.extend({
  pilas: Ember.inject.service(),

  crearInterprete(codigo) {
    return new Interpreter(codigo, (interpreter, scope) => {
      return this.initFunction(interpreter, scope);
    });
  },

  initFunction(interpreter, scope) {

    var console_log_wrapper = function(txt) {
      txt = txt ? txt.toString() : '';
      return interpreter.createPrimitive(console.log(txt));
    };

    interpreter.setProperty(scope, 'console_log', interpreter.createNativeFunction(console_log_wrapper));

    // Esto deberia estar en otro lado, es un comportamiento que lo unico que
    // hace es llamar a una función.
    var ComportamientoLlamarCallback = function(args) {
      this.argumentos = args;

      this.iniciar = function() {
      };

      this.actualizar = function() {
        this.argumentos.callback();
        return true;
      };

      this.eliminar = function() {
      };
    };

    let pilasService = this.get('pilas');

    // Agrega un comportamiento a un actor
    // Agrega otro comportamiento luego para hacer correr el callback que indica
    // al interprete que la accion async termino.
    var hacer_wrapper = function(actor_id, comportamiento, params, callback) {
      actor_id = actor_id ? actor_id.toString() : '';
      comportamiento = comportamiento ? comportamiento.toString() : '';
      params = params ? params.toString() : '';
      params = JSON.parse(params);
      var actor = pilasService.evaluar(`pilas.obtener_actor_por_id("${actor_id}");`);
      var clase_comportamiento = pilasService.evaluar(`pilas.comportamientos.${comportamiento}`);
      actor.hacer_luego(clase_comportamiento, params);
      actor.hacer_luego(ComportamientoLlamarCallback, {callback});
    };

    interpreter.setProperty(scope, 'out_hacer', interpreter.createAsyncFunction(hacer_wrapper));
  }

});

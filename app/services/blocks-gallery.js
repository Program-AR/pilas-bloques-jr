import Ember from 'ember';

export default Ember.Service.extend({

  start() {
    this._definirBloques();
    this._generarLenguaje();
  },

  _definirBloques() {

    Blockly.Blocks['decir'] = {
      init: function() {
        this.jsonInit({
          "message0": 'Decir %1',
          "args0": [
            {
              "type": "input_value",
              "name": "mensaje",
              "check": "String"
            }
          ],
          "previousStatement": true,
          "nextStatement": true,
          "colour": 160
        });
      }
    };

    Blockly.Blocks['esperar'] = {
      init: function() {
        this.jsonInit({
          "message0": 'Esperar %1 segundos',
          "args0": [
            {
              "type": "input_value",
              "name": "segundos",
              "check": "Number"
            }
          ],
          "previousStatement": true,
          "nextStatement": true,
          "colour": 160
        });
      }
    };

    Blockly.Blocks['saltar'] = {
      init: function() {
        this.jsonInit({
          "message0": 'Saltar',
          "previousStatement": true,
          "nextStatement": true,
          "colour": 160
        });
      }
    };

    Blockly.Blocks['consumir'] = {
      init: function() {
        this.jsonInit({
          "message0": 'Consumir',
          "previousStatement": true,
          "nextStatement": true,
          "colour": 160
        });
      }
    };

    Blockly.Blocks['al_empezar_a_ejecutar'] = {
      init: function() {
        this.setColour(200);

        this.appendDummyInput().appendField('Al empezar a ejecutar');

        this.appendStatementInput('program');
        this.setDeletable(false);

        this.setEditable(false);
        this.setMovable(false);
      }
    };


    Blockly.Blocks['caminar_hacia_la_derecha'] = {
      init: function() {
        this.jsonInit({
          "message0": 'CaminarHaciaLaDerecha',
          "previousStatement": true,
          "nextStatement": true,
          "colour": 160
        });
      }
    };

    Blockly.Blocks['decir_posicion'] = {
      init: function() {
        this.jsonInit({
          "message0": 'DecirPosicion',
          "previousStatement": true,
          "nextStatement": true,
          "colour": 160
        });
      }
    };

    Blockly.Blocks['enviar_mensaje'] = {
      init: function() {
        this.jsonInit({
          "message0": 'Enviar el mensaje %1',
          "args0": [
            {
              "type": "input_value",
              "name": "mensaje",
              "check": "String"
            }
          ],
          "previousStatement": true,
          "nextStatement": true,
          "colour": 160
        });
      }
    };

    Blockly.Blocks['al_recibir_mensaje'] = {
      init: function() {
        this.jsonInit({
          "message0": 'Al recibir el mensaje %1 hacer lo siguiente',
          "colour": 200,
          "args0": [
            {
              "type": "input_value",
              "name": "mensaje",
              "check": "String"
            }
          ],
          "message1": "%1",
          "args1": [
            {"type": "input_statement", "name": "do"}
          ],
        });
      }
    };
  },

  _generarLenguaje() {

    Blockly.MyLanguage = Blockly.JavaScript;
    Blockly.MyLanguage.addReservedWords('main', 'hacer', 'out_hacer',
      'highlightBlock', 'out_conectar_al_mensaje', 'atender_mensaje',
      'atender_mensajes', 'out_proximo_mensaje' , 'msg_handlers',
      'out_esperar_mensaje', 'out_mensajes_configurados');


    Blockly.MyLanguage['decir'] = function(block) {
      let mensaje = Blockly.MyLanguage.valueToCode(block, 'mensaje') || null;

      if (!mensaje) {
        console.warn("No se especificó el mensaje, mostrando 'Sin mensaje ...'");
        mensaje = "'Sin mensaje ...'";
      }

      return `hacer(actor_id, "DecirMensaje", {mensaje: ${mensaje}});`;
    };

    Blockly.MyLanguage['esperar'] = function(block) {
      var segundos = Blockly.MyLanguage.valueToCode(block, 'segundos') || null;

      if (!segundos) {
        console.warn("No se especificó la cantidad de segundos a esperar, aplicando el valor por omisión 1.");
        segundos = '1';
      }

      return `hacer(actor_id, "EsperarSegundos", {segundos: ${segundos}});`;
    };

    Blockly.MyLanguage['saltar'] = function(/*block*/) {
      return `hacer(actor_id, "SaltarNuevo", {});`;
    };

    Blockly.MyLanguage['consumir'] = function() {
      return `hacer(actor_id, "Consumir", {});`;
    };

    Blockly.MyLanguage['caminar_hacia_la_derecha'] = function() {
      return `hacer(actor_id, "CaminarHaciaLaDerecha", {});`;
    };

    Blockly.MyLanguage['decir_posicion'] = function() {
      return `hacer(actor_id, "DecirPosicion", {});`;
    };

    Blockly.MyLanguage['al_empezar_a_ejecutar'] = function(block) {
      let programa = Blockly.JavaScript.statementToCode(block, 'program');
      let codigo = `
      out_mensajes_configurados();
      ${programa}`;

      return codigo;
    };

    Blockly.MyLanguage['enviar_mensaje'] = function(block) {
      let mensaje = Blockly.MyLanguage.valueToCode(block, 'mensaje') || null;

      if (!mensaje) {
        console.warn("No se especificó el mensaje a enviar.");
        mensaje = "'Sin mensaje ...'";
      }

      return `hacer(actor_id, "EnviarMensaje", {mensaje: ${mensaje}});`;
    };

    Blockly.MyLanguage['al_recibir_mensaje'] = function(block) {
      let mensaje = Blockly.MyLanguage.valueToCode(block, 'mensaje') || null;
      let bloque_do = Blockly.MyLanguage.statementToCode(block, 'do');

      if (!mensaje) {
        console.warn("No se especificó el mensaje a enviar.");
        mensaje = "'Sin mensaje ...'";
      }

      //let funcion_serializada = btoa(bloque_do);

      let codigo = `
        conectar_al_mensaje(actor_id, ${mensaje}, function() {
          ${bloque_do};
        });
      `;
      if(Blockly.MyLanguage.definitions_['msg_handlers'] === undefined)
      {
        Blockly.MyLanguage.definitions_['msg_handlers'] = "";
      }
      Blockly.MyLanguage.definitions_['msg_handlers'] += codigo + "\n";
      return null;
    };

    Blockly.MyLanguage.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.MyLanguage.addReservedWords('highlightBlock');
  }

});

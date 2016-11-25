import Ember from 'ember';

export default Ember.Service.extend({
  blockly: Ember.inject.service(),

  start() {
    let blockly = this.get('blockly');

    this._crearBloquesParaEmitirMensajes(blockly);
    this._crearBloquesParaRecibirMensajes(blockly);

    this._definirBloques();
    this._generarLenguaje();
  },

  _crearBloquesParaEmitirMensajes(blockly) {
    Blockly.FieldColour.COLOURS = ['#f00', '#0f0', '#00f',
                                   '#B437B0', '#888', '#0095FF',
                                   '#FFFC00', '#fff', '#E665B4'];
    Blockly.FieldColour.COLUMNS = 3;

    blockly.createCustomBlock('enviar_mensaje_de_color', {
      message0: "Enviar el color %1",
      args0: [
        {
          "type": "field_colour",
          "name": "COLOR",
          "colour": "#ff0000"
        }
      ],
      colour: 160,
      previousStatement: true,
      nextStatement: true,
      code: "hacer('EnviarMensaje', {mensaje: '$COLOR'});"
    });


  },

  _crearBloquesParaRecibirMensajes(blockly) {

    blockly.createCustomBlock('al_recibir_mensaje_de_color', {
      "message0": 'Al recibir el color %1 hacer lo siguiente',
      "colour": 200,
      "args0": [
        {
          "type": "field_colour",
          "name": "COLOR",
          "colour": "#ff0000"
        }
      ],
      "message1": "%1",
      "args1": [
        {"type": "input_statement", "name": "do"}
      ],
    });


    Blockly.MyLanguage['al_recibir_mensaje_de_color'] = function(block) {
      let color = block.getFieldValue('COLOR');
      let bloque_do = Blockly.MyLanguage.statementToCode(block, 'do');

      let codigo = `
        conectar_al_mensaje('${color}', function() {
          ${bloque_do};
        });
      `;

      if (Blockly.MyLanguage.definitions_['msg_handlers'] === undefined) {
        Blockly.MyLanguage.definitions_['msg_handlers'] = "";
      }

      Blockly.MyLanguage.definitions_['msg_handlers'] += codigo + "\n";
      return null;
    };

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


  },

  _generarLenguaje() {

    Blockly.MyLanguage = Blockly.JavaScript;
    Blockly.MyLanguage.addReservedWords('main', 'hacer', 'out_hacer',
      'highlightBlock', 'out_conectar_al_mensaje', 'atender_mensaje',
      'atender_mensajes', 'out_proximo_mensaje' , 'msg_handlers',
      'out_esperar_mensaje', 'out_mensajes_configurados',
      'desconectar_mensajes', 'out_desconectar_mensajes');


    Blockly.MyLanguage['decir'] = function(block) {
      let mensaje = Blockly.MyLanguage.valueToCode(block, 'mensaje') || null;

      if (!mensaje) {
        console.warn("No se especificó el mensaje, mostrando 'Sin mensaje ...'");
        mensaje = "'Sin mensaje ...'";
      }

      return `hacer("DecirMensaje", {mensaje: ${mensaje}});`;
    };

    Blockly.MyLanguage['esperar'] = function(block) {
      var segundos = Blockly.MyLanguage.valueToCode(block, 'segundos') || null;

      if (!segundos) {
        console.warn("No se especificó la cantidad de segundos a esperar, aplicando el valor por omisión 1.");
        segundos = '1';
      }

      return `hacer("EsperarSegundos", {segundos: ${segundos}});`;
    };

    Blockly.MyLanguage['saltar'] = function(/*block*/) {
      return `hacer("SaltarNuevo", {});`;
    };

    Blockly.MyLanguage['consumir'] = function() {
      return `hacer("Consumir", {});`;
    };

    Blockly.MyLanguage['caminar_hacia_la_derecha'] = function() {
      return `hacer("CaminarHaciaLaDerecha", {});`;
    };

    Blockly.MyLanguage['decir_posicion'] = function() {
      return `hacer("DecirPosicion", {});`;
    };

    Blockly.MyLanguage['al_empezar_a_ejecutar'] = function(block) {
      let programa = Blockly.JavaScript.statementToCode(block, 'program');
      let codigo = `
      out_mensajes_configurados();
      ${programa}`;

      return codigo;
    };

    Blockly.MyLanguage.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.MyLanguage.addReservedWords('highlightBlock');
  }

});

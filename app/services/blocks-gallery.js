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
    let blockly = this.get('blockly');

    blockly.createCustomBlock('decir', {
      message0: 'Decir %1',
      args0: [
        {
          "type": "field_input",
          "name": "MENSAJE",
          "text": "Hola !!!"
        }
      ],
      previousStatement: true,
      nextStatement: true,
      colour: 160,
      code: `hacer("DecirMensaje", {mensaje: $MENSAJE});`
    });

    blockly.createCustomBlock('esperar', {
      message0: 'Esperar %1 segundos',
      args0: [
        {
          "type": "field_number",
          "name": "SEGUNDOS",
          "value": 2
        }
      ],
      previousStatement: true,
      nextStatement: true,
      colour: 160,
      code: 'hacer("EsperarSegundos", {segundos: $SEGUNDOS});'
    });

    blockly.createCustomBlock('saltar', {
      message0: 'Saltar',
      previousStatement: true,
      nextStatement: true,
      colour: 160,
      code: 'hacer("SaltarNuevo", {});'
    });

    blockly.createCustomBlock('consumir', {
      message0: 'Consumir',
      previousStatement: true,
      nextStatement: true,
      colour: 160,
      code: 'hacer("Consumir", {});'
    });

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

    blockly.createCustomBlock('caminar_hacia_la_derecha', {
      message0: 'CaminarHaciaLaDerecha',
      previousStatement: true,
      nextStatement: true,
      colour: 160,
      code: 'hacer("CaminarHaciaLaDerecha", {});'
    });

    blockly.createCustomBlock('decir_posicion', {
      message0: 'DecirPosicion',
      previousStatement: true,
      nextStatement: true,
      colour: 160,
      code: 'hacer("DecirPosicion", {});'
    });

  },

  _generarLenguaje() {

    Blockly.MyLanguage = Blockly.JavaScript;
    Blockly.MyLanguage.addReservedWords('main', 'hacer', 'out_hacer',
      'highlightBlock', 'out_conectar_al_mensaje', 'atender_mensaje',
      'atender_mensajes', 'out_proximo_mensaje' , 'msg_handlers',
      'out_esperar_mensaje', 'out_mensajes_configurados',
      'desconectar_mensajes', 'out_desconectar_mensajes');

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

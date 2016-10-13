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
              "name": "texto",
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
          "message0": 'EsperarSegundos %1',
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

  },

  _generarLenguaje() {

    Blockly.MyLanguage = Blockly.JavaScript;

    Blockly.MyLanguage['decir'] = function(block) {
      var texto = Blockly.MyLanguage.valueToCode(block, 'texto', Blockly.MyLanguage.ORDER_NONE) || '\'\'';
      return `receptor.decir(${texto});`;
    };

    Blockly.MyLanguage['esperar'] = function(block) {
      var segundos = Blockly.MyLanguage.valueToCode(block, 'segundos', Blockly.MyLanguage.ORDER_NONE) || '\'\'';
      return `hacer(actor_id, "EsperarSegundos", {segundos: ${segundos}});`;
    };

    Blockly.MyLanguage['saltar'] = function(/*block*/) {
      return `hacer(actor_id, "Saltar", {});`;
    };

    Blockly.MyLanguage['al_empezar_a_ejecutar'] = function(block) {
      let programa = Blockly.JavaScript.statementToCode(block, 'program');
      let codigo = `${programa}`;

      return codigo;
    };

    // Blockly.MyLanguage.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    // Blockly.MyLanguage.addReservedWords('highlightBlock');
  }

});

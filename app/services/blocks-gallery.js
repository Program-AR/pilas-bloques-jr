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

    console.warn("Generando lenguaje");

    Blockly.MyLanguage = Blockly.JavaScript;

    Blockly.MyLanguage['decir'] = function(block) {
      var texto = Blockly.MyLanguage.valueToCode(block, 'texto', Blockly.MyLanguage.ORDER_NONE) || '\'\'';
      return `receptor.decir(${texto});`;
    };

    Blockly.MyLanguage['al_empezar_a_ejecutar'] = function(block) {
      let programa = Blockly.JavaScript.statementToCode(block, 'program');
      let codigo = `
      // CODIGO AL PRINCIPIO

      ${programa}

      // CODIGO AL FINAL
      `;

      return codigo;
    };

  }

});

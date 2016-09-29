import Ember from 'ember';

export default Ember.Service.extend({

  start() {
    this._definirBloques();
    this._generarLenguaje();
  },

  _definirBloques() {

    Blockly.Blocks['green_color'] = {
      init: function() {
        this.jsonInit({
          "message0": 'Green',
          "output": "Color",
          "colour": 200
        });
      }
    };

    Blockly.Blocks['set_color'] = {
      init: function() {
        this.jsonInit({
          "message0": 'Set color to %1',
          "args0": [
            {
              "type": "input_value",
              "name": "COLOR",
              "check": "Color"
            }
          ],
          "previousStatement": true,
          "nextStatement": true,
          "colour": 160
        });
      }
    };

  },

  _generarLenguaje() {

    console.warn("Generando lenguaje");

    Blockly.MyLanguage = Blockly.JavaScript;

    Blockly.MyLanguage['set_color'] = function(block) {
      var color = Blockly.MyLanguage.valueToCode(block, 'COLOR',
      Blockly.MyLanguage.ORDER_NONE) || '\'\'';
      var code = 'setColor('+color+');\n';
      return code;
    };

    Blockly.MyLanguage['red_color'] = function(block) {
      var code = '"red"';
      return [code, Blockly.MyLanguage.ORDER_ADDITION];
    };

    Blockly.MyLanguage['green_color'] = function(block) {
      var code = '"green"';
      return [code, Blockly.MyLanguage.ORDER_ADDITION];
    };
  }

});

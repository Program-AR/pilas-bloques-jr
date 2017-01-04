import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  href: null,
  inElectron: false,

  didInsertElement() {
    this.set('inElectron', inElectron);
  },

  actions: {
    abrirConNavegadorExterno(url) {
      console.log("open external:", url);
      const {shell} = require('electron');
      shell.openExternal(url);
    }
  }
});

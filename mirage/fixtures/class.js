let bloquesComunes = [
  {
    category: 'Primitivas',
    blocks: ['text', 'math_number', 'esperar', 'decir', 'saltar']
  },
  {
    category: 'Repeticiones',
    blocks: ['controls_repeat']
  }
];


let bloquesSandia = [
  {
    category: 'Primitivas',
    blocks: ['math_number', 'esperar', 'consumir'],
  }
];



export default [
  {id: 3, name: 'cangrejo', className: 'Cangrejo', blocks: bloquesComunes},
  {id: 4, name: 'sandia', className: 'Sandia', blocks: bloquesSandia},
  {id: 5, name: 'gato', className: 'GatoAnimado', blocks: bloquesComunes},

  /*
  {id: 2, name: 'mono', className: 'Mono', blocks: bloquesComunes},
  {id: 3, name: 'aceituna', className: 'Aceituna', blocks: bloquesComunes},
  {id: 4, name: 'alien', className: 'Alien', blocks: bloquesComunes},
  */
];

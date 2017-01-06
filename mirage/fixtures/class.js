let bloquesComunes = [
  {
    category: 'Primitivas',
    blocks: ['esperar', 'decir', 'saltar', 'cambiar_fondo', 'aparecer', 'desaparecer']
  },
  {
    category: 'Movimientos',
    blocks: ['CaminarHaciaLaDerecha', 'CaminarHaciaArriba', 'CaminarHaciaLaIzquierda', 'CaminarHaciaAbajo']
  },
  {
    category: 'Repeticiones',
    blocks: ['controls_repeat']
  },
  {
    category: 'Mis Procedimientos',
    blocks: ['procedures_defnoreturn', 'procedures_defreturn']
  },
  {
    category: 'Mensajes',
    blocks: ['enviar_mensaje_de_color', 'al_recibir_mensaje_de_color']
  }
];


let bloquesSandia = [
  {
    category: 'Primitivas',
    blocks: ['esperar', 'consumir'],
  },
  {
    category: 'Repeticiones',
    blocks: ['controls_repeat']
  },
  {
    category: 'Mis Procedimientos',
    blocks: ['procedures_defnoreturn', 'procedures_defreturn']
  },
  {
    category: 'Mensajes',
    blocks: ['enviar_mensaje_de_color', 'al_recibir_mensaje_de_color']
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

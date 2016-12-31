# Mensajes

Este documento describe el funcionamiento de los mensajes en Pilas Bloques Jr. Incluyendo la vinculación entre el interprete de código y el motor de mensajes de Pilas.

El usuario cuenta con dos bloques para le manejo de mensajes, el de envío y el de recepción, que permiten emitir un mensaje y vincular bloques a la recepción de un mensaje particular, respectivamente.

Extensión del interprete de código
----------------------------------

Se extendió el interprete con las siguientes propiedades:
  - `pilas_msg_queue`: Cola de mensajes recibidos y aun no atendidos.
  - `pilas_mensajes_configurados`: Indica si el código interpretado terminó de conectarse a mensajes e invocó `out_mensajes_configurados`.
  - `out_mensajes_configurados` pone `pilas_mensajes_configurados` en `true` y espera hasta que sea invocado el método `pilas_mensajes_configurados_callback` del interprete para continuar.

Attach
----------------

El bloque `al_recibir_mensaje` añade el siguiente código a la sección
`msg_handlers` que antecede al demás código generado.

    conectar_al_mensaje(${mensaje}, function() {
      ${bloque_do};
    });

La función `conectar_al_mensaje` corre dentro del interprete y hace lo siguiente:
  - Si el diccionario `msg_handlers` no tiene una entrada para `mensaje`, crea una con una lista vacia.
  - `msg_handlers[mensaje].push(f)` donde f es la función pasada como segúndo parámetro a `conectar_al_mensaje`

Esta función ademas ejecuta `out_conectar_al_mensaje(mensaje)` que es una función que corre en el contexto externo al interprete y lo que hace es conectar el actor al mensaje pasando como callback una función que pushea el mensaje en la cola `pilas_msg_queue` del objeto interprete, en el contexto de ejecución externo al código interpretado.

Luego de conectar todos los mensajes se ejecuta `out_mensajes_configurados` para indicar que se terminaron de conectar todos los mensajes. Esto permite a un controlador externo que maneja múltiples interpretes esperar a que todos hayan conectado sus mensajes antes de comenzar la ejecución.

Envio
---------------

Código generado por el bloque `enviar_mensaje`:

    hacer("EnviarMensaje", {mensaje: ${mensaje}});

La función `hacer` corre dentro del interprete e invóca a `hacer_out` que corre en el contexto externo al interprete y es la encargada de vincular el comportamiento al actor.

Recepción
---------------

Luego de cada `hacer` se ejecuta `atender_mensajes()` que mediante `out_proximo_mensaje` obtiene el siguiente mensaje de la cola `pilas_msg_queue` y lo procesa con los manejadores configurados en `msg_handlers` en el contexto del código interpretado.

Además, luego de finalizar la ejecución del cuerpo principal del código, se espera por mensajes en un bucle infinito utiliazando la función `out_esperar_mensaje`, que bloquea hasta que haya un mensaje disponible. 

function marcarLlegadasTardias() {
  var idHojaCalculo = '1UAJyCh1dhytdIEB12zCtow_7CXWgjCWm-PNoAOv-Er8'; // Reemplaza con el ID de tu hoja de cálculo
  var nombreHoja = 'Asistencia'; // Reemplaza con el nombre de tu hoja específica
  var nombreHojaControl = 'Llegadas tarde'; // Nombre de la hoja de control

  var hojaCalculo = SpreadsheetApp.openById(idHojaCalculo);
  var hoja = hojaCalculo.getSheetByName(nombreHoja);
  var hojaControl = hojaCalculo.getSheetByName(nombreHojaControl);

  if (!hoja || !hojaControl) {
    Logger.log('No se pudo encontrar la hoja especificada.');
    return;
  }

  // Obtén los datos de la hoja
  var rango = hoja.getDataRange();
  var valores = rango.getValues();

  // Definir la fecha y el mes actual
  var fechaActual = new Date();
  var mesActual = fechaActual.getMonth(); // Mes actual (0 = enero, 1 = febrero, ...)
  var añoActual = fechaActual.getFullYear(); // Año actual

  // Definir la hora límite de llegada y salida para la mayoría de empleados
  var limiteHoraLlegada = new Date();
  limiteHoraLlegada.setHours(7, 0, 0, 0); // 7:00 AM
  var limiteHoraSalida = new Date();
  limiteHoraSalida.setHours(16, 0, 0, 0); // 4:00 PM

  // Agregar tolerancia de 5 minutos
  var toleranciaLlegada = 5 * 60 * 1000; // 5 minutos en milisegundos

  var filaControl = hojaControl.getLastRow() + 1; // Encontrar la siguiente fila vacía en la hoja de Control
  
  // Si la hoja de Control está vacía, empezar desde la fila 2 para evitar los encabezados
  if (hojaControl.getLastRow() === 0) {
    filaControl = 2; // Suponiendo que la fila 1 contiene encabezados
  }

  // Recorrer las filas y verificar la hora
  for (var i = 1; i < valores.length; i++) {
    var empleado = valores[i][2]; // Asumiendo que el nombre del empleado está en la columna 3 (índice 2)
    var fechaFichaje = valores[i][0]; // Asumiendo que la fecha está en la columna 1 (índice 0)
    var hora = valores[i][4]; // La hora está en la columna 5 (índice 4)
    var colorCelda = hoja.getRange(i + 1, 5).getBackground(); // Verificar color de la celda

    // Verificar si la celda ya está marcada en rojo o verde
    if (colorCelda === '#ff0000' || colorCelda === '#a4de02') {
      continue; // Saltar si ya está marcada en rojo (llegada tarde) o verde (puntualidad)
    }

    // Verificar que la fecha de fichaje sea del mes actual
    if (fechaFichaje instanceof Date) {
      var mesFichaje = fechaFichaje.getMonth();
      var añoFichaje = fechaFichaje.getFullYear();

      if (mesFichaje !== mesActual || añoFichaje !== añoActual) {
        // Si el fichaje no es del mes actual, lo saltamos
        continue;
      }
    }

    // Verificar y formatear la hora de entrada y salida
    if (hora instanceof Date) {
      var horas = hora.getHours();
      var minutos = hora.getMinutes();
      var segundos = hora.getSeconds();
      hora = ('0' + horas).slice(-2) + ':' + ('0' + minutos).slice(-2) + ':' + ('0' + segundos).slice(-2);
    }

    // Verificar si el valor de la hora es una cadena y tiene el formato esperado
    if (typeof hora === 'string') {
      var partesHora = hora.split(':');
      
      // Validar si el formato de la hora es correcto (tiene al menos horas y minutos)
      if (partesHora.length >= 2) {
        var horas = parseInt(partesHora[0], 10);
        var minutos = parseInt(partesHora[1], 10);
        var segundos = partesHora.length === 3 ? parseInt(partesHora[2], 10) : 0;

        var horaRegistro = new Date();
        horaRegistro.setHours(horas, minutos, segundos, 0);

        // Excepciones por empleado
        var limiteHoraLlegadaEmpleado, limiteHoraSalidaEmpleado;

        if (empleado === 'Nadia-Leguiza') {
          limiteHoraLlegadaEmpleado = new Date();
          limiteHoraLlegadaEmpleado.setHours(8, 0, 0, 0); // Entrada 8:00 AM
          limiteHoraSalidaEmpleado = new Date();
          limiteHoraSalidaEmpleado.setHours(15, 0, 0, 0); // Salida 3:00 PM
        } else if (empleado === 'Fabiana-Franco' || empleado === 'Maria-Cecilia-Cardoso' || empleado === 'Carla-Medina') {
          limiteHoraLlegadaEmpleado = new Date();
          limiteHoraLlegadaEmpleado.setHours(8, 30, 0, 0); // Entrada 8:30 AM
          limiteHoraSalidaEmpleado = new Date();
          limiteHoraSalidaEmpleado.setHours(16, 30, 0, 0); // Salida 4:30 PM
        } else if (empleado === 'Veronica-Sansebastiano') {
          limiteHoraLlegadaEmpleado = new Date();
          limiteHoraLlegadaEmpleado.setHours(8, 0, 0, 0); // Entrada 8:00 AM
          limiteHoraSalidaEmpleado = new Date();
          limiteHoraSalidaEmpleado.setHours(16, 0, 0, 0); // Salida 4:00 PM
        } else {
          limiteHoraLlegadaEmpleado = limiteHoraLlegada; // 7:00 AM
          limiteHoraSalidaEmpleado = limiteHoraSalida; // 4:00 PM
        }

        // Ajustar la hora límite de llegada para permitir una tolerancia de 5 minutos
        var limiteLlegadaConTolerancia = new Date(limiteHoraLlegadaEmpleado.getTime() + toleranciaLlegada);

        // Verificar si el empleado llegó a tiempo y salió a tiempo
        if (horaRegistro <= limiteLlegadaConTolerancia && horas < 12) {
          hoja.getRange(i + 1, 5).setBackground('#a4de02').setFontWeight('bold'); // Verde claro para llegó a tiempo y en negrita
        } else if (horaRegistro >= limiteHoraSalidaEmpleado && horas >= 12) {
          hoja.getRange(i + 1, 5).setBackground('#a4de02').setFontWeight('bold'); // Verde claro para salió a tiempo y en negrita
        } else if (horaRegistro > limiteLlegadaConTolerancia && horas < 12) {
          hoja.getRange(i + 1, 5).setBackground('red').setFontWeight('bold'); // Llegada tardía en negrita
          
          // Copiar la fila a la hoja de Control
          var filaDatos = hoja.getRange(i + 1, 1, 1, hoja.getLastColumn()).getValues();
          hojaControl.getRange(filaControl, 1, 1, filaDatos[0].length).setValues(filaDatos);
          filaControl++;
        } else if (horaRegistro < limiteHoraSalidaEmpleado && horas >= 12) {
          hoja.getRange(i + 1, 5).setBackground('red').setFontWeight('bold'); // Salida temprana en negrita

          // Copiar la fila a la hoja de Control
          var filaDatos = hoja.getRange(i + 1, 1, 1, hoja.getLastColumn()).getValues();
          hojaControl.getRange(filaControl, 1, 1, filaDatos[0].length).setValues(filaDatos);
          filaControl++;
        } else {
          hoja.getRange(i + 1, 5).setBackground(null).setFontWeight('normal'); // Restaurar formato
        }
      } else {
        Logger.log('El formato de la hora no es válido: ' + hora);
      }
    } else {
      Logger.log('El valor de la celda no es una cadena: ' + hora);
    }
  }
  
  Logger.log('Se ha aplicado formato a las llegadas tardías, salidas tempranas y empleados puntuales, y se han copiado los fichajes tardíos a la hoja de Llegadas tarde.');
}

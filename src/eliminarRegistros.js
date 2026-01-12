function eliminarRegistrosAntiguos() {
  // ID de la hoja de cálculo original y nombre de la hoja
  var idHojaCalculoOriginal = '1UAJyCh1dhytdIEB12zCtow_7CXWgjCWm-PNoAOv-Er8'; // ID de tu hoja de cálculo original
  var nombreHojaOriginal = 'Asistencia'; // Nombre de la hoja original
  
  // Obtén la hoja de cálculo original y la hoja específica
  var hojaCalculoOriginal = SpreadsheetApp.openById(idHojaCalculoOriginal);
  var hojaOriginal = hojaCalculoOriginal.getSheetByName(nombreHojaOriginal);
  
  if (!hojaOriginal) {
    Logger.log('No se pudo encontrar la hoja original con el nombre especificado.');
    return;
  }
  
  // Obtén el número total de filas en la hoja original
  var numFilas = hojaOriginal.getLastRow();
  
  if (numFilas > 1) {
    var fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 60); // Calcula la fecha límite (60 días atrás)
    
    // Obtener todas las filas de la hoja original
    var rangoDatos = hojaOriginal.getRange(2, 1, numFilas - 1, hojaOriginal.getLastColumn());
    var datos = rangoDatos.getValues();

    // Filtra los datos para encontrar aquellos que sean más antiguos que 60 días
    var filasParaEliminar = [];
    for (var i = 0; i < datos.length; i++) {
      var fecha = new Date(datos[i][3]); // Asume que la fecha está en la columna 4 (índice 3)
      if (fecha < fechaLimite) {
        filasParaEliminar.push(i + 2); // Añade la fila a la lista de eliminación (i+2 porque los índices son 0-basados y las filas en la hoja comienzan en 2)
      }
    }
    
    // Elimina las filas más antiguas en orden inverso para evitar problemas con los índices al eliminar
    for (var j = filasParaEliminar.length - 1; j >= 0; j--) {
      hojaOriginal.deleteRow(filasParaEliminar[j]);
    }
  }
  
  Logger.log('Los registros que tienen más de 60 días de antigüedad se han eliminado de la hoja "Asistencia".');
}

function doGet(e) {
  // Validar si el objeto e o sus parámetros existen
  if (!e || !e.parameter) {
    return HtmlService.createHtmlOutput("Error: No se proporcionaron parámetros.");
  }

  // Obtener los parámetros
  const correo = Session.getActiveUser().getEmail(); // Correo del usuario autenticado
  const id = e.parameter.id;
  const nombre = e.parameter.nombre;

  // Validar si los parámetros obligatorios están presentes
  if (!id || !nombre) {
    return HtmlService.createHtmlOutput("Error: Faltan parámetros obligatorios (id o nombre).");
  }

  // Validar si el empleado está de vacaciones
  if (validarVacaciones(nombre)) {
    return HtmlService.createHtmlOutput(`
      El empleado ${nombre} está de vacaciones. No se registró la asistencia.
    `);
  }

  // Registrar la asistencia si todo está correcto
  registrarAsistencia(correo, id, nombre);
  return HtmlService.createHtmlOutput(`
    Asistencia registrada correctamente. <br><br>
    Correo: ${correo}<br>
    ID: ${id}<br>
    Nombre: ${nombre}
  `);
}

function registrarAsistencia(correo, id, nombre) {
  // Identificador del documento de hoja de cálculo
  const sheet = SpreadsheetApp.openById("1UAJyCh1dhytdIEB12zCtow_7CXWgjCWm-PNoAOv-Er8");
  const asistencia = sheet.getSheetByName("Asistencia");
  const lastRow = asistencia.getLastRow() + 1;

  // Insertar los valores en las columnas correspondientes
  asistencia.getRange(lastRow, 1).setValue(correo);
  asistencia.getRange(lastRow, 2).setValue(id);
  asistencia.getRange(lastRow, 3).setValue(nombre);

  // Obtener la fecha y hora actual
  const fechaHoraActual = new Date();
  const fechaTexto = Utilities.formatDate(fechaHoraActual, Session.getScriptTimeZone(), "dd/MM/yyyy");
  const horaTexto = Utilities.formatDate(fechaHoraActual, Session.getScriptTimeZone(), "HH:mm:ss");

  asistencia.getRange(lastRow, 4).setValue(fechaTexto);
  asistencia.getRange(lastRow, 5).setValue(horaTexto);
}

function validarVacaciones(nombre) {
  const sheet = SpreadsheetApp.openById("1UAJyCh1dhytdIEB12zCtow_7CXWgjCWm-PNoAOv-Er8");
  const asistencia = sheet.getSheetByName("Asistencia");
  const datos = asistencia.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {
    const empleado = datos[i][2];
    const enVacaciones = datos[i][8]; // Nueva columna "EnVacaciones"

    if (empleado === nombre && enVacaciones && enVacaciones.toLowerCase() === "sí") {
      return true; // Está de vacaciones
    }
  }
  return false; // No está de vacaciones
}


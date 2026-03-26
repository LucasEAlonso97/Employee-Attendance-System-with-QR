
QR Attendance Control System (Serverless Edition)
Sistema automatizado de control de asistencia mediante lectura de códigos QR personales. Esta solución utiliza una arquitectura orientada a la eficiencia, eliminando la necesidad de servidores dedicados y centralizando la información en tiempo real para una gestión administrativa inmediata.

📋 El Problema
En entornos de planta o fábrica, el registro manual de asistencia en papel genera pérdida de datos, errores de transcripción y una demora crítica en el procesamiento de novedades para el área de RRHH.

🚀 La Solución
Desarrollé un sistema de fichaje por QR Inverso. Cada empleado posee un código QR único que presenta ante una terminal de escaneo. El sistema procesa la identidad, valida el tipo de marca (entrada o salida) según el horario y registra la información automáticamente en una base de datos distribuida.

🛠️ Stack Tecnológico
Lenguaje Principal: JavaScript (ES6+).

Motor de Lógica: Google Apps Script (Backend as a Service).

Persistencia de Datos: Google Sheets (Base de Datos Relacional).

Interfaz de Captura: Web App integrada (HTML5 / CSS3 / JS Vanila).

Procesamiento de Imagen: Librería de decodificación QR (Instascan / JsQR).

⚙️ Funcionalidades Clave
Escaneo en Tiempo Real: Interfaz web ligera que accede a la cámara de cualquier dispositivo para decodificar el QR del empleado.

Lógica de Negocio: Scripts que determinan automáticamente si el empleado está ingresando o egresando basándose en el último registro del día.

Registro Estructurado: Captura automática de:

ID / Nombre del Empleado.

Marca de tiempo completa (Timestamp).

Tipo de evento (Check-in / Check-out).

Cero Mantenimiento de Servidor: Arquitectura serverless que garantiza disponibilidad total sin costos de infraestructura.

📉 Impacto y Resultados
Reducción de Errores: Se eliminó el 100% de los errores manuales de carga de datos.

Visibilidad Total: El personal administrativo accede a los datos de asistencia en vivo desde la hoja de cálculo centralizada.

Costo de Implementación Mínimo: Solución de alto impacto utilizando herramientas corporativas existentes.


/**
 * Ficha WorkerTech — evaluación final gigES
 * Recibe las fichas de las soluciones y las escribe en una hoja de cálculo del Drive.
 *
 * Cómo se instala (una sola vez, unos cinco minutos):
 *  1. Cree una hoja de cálculo nueva en su Drive. Llámela, por ejemplo,
 *     «Fichas WorkerTech — gigES». Copie su ID desde la barra de direcciones:
 *     docs.google.com/spreadsheets/d/  ESTO DE ACÁ  /edit
 *  2. Pegue ese ID abajo, en HOJA_ID.
 *  3. En esa hoja, menú Extensiones → Apps Script.
 *  4. Reemplace todo el contenido de Código.gs por este archivo.
 *  5. Botón + junto a «Archivos» → HTML → nómbrelo exactamente «Index»
 *     (queda como Index.html) y pegue ahí el archivo Index.html de esta carpeta.
 *  6. Botón «Implementar» → «Nueva implementación» → tipo «Aplicación web».
 *       Ejecutar como: Yo
 *       Quién tiene acceso: Cualquier persona
 *     Acepte los permisos que pida. Copie la URL que entrega (termina en /exec).
 *  7. Pegue esa URL en index.html del repositorio, en la línea
 *     var ENDPOINT = "";   →   var ENDPOINT = "https://script.google.com/.../exec";
 *     Suba el cambio a GitHub y el formulario empezará a guardar en la hoja.
 *
 * Para cambiar algo después: edite y use «Implementar → Administrar implementaciones
 * → editar (lápiz) → Versión: Nueva versión». Así la URL no cambia.
 */

var HOJA_ID = "PEGUE_AQUÍ_EL_ID_DE_LA_HOJA";
var NOMBRE_PESTANA = "Fichas";

var COLUMNAS = [
  ["recibida", "Recibida"],
  ["docId", "ID de ficha"],
  ["empresa", "Empresa o solución"],
  ["persona", "Quién responde"],
  ["servicio", "Qué recibía el trabajador"],
  ["inicio", "Desde cuándo operó"],
  ["total", "A cuántas personas llegaron"],
  ["tipo", "Tipo de trabajadores"],
  ["territorio", "Municipios o departamentos"],
  ["mujeres", "Proporción de mujeres"],
  ["mec", "Cómo decidían quién entraba"],
  ["noatendidos", "¿Hay registro de no atendidos?"],
  ["fuera", "Requisitos, cupos y quiénes quedaban fuera"],
  ["puente", "¿Pueden ser puente para la encuesta?"],
  ["via", "Mejor forma de llegar a su gente"],
  ["focal", "Apoyo para convocar grupos focales"],
  ["puntos", "Lugares físicos de encuentro"],
  ["v_pertinencia", "1-5 Pertinencia"],
  ["v_eficacia", "1-5 Eficacia"],
  ["v_cobertura", "1-5 Cobertura"],
  ["v_sostenib", "1-5 Sostenibilidad"],
  ["v_coordina", "1-5 Coordinación con el proyecto"],
  ["v_registros", "1-5 Calidad de sus registros"],
  ["v_trazab", "1-5 Trazabilidad de no atendidos"],
  ["v_vinculo", "1-5 Vínculo vigente con usuarios"],
  ["v_convocar", "1-5 Capacidad de convocar"],
  ["campos", "Datos que guardan de cada persona"],
  ["contacto-nombre", "Contacto de datos · nombre"],
  ["contacto-correo", "Contacto de datos · correo"],
  ["contacto-tel", "Contacto de datos · teléfono"],
  ["contacto-cargo", "Contacto de datos · cargo"],
  ["libre", "Algo más que deberíamos saber"]
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Ficha WorkerTech")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Recibe la ficha desde la página publicada en GitHub Pages.
 * La página envía un POST con el JSON de la ficha en el cuerpo.
 */
function doPost(e) {
  var salida = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents);
    guardarFicha(d);
    salida.ok = true;
  } catch (err) {
    salida.error = String(err);
  }
  return ContentService
    .createTextOutput(JSON.stringify(salida))
    .setMimeType(ContentService.MimeType.JSON);
}

function hoja_() {
  var libro = SpreadsheetApp.openById(HOJA_ID);
  var h = libro.getSheetByName(NOMBRE_PESTANA);
  if (!h) {
    h = libro.insertSheet(NOMBRE_PESTANA);
  }
  if (h.getLastRow() === 0) {
    var titulos = COLUMNAS.map(function (c) { return c[1]; });
    h.appendRow(titulos);
    var cab = h.getRange(1, 1, 1, titulos.length);
    cab.setFontWeight("bold");
    cab.setBackground("#1E2F42");
    cab.setFontColor("#FFFFFF");
    h.setFrozenRows(1);
  }
  return h;
}

function valor_(d, clave) {
  var v = d[clave];
  if (v === null || v === undefined) return "";
  if (Object.prototype.toString.call(v) === "[object Array]") return v.join(", ");
  return String(v);
}

/**
 * Guarda o actualiza una ficha. Si ya existe una fila con el mismo ID,
 * la reemplaza: así una solución puede corregir y reenviar sin duplicarse.
 */
function guardarFicha(d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var h = hoja_();
    var fila = COLUMNAS.map(function (c) {
      if (c[0] === "recibida") return new Date();
      return valor_(d, c[0]);
    });

    var idBuscado = valor_(d, "docId");
    var destino = 0;
    if (idBuscado) {
      var ultima = h.getLastRow();
      if (ultima > 1) {
        var ids = h.getRange(2, 2, ultima - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (String(ids[i][0]) === idBuscado) { destino = i + 2; break; }
        }
      }
    }

    if (destino) {
      h.getRange(destino, 1, 1, fila.length).setValues([fila]);
    } else {
      h.appendRow(fila);
    }
    return true;
  } finally {
    lock.releaseLock();
  }
}

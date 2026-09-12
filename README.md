# Ficha WorkerTech — evaluación final gigES

Formulario web que responde cada solución WorkerTech del proyecto **gigES**
(ES-T1341, El Salvador). Seis secciones, unos cinco minutos. Se abre desde un
código QR en la sesión inicial y queda disponible para las soluciones que no
asistieron.

- **Organismo ejecutor:** CasaTIC · **Mandantes de la evaluación:** BID Lab y Unión Europea
- **Equipo evaluador:** Cliodinámica · CliO Consulting

## Qué hay acá

| Archivo | Qué es |
|---|---|
| `index.html` | El formulario completo. Un solo archivo, sin dependencias que instalar. |
| `Code.gs` | El script que recibe las fichas y las escribe en una hoja de cálculo de Google Drive. |
| `logos-donantes.png` | Barra de logotipos del proyecto. |
| `qr-ficha.png` | Código QR. **Regenerar cuando la URL definitiva esté publicada.** |

## Puesta en marcha

### 1. Publicar el formulario

En GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
En un par de minutos la ficha queda en `https://<usuario>.github.io/<repositorio>/`.

### 2. Conectar el guardado en Drive

1. Cree una hoja de cálculo nueva en su Drive y copie su ID desde la barra de
   direcciones: `docs.google.com/spreadsheets/d/` **ESTO DE ACÁ** `/edit`
2. Pegue ese ID en `Code.gs`, en la línea `var HOJA_ID = ...`
3. En la hoja: **Extensiones → Apps Script**. Reemplace el contenido de
   `Código.gs` por el de este repositorio.
4. **Implementar → Nueva implementación → Aplicación web.**
   Ejecutar como: *Yo*. Quién tiene acceso: *Cualquier persona*.
   Acepte los permisos. Copie la URL que entrega (termina en `/exec`).
5. En `index.html`, pegue esa URL:

   ```js
   var ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
   ```

6. Suba el cambio. Desde ese momento cada envío escribe una fila en la hoja.

Mientras `ENDPOINT` esté vacío, el botón abre el correo del respondente con la
ficha ya redactada. Nada se pierde: el formulario guarda un borrador en el
propio navegador mientras se escribe.

### 3. Regenerar el QR

Con la URL definitiva de GitHub Pages:

```bash
pip install segno
python -c "import segno; segno.make('LA_URL', error='h').save('qr-ficha.png', scale=18, border=2, dark='#1E2F42')"
```

## Notas

- Cada ficha lleva un identificador propio guardado en el navegador. Si una
  solución corrige y reenvía, el script reemplaza su fila en lugar de duplicarla.
- **El formulario no pide datos de los trabajadores.** Solo datos de la empresa y
  el contacto de la persona con quien se coordinará. Los registros de personas se
  solicitan después, por canal formal y con el acuerdo de tratamiento de datos
  que gestiona CasaTIC.
- Los datos de contacto recogidos son datos personales: corresponde tratarlos
  conforme a la ley chilena 21.719 y verificar con asesoría local el marco
  salvadoreño aplicable.

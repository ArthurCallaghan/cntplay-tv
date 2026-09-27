# Canales CNT

Web estática multicanal lista para GitHub Pages. Weazel, CCC (Conglomerated Comedy Channel), MeTV y The Canyon Channel funcionan como canales lineales continuos en bucle. CNT y Emotion quedan preparados para recibir sus nuevas parrillas.

Cada vídeo conserva cinco segundos adicionales de reproducción antes de pasar al siguiente. Así, si Drive empezó tarde, puede terminar el contenido pendiente; si ya terminó, permanece en su pantalla final durante ese margen. Weazel emite las dos temporadas completas de *Three of a Kind*; CCC reúne *Mis Amigos*, *Paranormal: Prólogo*, *Caos en Strawberry* y *Paranormal: Volumen 1*; The Canyon Channel emite las películas, siempre separadas por una pausa; y MeTV alterna los cuatro *Summer Sound* con bloques de dos o tres piezas titulados *Contenido Musical de Three of a Kind*. Las pausas y los tráileres insertados dentro de ellas aparecen como un único espacio publicitario, no como programas independientes.

Los cuatro canales activos incluyen pausas publicitarias regulares de dos a cinco minutos, con un máximo de dos tráileres o teasers autorizados por tanda. Las pausas vacías muestran únicamente «Volvemos en» y un contador. Las piezas musicales de *Three of a Kind* solo forman parte de la programación de MeTV, conservan su clasificación y nunca se usan como relleno publicitario; cada bloque musical queda separado de *Summer Sound* por una pausa anterior y otra posterior.

Antes de habilitar el reproductor, la web muestra una espera de cinco segundos. El primer acceso utiliza «Ver emisión» y los cambios de contenido posteriores «Seguir con la emisión».

**Emotion** funciona temporalmente como canal de pruebas. Abre el reproductor de diagnóstico con el tráiler de *Paranormal: Volumen 1*, conserva la estructura completa del canal y deja el reproductor de Drive sin bloqueos ni recortes para facilitar las comprobaciones.

## Publicar en GitHub Pages

1. Sube todo el contenido de esta carpeta, conservando `assets/`, `data/` y sus subcarpetas, a la rama que quieras publicar.
2. En el repositorio, abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**, selecciona la rama y la carpeta raíz (`/`).

No necesita instalación ni proceso de compilación.

## Cambiar el proveedor de vídeo

La primera prueba usa el reproductor incrustado de Google Drive. En `app.js`, la constante `VIDEO_PROVIDER` puede cambiarse de `drive` a `html5`; después hay que añadir las URL públicas de cada vídeo en `html5Sources`, usando el ID de Drive como clave. El reproductor HTML5 oculta los controles y permite una sincronización más precisa.

Los archivos de Drive deben tener acceso de lectura para cualquier persona con el enlace.

## Sustituir logotipos

Los PNG de cada canal están en `assets/`. Se pueden reemplazar conservando exactamente estos nombres: `cnt-logo.png`, `weazel-logo.png`, `comedy-tv-logo.png`, `metv-logo.png`, `canyon-logo.png` y `emotion-logo.png`.

## Editar contenidos y parrillas

- `data/catalog.js` contiene la base común de episodios y películas: título, duración en segundos, enlace de Drive y clasificación por edad.
- `data/schedules/` contiene un archivo de parrilla independiente para cada canal. Cada parrilla utiliza las claves definidas en el catálogo.

La clasificación puede ser `null`, `"TP"`, `"7"`, `"12"`, `"16"` o `"18"`. Cuando vale `null`, no aparece ningún distintivo en el reproductor.
Las edades se escriben en el objeto `ratings`, situado al principio de `data/catalog.js`, usando el identificador del contenido.

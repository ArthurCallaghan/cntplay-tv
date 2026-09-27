# CNT Live

Web estática multicanal lista para GitHub Pages. CNT, Weazel, CCC (Conglomerated Comedy Channel), MeTV, The Canyon Channel y Emotion funcionan como canales lineales continuos.

CNT emite una mezcla variable de bloques de *Three of a Kind*, *Caos en Strawberry*, *Paranormal*, las películas de Fort Brimstone, *Amatista 2* y *Summer Sound 4*. La mezcla cambia en cada vuelta, mantiene el orden cronológico, evita juntar dos grupos de la misma serie y sitúa las dos películas de Fort Brimstone antes de *Caos en Strawberry* 1x10–1x12.

Cada vídeo conserva diez segundos adicionales antes de pasar al siguiente. Las parrillas incluyen pausas publicitarias con tráileres; cuando no hay una pieza disponible, aparece la pantalla «Volvemos en» con su contador. Emotion permanece identificado como canal en pruebas.

Antes de habilitar cada vídeo, la web muestra una preparación de 2,5 segundos. El primer acceso utiliza «Ver emisión» y los cambios posteriores «Seguir con la emisión». Pulsar el logotipo superior reinicia únicamente el reproductor del canal actual.

## Publicar en GitHub Pages

1. Sube **el contenido completo de esta carpeta** a la raíz de la rama publicada. No subas únicamente algunos archivos ni la carpeta exterior del ZIP.
2. Conserva exactamente las carpetas `assets/`, `data/` y `data/schedules/`.
3. No elimines `CNAME`: mantiene asociado el dominio `tv.cntplay.es`. Si falta, GitHub mostrará «Site not found · 404».
4. En el repositorio, abre **Settings → Pages**.
5. En **Build and deployment**, elige **Deploy from a branch**, selecciona la rama y la carpeta raíz (`/`).
6. Comprueba que **Custom domain** siga configurado como `tv.cntplay.es`.

Si un navegador conserva una parrilla antigua, abre `https://tv.cntplay.es/actualizar.html`. Esa página elimina únicamente la caché y el controlador de CNT Live en ese navegador y vuelve a abrir la emisión actual.

No necesita instalación ni proceso de compilación.

## Cambiar el proveedor de vídeo

La primera prueba usa el reproductor incrustado de Google Drive. En `app.js`, la constante `VIDEO_PROVIDER` puede cambiarse de `drive` a `html5`; después hay que añadir las URL públicas de cada vídeo en `html5Sources`, usando el ID de Drive como clave. El reproductor HTML5 oculta los controles y permite una sincronización más precisa.

Los archivos de Drive deben tener acceso de lectura para cualquier persona con el enlace.

## Sustituir logotipos

Los PNG de cada canal están en `assets/`. Se pueden reemplazar conservando exactamente estos nombres: `cnt-logo.png`, `weazel-logo.png`, `comedy-tv-logo.png`, `metv-logo.png`, `canyon-logo.png` y `emotion-logo.png`.

## Editar contenidos y parrillas

- `data/catalog.js` contiene la base común de episodios y películas: título, duración en segundos, enlace de Drive y clasificación por edad.
- `data/schedules/` contiene un archivo de parrilla independiente para cada canal. La parrilla de CNT es `cnt.js`, siguiendo el mismo sistema de nombres que los demás canales.

La clasificación puede ser `null`, `"TP"`, `"7"`, `"12"`, `"16"` o `"18"`. Cuando vale `null`, no aparece ningún distintivo en el reproductor.
Las edades se escriben en el objeto `ratings`, situado al principio de `data/catalog.js`, usando el identificador del contenido.

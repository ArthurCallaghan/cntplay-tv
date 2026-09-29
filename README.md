# CNT Live

Web estática multicanal lista para GitHub Pages. CNT, Weazel, CCC (Conglomerated Comedy Channel), MeTV, The Canyon Channel y Emotion funcionan como canales lineales continuos.

CNT emite una mezcla variable de bloques de *Three of a Kind*, *Caos en Strawberry*, *Paranormal*, las películas de Fort Brimstone, *Amatista 2* y *Summer Sound 4*. La mezcla cambia en cada vuelta, mantiene el orden cronológico, evita juntar dos grupos de la misma serie y sitúa las dos películas de Fort Brimstone antes de *Caos en Strawberry* 1x10–1x12.

Cada vídeo conserva diez segundos adicionales antes de pasar al siguiente. Las parrillas incluyen pausas publicitarias con tráileres; cuando no hay una pieza disponible, aparece la pantalla «Volvemos en» con su contador. Emotion permanece identificado como canal en pruebas.

Antes de habilitar cada vídeo, la web muestra una preparación de 2,5 segundos. El primer acceso utiliza «Ver emisión» y los cambios posteriores «Seguir con la emisión». Pulsar el logotipo superior reinicia únicamente el reproductor del canal actual.

## Publicar en GitHub Pages

1. Sube **el contenido completo de esta carpeta** a la raíz de la rama publicada. No subas únicamente algunos archivos ni la carpeta exterior del ZIP.
2. Conserva exactamente las carpetas `assets/`, `data/` y `data/schedules/`.
3. Conserva `CNAME`, que declara el dominio `tv.cntplay.es` para la publicación desde una rama. Un error «Site not found · 404» requiere revisar también el despliegue y la configuración de Pages.
4. En el repositorio, abre **Settings → Pages**.
5. En **Build and deployment**, elige **Deploy from a branch**, selecciona la rama y la carpeta raíz (`/`).
6. Comprueba que **Custom domain** siga configurado como `tv.cntplay.es`.

Para publicar el ZIP entregado no necesitas instalar ni compilar nada. Usa el `index.html` de `outputs/cnt-play-directo/` (incluido en el ZIP), no el HTML fuente de la raíz del proyecto.

El ZIP ya está preparado para publicar. En la versión publicada, la programación de CNT está integrada en `index.html` para evitar depender de una petición separada a `cnt.js`, que falla en el Chrome donde se reprodujo el problema. Su única fuente editable sigue siendo `data/schedules/cnt.js`.

Si modificas los archivos fuente del proyecto, ejecuta `node work/package-site.cjs` para regenerar `outputs/cnt-play-directo/` antes de publicar. No edites a mano la copia integrada en el HTML. El generador conserva los logos existentes en el paquete. No se necesita Node para visitar la web ni para subir el ZIP ya generado.

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

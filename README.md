# Canales CNT

Web estática multicanal lista para GitHub Pages. CNT utiliza una parrilla diaria completa desde las 06:00 hasta las 03:00:50 del día siguiente. Los huecos entre bloques se convierten automáticamente en pausas de emisión con cuenta atrás; después del último programa aparece el fin de emisión hasta las 06:00.

La franja Poker Night Live de las 20:30 rota diariamente entre tres opciones. Weazel, Comedy TV, MeTV, The Canyon Channel y Emotion quedan preparados para incorporar sus propias parrillas.

Las pausas pueden incluir tráileres, promociones o piezas musicales cuando caben enteras antes del siguiente bloque. Estos rellenos rotan cada día, nunca retrasan una hora de inicio y continúan apareciendo como “Pausa de emisión” en la guía. Cuando quedan 20 segundos de un programa se muestra durante 8 segundos el aviso del siguiente contenido.

## Publicar en GitHub Pages

1. Sube `index.html`, `styles.css` y `app.js` a la rama que quieras publicar.
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

# 🍺 Picolo - Juego para beber

Juego de beber para fiestas, hecho con [Expo](https://expo.dev) / React Native. Se añaden jugadores, se elige un modo y la app va sacando retos al estilo tarjetas: se desliza a un lado si se cumple el reto, al otro si se bebe en su lugar.

> ⚠️ Solo para mayores de edad. El modo Caliente incluye contenido sexual explícito; la app pide confirmar la edad la primera vez que se abre.

## Modos de juego

- **Fiesta**: retos generales para todo el grupo — repartir tragos, minijuegos clásicos (cascada, yo nunca, quién es más probable que..., mímica, trabalenguas...), retos individuales y retos de pareja.
- **Caliente** (18+): retos más atrevidos — confesiones, preguntas comprometidas, retos a ciegas, y algunos con distintas variantes según el género de los jugadores en la partida.

## Características

- Gestión de jugadores: nombre editable, género (usado para filtrar retos que no tengan sentido, ej. "las chicas beben" no sale si no hay ninguna mujer jugando), avatar aleatorio o elegido a mano.
- Avatares de animales por defecto; los avatares de los amigos ("Moustache") se desbloquean con un código desde Ajustes, para que nadie ajeno al grupo los vea por defecto.
- Retos de un jugador y de dos jugadores, algunos con pareja restringida por género (ej. solo chico-chica) y otros repetibles dentro de la misma partida (ej. la escalada de quitarse prendas).
- Racha de aciertos, tanto global como la mejor racha individual de cada jugador, visible en la pantalla de resultados.
- Los retos no se repiten en la misma partida; cuando se acaban, la partida termina sola y muestra los resultados.
- Sonido (aciertos/fallos) y vibración al deslizar cada carta, con interruptor y control de volumen en Ajustes.
- Pantalla de carga y verificación de edad al abrir la app por primera vez.

## Empezar

1. Instalar dependencias

   ```bash
   npm install
   ```

2. Arrancar la app

   ```bash
   npx expo start
   ```

   Desde ahí se puede abrir en un [build de desarrollo](https://docs.expo.dev/develop/development-builds/introduction/), emulador Android/iOS, o [Expo Go](https://expo.dev/go).

## Scripts útiles

- `npm run lint` — linter del proyecto.
- `npm run process-avatar -- <entrada> <salida.webp> [tamaño]` — redimensiona y convierte a WebP una imagen de avatar (ver `scripts/process-avatar.js`).
- `npm run validate-retos` — revisa `src/data/*.json` en busca de retos duplicados, sin alternativa de bebida, o con género mal configurado.

## Estructura

- `app/` — pantallas (rutas de expo-router): inicio, jugadores, avatares, ajustes, juego, resultados.
- `src/context/` — estado global (jugadores, ajustes).
- `src/controllers/retosController.ts` — selección y filtrado de retos.
- `src/data/` — contenido de los retos (`fiesta.json`, `hot.json`).
- `src/components/` — componentes compartidos (pantalla de carga, verificación de edad, botón de volver).
- `src/soundManager.ts` — carga y reproducción de los efectos de sonido del juego.

## Autor

Gustavo ([@GusNicolau](https://github.com/GusNicolau))

## Versión

1.0.0

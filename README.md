# 🍺 Picolo

Juego de beber para fiestas, hecho con [Expo](https://expo.dev) / React Native. Se añaden jugadores, se elige un modo y la app va sacando retos al estilo tarjetas (deslizar para cumplir o beber).

## Modos de juego

- **Fiesta**: retos generales para todo el grupo (repartir tragos, minijuegos clásicos como cascada, yo nunca o quién es más probable que..., retos individuales y retos de pareja).
- **Caliente**: retos más atrevidos.

## Características

- Gestión de jugadores: nombre editable, avatar aleatorio o elegido a mano.
- Avatares de animales por defecto; los avatares de los amigos ("Moustache") se desbloquean con un código desde Ajustes, para que nadie ajeno al grupo los vea por defecto.
- Género por jugador (hombre/mujer/inter), usado para que los retos tengan sentido según quién esté jugando (por ejemplo, "las chicas beben" no sale si no hay ninguna mujer en la partida).
- Retos de un jugador y retos de dos jugadores, con racha individual de aciertos.
- Los retos no se repiten en la misma partida; cuando se acaban, la partida termina sola y muestra los resultados.
- Pantalla de Ajustes con interruptor de sonido (preparado para cuando la app tenga audio) y el código de desbloqueo.

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

## Estructura

- `app/` — pantallas (rutas de expo-router): inicio, jugadores, avatares, ajustes, juego, resultados.
- `src/context/` — estado global (jugadores, ajustes).
- `src/controllers/retosController.ts` — selección y filtrado de retos.
- `src/data/` — contenido de los retos (`fiesta.json`, `hot.json`).

## Autor

Gustavo ([@GusNicolau](https://github.com/GusNicolau))

## Versión

1.0.0

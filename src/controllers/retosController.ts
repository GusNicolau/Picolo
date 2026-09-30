import { Genero, Jugador, ModoJuego } from "../context/PlayersContext";
import fiesta from "../data/fiesta.json";
import hot from "../data/hot.json";

type RetoJson = {
  texto: string;
  genero?: Genero; // restringe el género de {player}
  genero2?: Genero; // restringe el género de {player2}
  repetible?: boolean; // no se marca como usado: puede volver a salir en la misma partida
  parejaAsistida?: boolean; // reto de pareja bueno para favorecer a la ayuda asistida
  // Fuerza a tratar el reto como "de grupo" aunque el texto sí nombre a
  // {player} (ej. "el último en mirar a los ojos a {player} bebe" — quien
  // bebe no es {player}, es cualquiera del grupo). No hace falta ponerlo si
  // el texto ya no usa {player} en absoluto: eso ya se detecta solo.
  grupal?: boolean;
};

export type Reto = RetoJson & {
  id: number;
  // true si el reto es una actividad de todo el grupo y no un reto personal
  // de {player}: o bien no menciona a nadie en el texto, o bien está
  // marcado explícitamente con "grupal". Se usa para no mostrar el avatar
  // de un jugador concreto como si fuera "su turno" y para no sumarle la
  // racha individual (ver app/juego.tsx).
  esGrupal: boolean;
};

// Cada reto recibe un id estable (su posición en el JSON del modo), para
// poder llevar la cuenta de qué retos ya han salido en la partida.
const construirRetos = (lista: RetoJson[]): Reto[] =>
  lista.map((reto, id) => ({
    ...reto,
    id,
    esGrupal: Boolean(reto.grupal) || !reto.texto.includes("{player}"),
  }));

const modos: Record<ModoJuego, Reto[]> = {
  fiesta: construirRetos(fiesta as RetoJson[]),
  hot: construirRetos(hot as RetoJson[]),
};

// Descarta los retos que requieren un género del que no hay ningún jugador
// en la partida (ej. "Las chicas beben" si no juega ninguna mujer), y los
// retos de dos jugadores ({player2}) si no hay al menos 2 jugadores. Los
// jugadores sin género asignado cuentan como "inter".
export const obtenerRetos = (modo: ModoJuego, jugadores: Jugador[] = []): Reto[] => {
  const retos = modos[modo] || [];
  const generosPresentes = new Set<Genero>(
    jugadores.map((j) => j.genero ?? "inter")
  );
  return retos.filter((reto) => {
    if (reto.genero && !generosPresentes.has(reto.genero)) return false;
    if (reto.genero2 && !generosPresentes.has(reto.genero2)) return false;
    if (reto.texto.includes("{player2}") && jugadores.length < 2) return false;
    return true;
  });
};

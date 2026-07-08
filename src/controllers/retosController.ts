import { Genero, Jugador } from "../context/PlayersContext";
import fiesta from "../data/fiesta.json";
import hot from "../data/hot.json";

export type ModoJuego = "fiesta" | "hot";

type RetoJson = {
  texto: string;
  genero?: Genero;
};

export type Reto = RetoJson & {
  id: number;
};

// Cada reto recibe un id estable (su posición en el JSON del modo), para
// poder llevar la cuenta de qué retos ya han salido en la partida.
const construirRetos = (lista: RetoJson[]): Reto[] =>
  lista.map((reto, id) => ({ ...reto, id }));

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
    if (reto.texto.includes("{player2}") && jugadores.length < 2) return false;
    return true;
  });
};

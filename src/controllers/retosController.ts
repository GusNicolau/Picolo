import { Genero, Jugador } from "../context/PlayersContext";
import fiesta from "../data/fiesta.json";
import hot from "../data/hot.json";

export type ModoJuego = "fiesta" | "hot";

export type Reto = {
  texto: string;
  genero?: Genero;
};

const modos: Record<ModoJuego, Reto[]> = {
  fiesta: fiesta as Reto[],
  hot: hot as Reto[],
};

// Descarta los retos que requieren un género del que no hay ningún jugador
// en la partida (ej. "Las chicas beben" si no juega ninguna mujer). Los
// jugadores sin género asignado cuentan como "inter".
export const obtenerRetos = (modo: ModoJuego, jugadores: Jugador[] = []): Reto[] => {
  const retos = modos[modo] || [];
  const generosPresentes = new Set<Genero>(
    jugadores.map((j) => j.genero ?? "inter")
  );
  return retos.filter((reto) => !reto.genero || generosPresentes.has(reto.genero));
};

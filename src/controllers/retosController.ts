import fiesta from "../data/fiesta.json";
import hot from "../data/hot.json";

export type ModoJuego = "fiesta" | "hot";

const modos: Record<ModoJuego, string[]> = {
  fiesta,
  hot,
};

export const obtenerRetos = (modo: ModoJuego) => {
  return modos[modo] || [];
};

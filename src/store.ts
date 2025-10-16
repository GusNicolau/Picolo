let jugadores: string[] = [];

export const setJugadores = (lista: string[]) => {
  jugadores = lista;
};

export const getJugadores = (): string[] => {
  return jugadores;
};

export const clearJugadores = () => {
  jugadores = [];
};

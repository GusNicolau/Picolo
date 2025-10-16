import React, { createContext, ReactNode, useContext, useState } from "react";

export type ModoJuego = "fiesta" | "hot";
export type NavigationDirection = "forward" | "backward";

type PlayersContextType = {
  jugadores: string[];
  setJugadores: (jugadores: string[]) => void;
  addJugador: (jugador: string) => void;
  clearJugadores: () => void;
  modo: ModoJuego;
  setModo: (modo: ModoJuego) => void;
  navDirection: NavigationDirection;
  setNavDirection: (dir: NavigationDirection) => void;
};

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const [jugadores, setJugadoresState] = useState<string[]>([]);
  const [modo, setModo] = useState<ModoJuego>("hot");
  const [navDirection, setNavDirection] = useState<NavigationDirection>("forward");

  const addJugador = (jugador: string) => setJugadoresState((prev) => [...prev, jugador]);
  const clearJugadores = () => setJugadoresState([]);

  return (
    <PlayersContext.Provider
      value={{
        jugadores,
        setJugadores: setJugadoresState,
        addJugador,
        clearJugadores,
        modo,
        setModo,
        navDirection,
        setNavDirection,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) throw new Error("usePlayers debe usarse dentro de PlayersProvider");
  return context;
};

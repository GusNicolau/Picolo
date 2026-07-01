// src/context/PlayersContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

export type ModoJuego = "fiesta" | "hot";
export type NavDirection = "forward" | "backward";
export type Genero = "hombre" | "mujer" | "inter";

// Definimos el tipo Jugador con avatar y avatarName opcionales
export type Jugador = {
  nombre: string;
  avatar?: any;       // require(...) result
  avatarName?: string; // ej. "Gustavo", "Mario"
  genero?: Genero;
};

type PlayersContextType = {
  jugadores: Jugador[];
  setJugadores: (jugadores: Jugador[]) => void;
  addJugador: (jugador: Jugador) => void;
  editJugador: (nombreActual: string, cambios: Partial<Jugador>) => void;
  clearJugadores: () => void;
  modo: ModoJuego;
  setModo: (modo: ModoJuego) => void;
  navDirection: NavDirection;
  setNavDirection: (dir: NavDirection) => void;
};

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const [jugadores, setJugadoresState] = useState<Jugador[]>([]);
  const [modo, setModo] = useState<ModoJuego>("hot");
  const [navDirection, setNavDirection] = useState<NavDirection>("forward");

  const addJugador = (jugador: Jugador) => {
    setJugadoresState((prev) => [...prev, jugador]);
  };

  const editJugador = (nombreActual: string, cambios: Partial<Jugador>) => {
    setJugadoresState((prev) =>
      prev.map((j) => (j.nombre === nombreActual ? { ...j, ...cambios } : j))
    );
  };

  const clearJugadores = () => setJugadoresState([]);

  return (
    <PlayersContext.Provider
      value={{
        jugadores,
        setJugadores: setJugadoresState,
        addJugador,
        editJugador,
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

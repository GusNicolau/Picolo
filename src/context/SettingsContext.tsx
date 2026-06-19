// src/context/SettingsContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

const STORAGE_KEY_SOUND = "@picolo/sound_enabled";
const STORAGE_KEY_UNLOCKED = "@picolo/moustache_unlocked";
const CODIGO_MOUSTACHE = "moustache";

type SettingsContextType = {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  moustacheUnlocked: boolean;
  canjearCodigo: (codigo: string) => boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [moustacheUnlocked, setMoustacheUnlocked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [sound, unlocked] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_SOUND),
          AsyncStorage.getItem(STORAGE_KEY_UNLOCKED),
        ]);
        if (sound !== null) setSoundEnabledState(sound === "true");
        if (unlocked === "true") setMoustacheUnlocked(true);
      } catch {
        // Si falla la carga, nos quedamos con los valores por defecto
      }
    })();
  }, []);

  const setSoundEnabled = (value: boolean) => {
    setSoundEnabledState(value);
    AsyncStorage.setItem(STORAGE_KEY_SOUND, String(value)).catch(() => {});
  };

  const canjearCodigo = (codigo: string) => {
    const valido = codigo.trim().toLowerCase() === CODIGO_MOUSTACHE;
    if (valido) {
      setMoustacheUnlocked(true);
      AsyncStorage.setItem(STORAGE_KEY_UNLOCKED, "true").catch(() => {});
    }
    return valido;
  };

  return (
    <SettingsContext.Provider
      value={{ soundEnabled, setSoundEnabled, moustacheUnlocked, canjearCodigo }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings debe usarse dentro de SettingsProvider");
  return context;
};

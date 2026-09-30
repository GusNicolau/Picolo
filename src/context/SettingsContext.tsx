// src/context/SettingsContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { initSounds, updateSoundSettings } from "../soundManager";

const STORAGE_KEY_SOUND = "@picolo/sound_enabled";
const STORAGE_KEY_VOLUME = "@picolo/sound_volume";
const STORAGE_KEY_UNLOCKED = "@picolo/moustache_unlocked";
const CODIGO_MOUSTACHE = "moustache";

type SettingsContextType = {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  soundVolume: number;
  setSoundVolume: (value: number) => void;
  moustacheUnlocked: boolean;
  canjearCodigo: (codigo: string) => boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [soundVolume, setSoundVolumeState] = useState(1);
  const [moustacheUnlocked, setMoustacheUnlocked] = useState(false);

  useEffect(() => {
    (async () => {
      let enabled = true;
      let volume = 1;
      try {
        const [sound, vol, unlocked] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_SOUND),
          AsyncStorage.getItem(STORAGE_KEY_VOLUME),
          AsyncStorage.getItem(STORAGE_KEY_UNLOCKED),
        ]);
        if (sound !== null) enabled = sound === "true";
        if (vol !== null) volume = parseFloat(vol);
        if (unlocked === "true") setMoustacheUnlocked(true);
        setSoundEnabledState(enabled);
        setSoundVolumeState(volume);
      } catch {
        // Si falla la carga, nos quedamos con los valores por defecto
      }
      await initSounds();
      updateSoundSettings({ enabled, volume });
    })();
  }, []);

  const setSoundEnabled = (value: boolean) => {
    setSoundEnabledState(value);
    updateSoundSettings({ enabled: value });
    AsyncStorage.setItem(STORAGE_KEY_SOUND, String(value)).catch(() => {});
  };

  const setSoundVolume = (value: number) => {
    setSoundVolumeState(value);
    updateSoundSettings({ volume: value });
    AsyncStorage.setItem(STORAGE_KEY_VOLUME, String(value)).catch(() => {});
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
      value={{
        soundEnabled,
        setSoundEnabled,
        soundVolume,
        setSoundVolume,
        moustacheUnlocked,
        canjearCodigo,
      }}
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

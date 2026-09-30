import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

type SoundName = "correct" | "fail";

const soundFiles: Record<SoundName, number> = {
  correct: require("../assets/audio/Correct.wav"),
  fail: require("../assets/audio/Fail.mp3"),
};

let cachedPlayers: Partial<Record<SoundName, ReturnType<typeof createAudioPlayer>>> = {};
let soundSettings = {
  enabled: true,
  volume: 1,
};

export const initSounds = async () => {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });

    for (const name of Object.keys(soundFiles) as SoundName[]) {
      try {
        cachedPlayers[name] = createAudioPlayer(soundFiles[name]);
      } catch (error) {
        console.warn(`Error precargando sonido ${name}:`, error);
      }
    }
  } catch (error) {
    console.warn("Error inicializando audio:", error);
  }
};

export const updateSoundSettings = (settings: Partial<typeof soundSettings>) => {
  soundSettings = { ...soundSettings, ...settings };
};

export const playSound = async (name: SoundName) => {
  if (!soundSettings.enabled) return;

  try {
    const player = cachedPlayers[name];
    if (!player) return;

    player.pause();
    await player.seekTo(0);
    player.volume = soundSettings.volume;
    player.play();
  } catch (error) {
    console.warn(`Error reproduciendo sonido ${name}:`, error);
  }
};

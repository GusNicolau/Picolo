import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { usePlayers } from "../src/context/PlayersContext";

export default function HomeScreen() {
  const router = useRouter();
  const { setModo } = usePlayers();
  const colorScheme = useColorScheme();

  const seleccionarModo = (modo: "fiesta" | "hot") => {
    setModo(modo);
    router.push("/jugadores");
  };

  return (
    <ImageBackground
      source={require("../assets/images/fuego-fondo.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>PICOLO BATTLE</Text>
        <Text style={styles.subtitle}>Selecciona tu modo de combate</Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonPrimary,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => seleccionarModo("fiesta")}
        >
          <Text style={styles.buttonPrimaryText}>MODO FIESTA</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonSecondary,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => seleccionarModo("hot")}
        >
          <Text style={styles.buttonSecondaryText}>MODO CALIENTE</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

// Paleta reducida y plana: un único acento (ámbar) sobre fondo oscuro neutro
const COLORS = {
  overlay: "rgba(10, 10, 13, 0.92)",
  accent: "#F2A93B",
  accentSoft: "rgba(242,169,59,0.35)",
  accentOn: "#1C1408", // texto oscuro sobre botones de acento
  text: "#F5F5F7",
  textMuted: "#9A9AA5",
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: 1,
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 50,
    textAlign: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderColor: COLORS.accentSoft,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonPrimaryText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.accentOn,
    letterSpacing: 0.5,
  },
  buttonSecondaryText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
});

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
            styles.greenButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => seleccionarModo("fiesta")}
        >
          <Text style={styles.buttonText}>MODO FIESTA</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.redButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => seleccionarModo("hot")}
        >
          <Text style={styles.buttonText}>MODO CALIENTE</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FFD700",
    textShadowColor: "#FF4500",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#bbb",
    marginBottom: 50,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  button: {
    width: "80%",
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },
  greenButton: {
    backgroundColor: "#1E8449",
    borderColor: "#00FF88",
  },
  redButton: {
    backgroundColor: "#8B0000",
    borderColor: "#FF4C61",
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

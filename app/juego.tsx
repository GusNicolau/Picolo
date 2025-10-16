import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePlayers } from "../src/context/PlayersContext";
import { obtenerRetos } from "../src/controllers/retosController";

export default function JuegoScreen() {
  const { jugadores, modo } = usePlayers();
  const [reto, setReto] = useState<string>("Pulsa el botón para empezar 👇");

  const retos = obtenerRetos(modo);

  const generarReto = () => {
    if (jugadores.length === 0 || retos.length === 0) {
      setReto("No hay jugadores o retos disponibles 😅");
      return;
    }

    const retoAleatorio = retos[Math.floor(Math.random() * retos.length)];
    if (retoAleatorio.includes("{player}")) {
      const jugadorRandom = jugadores[Math.floor(Math.random() * jugadores.length)];
      setReto(retoAleatorio.replace("{player}", jugadorRandom));
    } else {
      setReto(retoAleatorio);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎲 Reto actual</Text>
      <View style={styles.card}>
        <Text style={styles.reto}>{reto}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={generarReto}>
        <Text style={styles.buttonText}>➡️ Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

// Mantén tus estilos como estaban
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F3460",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
  },
  reto: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF4C61",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

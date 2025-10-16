import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePlayers } from "../src/context/PlayersContext";

export default function HomeScreen() {
  const router = useRouter();
  const { setModo } = usePlayers();

  const seleccionarModo = (modo: "fiesta" | "hot") => {
    setModo(modo);
    console.log("Modo seleccionado:", modo);
    router.push("/jugadores");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍻 Bienvenido a Picolo 🍻</Text>
      <Text style={styles.subtitle}>Elige un modo de juego</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2ecc71" }]}
        onPress={() => seleccionarModo("fiesta")}
      >
        <Text style={styles.buttonText}>🎉 Modo Fiesta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FF4C61" }]}
        onPress={() => seleccionarModo("hot")}
      >
        <Text style={styles.buttonText}>🔥 Modo Caliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16213E",
    padding: 20,
  },
  title: { fontSize: 28, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, color: "#ccc", marginBottom: 40 },
  button: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { fontSize: 20, color: "#fff", fontWeight: "bold" },
});

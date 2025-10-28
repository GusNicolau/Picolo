import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <View style={[styles.container, { backgroundColor: colorScheme === "dark" ? "#0F3460" : "#FFFFFF" }]}>
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
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#fff", textAlign: "center" },
  subtitle: { fontSize: 18, color: "#ccc", marginBottom: 40, textAlign: "center" },
  button: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
});

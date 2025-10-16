import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { usePlayers } from "../src/context/PlayersContext";

// Mapa de avatares de Moustache
const avatares: Record<string, any> = {
  Gustavo: require("../assets/moustache/gustavo.png"),
  Carlos: require("../assets/moustache/carlos.png"),
};

export default function JugadoresScreen() {
  const [nombre, setNombre] = useState("");
  const { jugadores, addJugador, setJugadores } = usePlayers();
  const router = useRouter();

  const añadirJugador = () => {
    if (nombre.trim() !== "") {
      addJugador(nombre.trim());
      setNombre("");
    }
  };

  const eliminarJugador = (nombre: string) => {
    setJugadores(jugadores.filter(j => j !== nombre));
  };

  const empezarJuego = () => {
    router.push("/juego");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Añadir jugadores</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe un nombre"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
        onSubmitEditing={añadirJugador}
      />

      <TouchableOpacity style={styles.addButton} onPress={añadirJugador}>
        <Text style={styles.addButtonText}>➕ Añadir</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "#1ABC9C", marginTop: 10 }]}
        onPress={() => router.push("/moustache")}
      >
        <Text style={styles.addButtonText}>🧔 Moustache</Text>
      </TouchableOpacity>

      <FlatList
  data={jugadores}
  keyExtractor={(item, index) => index.toString()}
  style={{ marginTop: 20, width: "100%" }}
  renderItem={({ item }) => {
    const avatar = avatares[item];
    return (
      <View style={styles.playerContainer}>
        {avatar && <Image source={avatar} style={styles.avatar} />}
        <Text style={styles.player}>{item}</Text>
        <TouchableOpacity onPress={() => eliminarJugador(item)}>
          <Text style={styles.delete}>❌</Text>
        </TouchableOpacity>
      </View>
    );
  }}
/>


      {jugadores.length > 0 && (
        <TouchableOpacity style={styles.startButton} onPress={empezarJuego}>
          <Text style={styles.startButtonText}>▶️ Empezar juego</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16213E",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 50,   // ↑ Añadido margen superior
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1A1A2E",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4CFF85",
    width: "100%",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4CFF85",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  playerContainer: {
    flexDirection: "row", // horizontal
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "space-between", // espacio entre nombre y botón eliminar
},
player: {
  fontSize: 18,
  color: "#fff",
  marginLeft: 30, // separa nombre de la imagen
  flex: 1, // para ocupar todo el espacio disponible y empujar el botón al final
},
avatar: {
  width: 50,
  height: 50,
  borderRadius: 15,
},
delete: {
  fontSize: 18,
  color: "#FF4C61",
  marginLeft: 10,
},

  startButton: {
    marginTop: 20,   // Reduce el margen para que no esté pegado al final
    backgroundColor: "#FF4C61",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 50, // ↑ Añadido margen inferior
  },
  startButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

import BotonVolver from "@/src/components/BotonVolver";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";







import { Jugador, usePlayers } from "../src/context/PlayersContext";

// Mapa de avatares de Moustache
const avatares: Record<string, any> = {
  Gustavo: require("../assets/moustache/gustavo.png"),
  Carlos: require("../assets/moustache/carlos.png"),
  Dani: require("../assets/moustache/dani.png"),
  Andreu: require("../assets/moustache/andreu.png"),
  Mario: require("../assets/moustache/mario.png"),
};

export default function JugadoresScreen() {
  const [nombre, setNombre] = useState("");
  const { jugadores, addJugador, setJugadores } = usePlayers();
  const router = useRouter();

  const añadirJugador = () => {
    const trimmed = nombre.trim();
    if (!trimmed) return;

    const nuevoJugador: Jugador = {
      nombre: trimmed,
      avatar: avatares[trimmed] || undefined,
    };
    addJugador(nuevoJugador);
    setNombre("");
  };

  const eliminarJugador = (nombre: string) => {
    setJugadores(jugadores.filter((j) => j.nombre !== nombre));
  };

  const empezarJuego = () => {
    router.push("/juego");
  };

  return (
    <ImageBackground
      source={require("../assets/images/fuego-fondo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <BotonVolver />

        <Text style={styles.title}>Añadir jugadores</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un nombre"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
            onSubmitEditing={añadirJugador}
          />
          <TouchableOpacity style={styles.addButtonSmall} onPress={añadirJugador}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.moustacheButton}
          onPress={() => router.push("/moustache")}
        >
          <Text style={styles.addButtonText}>Moustache</Text>
        </TouchableOpacity>


        <FlatList
          data={jugadores}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.playerContainer}>
              <Image source={item.avatar || avatares["Gustavo"]} style={styles.avatar} />
              <NeonText text={item.nombre} />

              <TouchableOpacity onPress={() => eliminarJugador(item.nombre)}>
                <Text style={styles.delete}>✖</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {jugadores.length > 0 && (
          <TouchableOpacity style={styles.startButton} onPress={empezarJuego}>
            <Text style={styles.startButtonText}>▶ Empezar juego</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const NeonText = ({ text }: { text: string }) => {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // Efecto de brillo "neón fuego"
  const neonColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f8e6bdff", "#FF4C61"], // 🔥 de dorado a rojo intenso
  });

  const shadowIntensity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 12],
  });


  return (
    <Animated.Text
      style={[
        styles.player,
        {
          color: neonColor,
          textShadowColor: "#FF4500",
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: shadowIntensity,
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#FFD700",
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    textShadowColor: "#FF4500",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(20, 20, 35, 0.9)",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff704cff",
    fontSize: 16,
  },
  addButtonSmall: {
    backgroundColor: "#ff704cff",
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    marginTop: 15,
    backgroundColor: "#8B0000",
    borderColor: "#FF4C61",
    borderWidth: 2,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#FF4C61",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  // Puedes usar esta variación para el botón de Moustache (color distinto)
  moustacheButton: {
    marginTop: 15,
    backgroundColor: "#f85555ff",
    borderColor: "#6d0303ff",
    borderWidth: 2,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#690505ff",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  list: {
    marginTop: 20,
    width: "100%",
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 46, 0.95)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FF4C61",
    shadowColor: "#FF4C61",
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  player: {
    fontSize: 25,
    textAlign: "center",
    color: "#fff",
    marginLeft: 20,
    flex: 1,
    fontWeight: "600",
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 15,
    borderWidth: 0,
    borderColor: "#492faaff",
  },
  delete: {
    fontSize: 30,
    color: "#FF4C61",
    marginLeft: 10,
  },
  startButton: {
    marginTop: 30,
    backgroundColor: "#8B0000",
    borderColor: "#FF4C61",
    borderWidth: 2,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#FF4C61",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    marginBottom: 60,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});

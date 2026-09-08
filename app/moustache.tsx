import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlayers } from "../src/context/PlayersContext";

const amigos = [
  { nombre: "Sherco", imagen: require("../assets/moustache/gustavo.png") },
  { nombre: "Carlota", imagen: require("../assets/moustache/carlos.png") },
  { nombre: "Toffe", imagen: require("../assets/moustache/andreu.png") },
  { nombre: "Mariojt72", imagen: require("../assets/moustache/mario.png") },
  { nombre: "Calent", imagen: require("../assets/moustache/dani.png") },
  { nombre: "Amerla", imagen: require("../assets/moustache/ale.png") },
  { nombre: "Cigrona", imagen: require("../assets/moustache/lara.png") },
  {
    nombre: "Pantorrilla",
    imagen: require("../assets/moustache/pantorrilla.png"),
  },
  { nombre: "Princesa", imagen: require("../assets/moustache/princesa.png") },
];

export default function MoustacheScreen() {
  const router = useRouter();
  const { addJugador, jugadores } = usePlayers();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  // Filtra los amigos que ya están seleccionados
  const disponibles = amigos.filter(
    (a) => !jugadores.some((j) => j.nombre === a.nombre),
  );

  const toggleSeleccion = (nombre: string) => {
    setSeleccionados((prev) =>
      prev.includes(nombre)
        ? prev.filter((n) => n !== nombre)
        : [...prev, nombre],
    );
  };

  const confirmarSeleccion = () => {
    seleccionados.forEach((nombre) => {
      const avatarData = amigos.find((a) => a.nombre === nombre);

      const jugador = {
        nombre, // nombre del jugador
        avatar: avatarData?.imagen, // imagen del avatar
        avatarName: avatarData?.nombre, // 👈 añadimos el nombre del avatar
      };

      addJugador(jugador);
    });
    router.replace("/jugadores");
  };

  return (
    <ImageBackground
      source={require("../assets/images/fuego-fondo.jpg")} // 🔥 fondo de llamas
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Avatares</Text>

        <FlatList
          data={disponibles}
          keyExtractor={(item) => item.nombre}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => {
            const isSelected = seleccionados.includes(item.nombre);
            return (
              <TouchableOpacity
                onPress={() => toggleSeleccion(item.nombre)}
                style={[
                  styles.cardContainer,
                  isSelected && styles.cardSelected,
                ]}
                activeOpacity={0.8}
              >
                <ImageBackground
                  source={item.imagen}
                  style={styles.image}
                  imageStyle={{ borderRadius: 15 }}
                >
                  <View style={styles.nameOverlay}>
                    <Text style={styles.name}>{item.nombre}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
        />

        {seleccionados.length > 0 && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmarSeleccion}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmText}>
              CONFIRMAR ({seleccionados.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

// Paleta reducida y plana: un único acento (ámbar) sobre fondo oscuro neutro
const COLORS = {
  overlay: "rgba(10, 10, 13, 0.92)",
  card: "#1C1C24",
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#F2A93B",
  accentOn: "#1C1408", // texto oscuro sobre botones de acento
  text: "#F5F5F7",
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    width: "100%",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.3,
    marginBottom: 24,
    textAlign: "center",
  },
  grid: {
    justifyContent: "center",
  },
  cardContainer: {
    margin: 8,
    width: 150,
    height: 150,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: "hidden",
    backgroundColor: COLORS.card,
  },
  cardSelected: {
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  nameOverlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 6,
    alignItems: "center",
  },
  name: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },
  confirmButton: {
    marginTop: 24,
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 12,
    width: "70%",
    alignItems: "center",
    marginBottom: 60,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.accentOn,
    letterSpacing: 0.5,
  },
});

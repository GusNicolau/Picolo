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
import { useSettings } from "../src/context/SettingsContext";

const animales = [
  { nombre: "Rana", imagen: require("../assets/avatares/rana.webp") },
  { nombre: "Caballo", imagen: require("../assets/avatares/caballo.webp") },
  { nombre: "Oveja", imagen: require("../assets/avatares/oveja.webp") },
  { nombre: "Perro", imagen: require("../assets/avatares/perro.webp") },
  { nombre: "Gata", imagen: require("../assets/avatares/gata.webp") },
];

const amigos = [
  { nombre: "Sherco", imagen: require("../assets/moustache/gustavo.webp") },
  { nombre: "Carlota", imagen: require("../assets/moustache/carlos.webp") },
  { nombre: "Toffe", imagen: require("../assets/moustache/andreu.webp") },
  { nombre: "Mariojt72", imagen: require("../assets/moustache/mario.webp") },
  { nombre: "Calent", imagen: require("../assets/moustache/dani.webp") },
  { nombre: "Amerla", imagen: require("../assets/moustache/ale.webp") },
  { nombre: "Cigrona", imagen: require("../assets/moustache/lara.webp") },
  {
    nombre: "Pantorrilla",
    imagen: require("../assets/moustache/pantorrilla.webp"),
  },
  { nombre: "Princesa", imagen: require("../assets/moustache/princesa.webp") },
];

const todos = [...animales, ...amigos];

type Seccion = "animales" | "moustache";

export default function AvataresScreen() {
  const router = useRouter();
  const { addJugador, jugadores } = usePlayers();
  const { moustacheUnlocked } = useSettings();
  const [seccion, setSeccion] = useState<Seccion>("animales");
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const listaActual = seccion === "moustache" && moustacheUnlocked ? amigos : animales;

  // Filtra los avatares que ya están en uso por un jugador existente
  const disponibles = listaActual.filter(
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
      const avatarData = todos.find((a) => a.nombre === nombre);
      if (!avatarData) return;

      addJugador({
        nombre,
        avatar: avatarData.imagen,
        avatarName: avatarData.nombre,
        genero: "inter",
      });
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

        {moustacheUnlocked && (
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                seccion === "animales" && styles.tabButtonActive,
              ]}
              onPress={() => setSeccion("animales")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  seccion === "animales" && styles.tabButtonTextActive,
                ]}
              >
                Animales
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                seccion === "moustache" && styles.tabButtonActive,
              ]}
              onPress={() => setSeccion("moustache")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  seccion === "moustache" && styles.tabButtonTextActive,
                ]}
              >
                Moustache
              </Text>
            </TouchableOpacity>
          </View>
        )}

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
  textMuted: "#9A9AA5",
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
    marginBottom: 16,
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: COLORS.accent,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  tabButtonTextActive: {
    color: COLORS.accentOn,
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

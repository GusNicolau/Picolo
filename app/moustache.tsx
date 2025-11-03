import BotonVolver from "@/src/components/BotonVolver";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  { nombre: "Gustavo", imagen: require("../assets/moustache/gustavo.png") },
  { nombre: "Carlos", imagen: require("../assets/moustache/carlos.png") },
  { nombre: "Andreu", imagen: require("../assets/moustache/andreu.png") },
  { nombre: "Mario", imagen: require("../assets/moustache/mario.png") },
  { nombre: "Dani", imagen: require("../assets/moustache/dani.png") },
  { nombre: "Ale", imagen: require("../assets/moustache/ale.png") },
];

export default function MoustacheScreen() {
  const router = useRouter();
  const { addJugador, jugadores } = usePlayers();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  // Filtra los amigos que ya están seleccionados
  const disponibles = amigos.filter(
    (a) => !jugadores.some((j) => j.nombre === a.nombre)
  );

  const toggleSeleccion = (nombre: string) => {
    setSeleccionados((prev) =>
      prev.includes(nombre)
        ? prev.filter((n) => n !== nombre)
        : [...prev, nombre]
    );
  };

  const confirmarSeleccion = () => {
    seleccionados.forEach((nombre) => {
      const avatarData = amigos.find((a) => a.nombre === nombre);

      const jugador = {
        nombre,                       // nombre del jugador
        avatar: avatarData?.imagen,   // imagen del avatar
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
        <BotonVolver />

        <Text style={styles.title}>ELIGE TUS LUCHADORES</Text>

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
                style={[styles.cardContainer, isSelected && styles.cardSelected]}
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)", // capa oscura para mejorar el contraste
    width: "100%",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFD700",
    textShadowColor: "#FF4500",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
    letterSpacing: 2,
    marginBottom: 30,
    textAlign: "center",
  },
  grid: {
    justifyContent: "center",
  },
  cardContainer: {
    margin: 10,
    width: 150,
    height: 150,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#555",
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  cardSelected: {
    borderColor: "#FF4C61",
    shadowColor: "#FF4C61",
    transform: [{ scale: 1.05 }],
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  nameOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: "#8B0000",
    borderColor: "#FF4C61",
    borderWidth: 2,
    paddingVertical: 16,
    borderRadius: 12,
    width: "70%",
    alignItems: "center",
    elevation: 6,
    marginBottom: 60,
  },
  confirmText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});

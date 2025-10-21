import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePlayers } from "../src/context/PlayersContext";

const amigos = [
  { nombre: "Gustavo", imagen: require("../assets/moustache/gustavo.png") },
  { nombre: "Carlos", imagen: require("../assets/moustache/carlos.png") },
  { nombre: "Andreu", imagen: require("../assets/moustache/andreu.png") },
  { nombre: "Dani", imagen: require("../assets/moustache/dani.png") },
];

export default function MoustacheScreen() {
  const router = useRouter();
  const { addJugador } = usePlayers();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const toggleSeleccion = (nombre: string) => {
    setSeleccionados((prev) =>
      prev.includes(nombre)
        ? prev.filter((n) => n !== nombre)
        : [...prev, nombre]
    );
  };

  const confirmarSeleccion = () => {
    seleccionados.forEach((nombre) => {
      const jugador = {
        nombre,
        avatar: amigos.find(a => a.nombre === nombre)?.imagen
      };
      addJugador(jugador);
    });
    router.back();
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>👊 Elige tus luchadores 👊</Text>

      <FlatList
        data={amigos}
        keyExtractor={(item) => item.nombre}
        numColumns={2}
        renderItem={({ item }) => {
          const isSelected = seleccionados.includes(item.nombre);
          return (
<TouchableOpacity
  onPress={() => toggleSeleccion(item.nombre)}
  style={styles.cardContainer}
>
  <ImageBackground
    source={item.imagen}
    style={[styles.image, isSelected && styles.borderSelected]}
    imageStyle={{ borderRadius: 15 }}
  >
    <View style={styles.overlay}>
      <Text style={styles.name}>{item.nombre}</Text>
    </View>
  </ImageBackground>
</TouchableOpacity>


          );
        }}
        contentContainerStyle={styles.grid}
      />

      {seleccionados.length > 0 && (
        <TouchableOpacity style={styles.confirmButton} onPress={confirmarSeleccion}>
          <Text style={styles.confirmText}>✔️ Confirmar ({seleccionados.length})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F3460",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 25,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginTop: 50,
  },
  grid: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    margin: 10,
    width: 150,
    height: 150,
  },
  card: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden', // recorta la imagen para que sea redondeada
  },
  cardSelected: {
    borderWidth: 4,
    borderColor: "#FF4C61",
    borderRadius: 15,
  },
image: {
  flex: 1,
  justifyContent: "flex-end",
  borderRadius: 15,
  borderWidth: 4,
  borderColor: "transparent", // borde invisible por defecto
},
borderSelected: {
  borderColor: "#FF4C61", // borde rojo cuando está seleccionado
},

overlay: {
  backgroundColor: "rgba(0,0,0,0.5)",
  paddingVertical: 6,
  alignItems: "center",
  borderRadius: 15,
},
  
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#4CFF85",
    padding: 15,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    marginBottom: 50, // ↑ Añadido margen inferior
  },
  confirmText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

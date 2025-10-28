import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const avatares: Record<string, any> = {
  Gustavo: require("../assets/moustache/gustavo.png"),
  Carlos: require("../assets/moustache/carlos.png"),
  Andreu: require("../assets/moustache/andreu.png"),
  Dani: require("../assets/moustache/dani.png"),
  Mario: require("../assets/moustache/mario.png"),
};

const avatarPorDefecto = require("../assets/moustache/gustavo.png");

export default function ResultadosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const resultadosObj = params.resultados ? JSON.parse(params.resultados as string) : {};

  const jugadoresOrdenados = Object.entries(resultadosObj).sort(
    ([, statsA], [, statsB]) => statsB.cumplidos - statsA.cumplidos
  );

  const volverAJugadores = () => {
    router.push("/jugadores");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Resultados de la partida</Text>
      <FlatList
        data={jugadoresOrdenados}
        keyExtractor={([nombre]) => nombre}
        renderItem={({ item: [nombre, stats] }) => (
          <View style={styles.playerContainer}>
            <Image
              source={avatares[nombre] || avatarPorDefecto}
              style={styles.avatar}
            />
            <Text style={styles.player}>
              {nombre}: ✅ {stats.cumplidos}  ❌ {stats.fallos}
            </Text>
          </View>
        )}
        style={{ width: "100%", marginBottom: 20 }}
      />

      <TouchableOpacity style={styles.button} onPress={volverAJugadores}>
        <Text style={styles.buttonText}>🔙 Volver a jugadores</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0F3460", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20 
  },
  title: { 
    fontSize: 28,
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 30,
    marginTop: 50 
  },
  playerContainer: { 
    backgroundColor: "#1A1A2E",
    marginTop: 5,
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#a50d0dff",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  avatar: { 
    width: 70,
    height: 70,
    borderRadius: 15,
    marginRight: 20,
    //borderWidth: 3,
    //borderColor: "#4CFF85",
  },
  player: { 
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    marginBottom: 40,
    backgroundColor: "#FF4C61",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

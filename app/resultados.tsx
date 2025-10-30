import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const avatares: Record<string, any> = {
  Gustavo: require("../assets/moustache/gustavo.png"),
  Carlos: require("../assets/moustache/carlos.png"),
  Andreu: require("../assets/moustache/andreu.png"),
  Dani: require("../assets/moustache/dani.png"),
  Mario: require("../assets/moustache/mario.png"),
  Ale: require("../assets/moustache/ale.png"),
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
    <ImageBackground
      source={require("../assets/images/fuego-fondo.jpg")} // 🔥 fondo de fuego
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>RESULTADOS FINALES</Text>

        <FlatList
          data={jugadoresOrdenados}
          keyExtractor={([nombre]) => nombre}
          renderItem={({ item: [nombre, stats], index }) => (
            <View
              style={[
                styles.playerContainer,
                index === 0 && styles.primerLugar,
                index === 1 && styles.segundoLugar,
                index === 2 && styles.tercerLugar,
              ]}
            >
              <Image
                source={avatares[nombre] || avatarPorDefecto}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.playerName}>
                  {index + 1}. {nombre}
                </Text>
                <Text style={styles.stats}>
                  ✅ {stats.cumplidos}   ❌ {stats.fallos}
                </Text>
              </View>
            </View>
          )}
          style={{ width: "100%", marginBottom: 30 }}
        />

        <TouchableOpacity style={styles.button} onPress={volverAJugadores}>
          <Text style={styles.buttonText}>🔙 Volver a jugadores</Text>
        </TouchableOpacity>
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
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFD700",
    textShadowColor: "#FF4500",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    marginTop: 50,
    marginBottom: 40,
    textAlign: "center",
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 46, 0.9)",
    marginBottom: 10,
    padding: 15,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  primerLugar: {
    borderColor: "#FFD700",
    borderWidth: 3,
  },
  segundoLugar: {
    borderColor: "#C0C0C0",
    borderWidth: 2,
  },
  tercerLugar: {
    borderColor: "#CD7F32",
    borderWidth: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 20,
  },
  playerName: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  stats: {
    fontSize: 18,
    color: "#FFDDDD",
  },
  button: {
    backgroundColor: "#FF4C61",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4C61",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

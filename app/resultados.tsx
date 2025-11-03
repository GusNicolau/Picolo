import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated, Easing,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const neonColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF4500", "#FFD700"], // fuego → dorado
  });


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
                <Animated.Text style={[styles.playerName, { textShadowColor: neonColor }]}>
                  {index + 1}. {nombre}
                </Animated.Text>

                <Text style={styles.stats}>
                  🍺 {stats.cumplidos}   ✖ {stats.fallos}
                </Text>

              </View>
            </View>
          )}
          style={{ width: "100%", marginBottom: 30 }}
        />

        <TouchableOpacity style={styles.button} onPress={volverAJugadores}>
          <Text style={styles.buttonText}>Volver a jugadores</Text>
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
    marginTop: 120,
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
    textAlign: "center",
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  stats: {
    textAlign: "center",
    fontSize: 28,
    color: "#FFDDDD",
  },
  button: {
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
  buttonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});

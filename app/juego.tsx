import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import BotonVolver from "../src/components/BotonVolver";
import { Jugador, usePlayers } from "../src/context/PlayersContext";
import { obtenerRetos } from "../src/controllers/retosController";

const avatarPorDefecto = require("../assets/moustache/gustavo.png");

export default function JuegoScreen() {
  const router = useRouter();
  const { jugadores, modo } = usePlayers();
  const [reto, setReto] = useState<string>("");
  const [jugadorActual, setJugadorActual] = useState<Jugador | null>(null);
  const [resultados, setResultados] = useState<Record<string, { cumplidos: number; fallos: number }>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  const retos = obtenerRetos(modo);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    generarReto();
  }, []);

  const generarReto = () => {
    if (!jugadores.length || !retos.length) {
      setReto(""); // asegura que nunca sea undefined
      setJugadorActual(null);
      return;
    }

    const jugadorRandom = jugadores[Math.floor(Math.random() * jugadores.length)];
    const retoAleatorio = retos[Math.floor(Math.random() * retos.length)];
    setJugadorActual(jugadorRandom);

    setReto(
      retoAleatorio.includes("{player}")
        ? retoAleatorio.replace("{player}", jugadorRandom.nombre)
        : retoAleatorio
    );
  };

  const registrarResultado = (cumplido: boolean) => {
    if (!jugadorActual) return;

    setResultados((prev) => {
      const prevData = prev[jugadorActual.nombre] || { cumplidos: 0, fallos: 0 };
      return {
        ...prev,
        [jugadorActual.nombre]: {
          cumplidos: prevData.cumplidos + (cumplido ? 1 : 0),
          fallos: prevData.fallos + (!cumplido ? 1 : 0),
        },
      };
    });
  };

  const handleSwipe = (cumplido: boolean) => {
    if (!jugadorActual) return;

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: cumplido ? -500 : 500, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      registrarResultado(cumplido);
      generarReto();

      if (cumplido) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }

      translateX.setValue(0);
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true, friction: 5, tension: 60 }).start();
    });
  };

  const onGestureEvent = Animated.event([{ nativeEvent: { translationX: translateX } }], { useNativeDriver: true });
  const onHandlerStateChange = ({ nativeEvent }: any) => {
    const threshold = 100;
    if (nativeEvent.translationX > threshold) handleSwipe(false);
    else if (nativeEvent.translationX < -threshold) handleSwipe(true);
    else Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 5, tension: 60 }).start();
  };

  const terminarPartida = () => {
    router.push({ pathname: "/resultados", params: { resultados: JSON.stringify(resultados) } });
  };

  const rotate = translateX.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ["-40deg", "0deg", "40deg"],
    extrapolate: "clamp",
  });

  const backgroundColor = translateX.interpolate({
    inputRange: [-500, 0, 500],
    outputRange: ["#4CFF85", "#0F3460", "#FF4C61"],
    extrapolate: "clamp",
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { backgroundColor }]}>
        <BotonVolver />
        <TouchableOpacity style={styles.terminarButton} onPress={terminarPartida}>
          <Text style={styles.terminarText}>❌</Text>
        </TouchableOpacity>

        <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onHandlerStateChange}>
          <Animated.View style={[styles.card, { transform: [{ translateX }, { rotate }], opacity }]}>
            <Text style={styles.title}>🎲 Reto actual</Text>

            {jugadorActual && (
              <View style={{ alignItems: "center" }}>
                <Image source={jugadorActual.avatar || avatarPorDefecto} style={styles.avatarJugador} />
                <Text style={styles.jugadorNombre}>{jugadorActual.nombre}</Text>
              </View>
            )}

            <Text style={styles.reto}>{reto || ""}</Text>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  card: {
    width: "100%",
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  jugadorNombre: { fontSize: 24, fontWeight: "bold", color: "#fff", marginVertical: 10, textAlign: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 15, textAlign: "center" },
  reto: { fontSize: 22, color: "#fff", textAlign: "center", marginVertical: 15 },
  avatarJugador: { width: 320, height: 320, borderRadius: 10, marginBottom: 15 },
  terminarButton: { position: "absolute", top: 40, right: 20, padding: 12, borderRadius: 25, zIndex: 10 },
  terminarText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

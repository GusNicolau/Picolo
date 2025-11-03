import { Asset } from "expo-asset"; // <-- precarga imágenes
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  // refs para el siguiente reto/jugador (precarga)
  const nextRetoRef = useRef<string | null>(null);
  const nextJugadorRef = useRef<Jugador | null>(null);

  useEffect(() => {
    // Preparar primero y luego poner en pantalla — evita parpadeos
    (async () => {
      await prepararSiguiente();        // precarga next
      aplicarSiguienteEnPantalla();     // setear current = next
      prepararSiguiente();              // empezar a preparar el siguiente de nuevo
    })();
  }, []);

  // Genera y precarga el siguiente reto/jugador en next*Ref
  const prepararSiguiente = async () => {
    if (!jugadores?.length || !retos?.length) {
      nextRetoRef.current = "";
      nextJugadorRef.current = null;
      return;
    }

    const jugadorRandom = jugadores[Math.floor(Math.random() * jugadores.length)];
    const retoAleatorio = retos[Math.floor(Math.random() * retos.length)];
    const texto = retoAleatorio.includes("{player}")
      ? retoAleatorio.replace("{player}", jugadorRandom.nombre)
      : retoAleatorio;

    // precargar avatar si existe (local o remoto). Para local require no hace daño.
    try {
      const avatar = jugadorRandom.avatar || avatarPorDefecto;
      // Asset.fromModule funciona con require(...) (local) y con módulos; para URLs usar Image.prefetch
      if (typeof avatar === "number") {
        // local require()
        await Asset.fromModule(avatar).downloadAsync();
      } else if (typeof avatar === "string") {
        // url string
        Image.prefetch(avatar);
      }
    } catch (e) {
      // no crítico: si falla la precarga, seguimos (no hacemos nada)
      console.warn("Precarga avatar fallida", e);
    }

    nextRetoRef.current = texto;
    nextJugadorRef.current = jugadorRandom;
  };

  // Aplicar lo que hemos precargado (setear current desde nextRef)
  const aplicarSiguienteEnPantalla = () => {
    if (nextRetoRef.current === null || nextJugadorRef.current === null) {
      // si no hay next preparado, generar al vuelo (fallback)
      if (!jugadores?.length || !retos?.length) {
        setReto("");
        setJugadorActual(null);
        return;
      }
      const jugadorRandom = jugadores[Math.floor(Math.random() * jugadores.length)];
      const retoAleatorio = retos[Math.floor(Math.random() * retos.length)];
      setJugadorActual(jugadorRandom);
      setReto(retoAleatorio.includes("{player}") ? retoAleatorio.replace("{player}", jugadorRandom.nombre) : retoAleatorio);
      return;
    }

    // seteamos current exactamente con lo que precargamos
    setJugadorActual(nextJugadorRef.current);
    setReto(nextRetoRef.current);
    // limpiamos next (opcional)
    nextRetoRef.current = null;
    nextJugadorRef.current = null;
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

  const handleSwipe = async (cumplido: boolean) => {
    if (!jugadorActual) return;

    // 1) registrar resultado del reto actual
    registrarResultado(cumplido);

    // 2) si ya tenemos next preparado, aplicarlo YA (antes de la animación de entrada)
    if (nextRetoRef.current && nextJugadorRef.current) {
      aplicarSiguienteEnPantalla();
      // mientras mostramos la nueva carta, lanzamos la preparación del siguiente en background
      prepararSiguiente().catch(() => {});
    } else {
      // fallback: preparar y aplicar si no hay next preparado
      await prepararSiguiente();
      aplicarSiguienteEnPantalla();
      prepararSiguiente().catch(() => {});
    }

    // confeti
    if (cumplido) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }

    // 3) animación: salida rápida y entrada con rebote
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 130, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: cumplido ? -500 : 500, duration: 130, useNativeDriver: true }),
    ]).start(() => {
      // reset y entrada
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
    outputRange: ["#c4fd5bff", "#000000", "#FF4C61"],
    extrapolate: "clamp",
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/fuego-fondo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <Animated.View style={[styles.overlay, { backgroundColor }]}>
          <BotonVolver />

          <TouchableOpacity style={styles.terminarButton} onPress={terminarPartida}>
            <Text style={styles.terminarText}>✖</Text>
          </TouchableOpacity>

          <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onHandlerStateChange}>
            <Animated.View style={[styles.card, { transform: [{ translateX }, { rotate }], opacity }]}>
              <Text style={styles.title}>RETO ACTUAL</Text>

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
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF4C61",
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFD700",
    textShadowColor: "#FF4500",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 10,
  },
  jugadorNombre: { fontSize: 24, fontWeight: "bold", color: "#fff", marginVertical: 10, textAlign: "center" },
  reto: { fontSize: 22, color: "#fff", textAlign: "center", marginVertical: 15, textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  avatarJugador: { width: 300, height: 300, borderRadius: 15, marginBottom: 15, borderWidth: 3, borderColor: "#FFD700" },
  terminarButton: { position: "absolute", top: 80, right: 25, padding: 10, zIndex: 10 },
  terminarText: { color: "#FF4C61", fontSize: 34, fontWeight: "bold" },
});

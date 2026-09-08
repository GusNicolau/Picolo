import { FontAwesome5 } from "@expo/vector-icons";
import { Asset } from "expo-asset"; // <-- precarga imágenes
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import BotonVolver from "../src/components/BotonVolver";
import { Jugador, usePlayers } from "../src/context/PlayersContext";
import { obtenerRetos } from "../src/controllers/retosController";

const avatarPorDefecto = require("../assets/moustache/gustavo.png");

// Distancia mínima de arrastre para aceptar/rechazar el reto (evita que un
// gesto pequeño se confunda con un swipe intencionado)
const SWIPE_THRESHOLD = Dimensions.get("window").width * 0.4;

export default function JuegoScreen() {
  const router = useRouter();
  const { jugadores, modo } = usePlayers();
  const [reto, setReto] = useState<string>("");
  const [jugadorActual, setJugadorActual] = useState<Jugador | null>(null);
  const [resultados, setResultados] = useState<
    Record<string, { cumplidos: number; fallos: number }>
  >({});

  const retos = obtenerRetos(modo);
  const [translateX] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(1));
  // 🏆 Racha y animación cerveza
  const [racha, setRacha] = useState(0);
  const [shakeAnim] = useState(() => new Animated.Value(0));
  const [rachaMaxima, setRachaMaxima] = useState(0);
  // Racha individual: aciertos seguidos de cada jugador en sus propios turnos
  const [rachasIndividuales, setRachasIndividuales] = useState<
    Record<string, number>
  >({});
  const [shakeIndividualAnim] = useState(() => new Animated.Value(0));

  // Dispara un temblor de la jarra cuya intensidad crece con la racha
  // (hasta un máximo), compartido entre la racha global y la individual.
  const dispararShake = (animValue: Animated.Value, nivelRacha: number) => {
    const amplitud = Math.min(nivelRacha, 10);
    if (nivelRacha >= 5) {
      // A partir de 5 aciertos seguidos, tiembla en bucle continuo
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: amplitud,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: -amplitud,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 60,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: amplitud,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: -amplitud,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // refs para el siguiente reto/jugador (precarga)
  const nextRetoRef = useRef<string | null>(null);
  const nextJugadorRef = useRef<Jugador | null>(null);

  // Genera y precarga el siguiente reto/jugador en next*Ref
  const prepararSiguiente = async () => {
    if (!jugadores?.length || !retos?.length) {
      nextRetoRef.current = "";
      nextJugadorRef.current = null;
      return;
    }

    const jugadorRandom =
      jugadores[Math.floor(Math.random() * jugadores.length)];
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
      const jugadorRandom =
        jugadores[Math.floor(Math.random() * jugadores.length)];
      const retoAleatorio = retos[Math.floor(Math.random() * retos.length)];
      setJugadorActual(jugadorRandom);
      setReto(
        retoAleatorio.includes("{player}")
          ? retoAleatorio.replace("{player}", jugadorRandom.nombre)
          : retoAleatorio,
      );
      return;
    }

    // seteamos current exactamente con lo que precargamos
    setJugadorActual(nextJugadorRef.current);
    setReto(nextRetoRef.current);
    // limpiamos next (opcional)
    nextRetoRef.current = null;
    nextJugadorRef.current = null;
  };

  useEffect(() => {
    // Preparar primero y luego poner en pantalla — evita parpadeos
    (async () => {
      await prepararSiguiente(); // precarga next
      aplicarSiguienteEnPantalla(); // setear current = next
      prepararSiguiente(); // empezar a preparar el siguiente de nuevo
    })();
  }, []);

  useEffect(() => {
    // Cada vez que entra un jugador nuevo, la jarra de su racha personal
    // tiembla según lo alta que la traiga
    shakeIndividualAnim.stopAnimation();
    shakeIndividualAnim.setValue(0);
    if (jugadorActual) {
      const nivel = rachasIndividuales[jugadorActual.nombre] || 0;
      if (nivel > 0) dispararShake(shakeIndividualAnim, nivel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jugadorActual]);

  const registrarResultado = (cumplido: boolean) => {
    if (!jugadorActual) return;

    setResultados((prev) => {
      const prevData = prev[jugadorActual.nombre] || {
        cumplidos: 0,
        fallos: 0,
      };
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

    // Racha individual del jugador actual (solo cuenta en sus propios turnos)
    setRachasIndividuales((prev) => ({
      ...prev,
      [jugadorActual.nombre]: cumplido
        ? (prev[jugadorActual.nombre] || 0) + 1
        : 0,
    }));

    // Actualizar racha + animación cerveza progresiva
    if (cumplido) {
      setRacha((prev) => {
        const nuevaRacha = prev + 1;
        if (nuevaRacha > rachaMaxima) setRachaMaxima(nuevaRacha);
        dispararShake(shakeAnim, nuevaRacha);
        return nuevaRacha;
      });
    } else {
      // Reinicia racha y detiene animación
      setRacha(0);
      shakeAnim.stopAnimation();
      shakeAnim.setValue(0);
    }

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

    // 3) animación: salida rápida y entrada con rebote
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: cumplido ? -500 : 500,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Entrada de la nueva tarjeta: volvemos translateX a 0 de forma animada
      // (en vez de un salto instantáneo) para que el fondo, que depende de
      // translateX, se funda progresivamente de verde/rojo hacia negro.
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 60,
        }),
      ]).start();
    });
  };

  const vibrarTarjeta = () => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: 18,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -18,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 12,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -12,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    // Solo procesar cuando el gesto realmente termina
    if (nativeEvent.state === 5) {
      // 5 = State.END
      if (nativeEvent.translationX > SWIPE_THRESHOLD) {
        handleSwipe(false);
      } else if (nativeEvent.translationX < -SWIPE_THRESHOLD) {
        handleSwipe(true);
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 5,
          tension: 60,
        }).start();
      }
    }
  };

  const terminarPartida = () => {
    router.push({
      pathname: "/resultados",
      params: {
        resultados: JSON.stringify(resultados),
        rachaMaxima: String(rachaMaxima), // 👉 añadimos la racha máxima
      },
    });
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

  const shake = shakeAnim.interpolate({
    inputRange: [-10, 10],
    outputRange: ["-15deg", "15deg"], // antes era [-1,1], así damos más rango
    extrapolate: "clamp",
  });

  const shakeIndividual = shakeIndividualAnim.interpolate({
    inputRange: [-10, 10],
    outputRange: ["-15deg", "15deg"],
    extrapolate: "clamp",
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/fuego-fondo.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* 🍺 Icono de racha arriba a la izquierda */}
        <View style={styles.rachaContainer}>
          <Animated.View style={{ transform: [{ rotate: shake }] }}>
            <FontAwesome5 name="beer" size={36} color="#ff0000ff" />
            <FontAwesome5
              name="beer"
              size={36}
              color="#f6ff00"
              top="-40"
              left="-2"
            />
          </Animated.View>
          <Text style={styles.rachaText}>✖{racha}</Text>
        </View>

        {/* 🔥 Fondo animado y contenido principal */}
        <Animated.View style={[styles.overlay, { backgroundColor }]}>
          <BotonVolver />

          <TouchableOpacity
            style={styles.terminarButton}
            onPress={terminarPartida}
          >
            <Text style={styles.terminarText}>✕</Text>
          </TouchableOpacity>

          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onEnded={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.card,
                { transform: [{ translateX }, { rotate }], opacity },
              ]}
            >
              <TouchableWithoutFeedback onPress={vibrarTarjeta}>
                <View>
                  <Text style={styles.title}>RETO ACTUAL</Text>

                  {jugadorActual && (
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={jugadorActual.avatar || avatarPorDefecto}
                        style={styles.avatarJugador}
                      />
                      <View style={styles.nombreConRachaRow}>
                        <Text style={styles.jugadorNombre}>
                          {jugadorActual.nombre}
                        </Text>
                        {!!rachasIndividuales[jugadorActual.nombre] && (
                          <View style={styles.rachaIndividualBadge}>
                            <Animated.View
                              style={{ transform: [{ rotate: shakeIndividual }] }}
                            >
                              <FontAwesome5
                                name="beer"
                                size={14}
                                color="#1C1408"
                              />
                            </Animated.View>
                            <Text style={styles.rachaIndividualText}>
                              {" "}
                              ✖{rachasIndividuales[jugadorActual.nombre]}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  <Text style={styles.reto}>{reto || ""}</Text>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

// Paleta reducida y plana: un único acento (ámbar) sobre fondo oscuro neutro
const COLORS = {
  card: "rgba(28, 28, 36, 0.92)",
  cardBorder: "rgba(255,255,255,0.1)",
  accent: "#f6ff00",
  text: "#F5F5F7",
  danger: "#E5484D",
  dangerSoft: "rgba(229,72,77,0.15)",
};

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
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  jugadorNombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  nombreConRachaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  rachaIndividualBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rachaIndividualText: {
    color: "#1C1408",
    fontSize: 14,
    fontWeight: "900",
  },
  reto: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
    marginVertical: 15,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  avatarJugador: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  terminarButton: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  terminarText: { color: COLORS.danger, fontSize: 20, fontWeight: "700" },
  beerIcon: {
    width: 50,
    height: 50,
  },
  rachaContainer: {
    position: "absolute",
    top: 100,
    left: 35,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  rachaText: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 8,
    top: -15,
  },
});

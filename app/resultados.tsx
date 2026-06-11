import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { usePlayers } from "../src/context/PlayersContext";

const avatarPorDefecto = require("../assets/moustache/gustavo.webp");

type StatsJugador = { cumplidos: number; fallos: number };

export default function ResultadosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jugadores } = usePlayers();
  const resultadosObj: Record<string, StatsJugador> = params.resultados
    ? JSON.parse(params.resultados as string)
    : {};
  const { rachaMaxima } = useLocalSearchParams();

  // Recuperamos el avatar real de cada jugador desde el contexto (los
  // resultados solo guardan nombre + estadísticas, no la imagen).
  const avatarPorNombre: Record<string, any> = {};
  jugadores.forEach((j) => {
    avatarPorNombre[j.nombre] = j.avatar;
  });

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
        <Text style={styles.title}>Resultados finales</Text>
        <Text style={styles.rachaText}>
          🔥 Racha más alta: <Text style={styles.rachaValue}>{rachaMaxima}</Text>
        </Text>
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
                source={avatarPorNombre[nombre] || avatarPorDefecto}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">
                  {index + 1}. {nombre}
                </Text>

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

// Paleta reducida y plana: un único acento (ámbar) sobre fondo oscuro neutro
const COLORS = {
  overlay: "rgba(10, 10, 13, 0.92)",
  card: "#1C1C24",
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#F2A93B",
  accentOn: "#1C1408", // texto oscuro sobre botones de acento
  text: "#F5F5F7",
  textMuted: "#9A9AA5",
  gold: "#D4AF37",
  silver: "#B8BEC7",
  bronze: "#C08A52",
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.3,
    marginTop: 100,
    marginBottom: 24,
    textAlign: "center",
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginBottom: 10,
    padding: 14,
    borderRadius: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  primerLugar: {
    borderColor: COLORS.gold,
    borderWidth: 1.5,
  },
  segundoLugar: {
    borderColor: COLORS.silver,
    borderWidth: 1.5,
  },
  tercerLugar: {
    borderColor: COLORS.bronze,
    borderWidth: 1.5,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "rgba(242,169,59,0.35)",
  },
  playerName: {
    fontSize: 19,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 4,
  },
  stats: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 60,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.accentOn,
    letterSpacing: 0.5,
  },
  rachaText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  rachaValue: {
    color: COLORS.accent,
    fontWeight: "700",
  },
});

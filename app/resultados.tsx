import { FontAwesome5 } from "@expo/vector-icons";
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

const medalla: Record<number, { icon: "crown" | "medal"; color: string }> = {
  0: { icon: "crown", color: "#D4AF37" },
  1: { icon: "medal", color: "#B8BEC7" },
  2: { icon: "medal", color: "#C08A52" },
};

const avatarPorDefecto = require("../assets/avatares/rana.webp");

type StatsJugador = { cumplidos: number; fallos: number };

export default function ResultadosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jugadores } = usePlayers();
  const resultadosObj: Record<string, StatsJugador> = params.resultados
    ? JSON.parse(params.resultados as string)
    : {};
  const { rachaMaxima } = useLocalSearchParams();
  const rachasMaximasIndividuales: Record<string, number> =
    params.rachasMaximasIndividuales
      ? JSON.parse(params.rachasMaximasIndividuales as string)
      : {};

  // Recuperamos el avatar real de cada jugador desde el contexto (los
  // resultados solo guardan nombre + estadísticas, no la imagen).
  const avatarPorNombre: Record<string, any> = {};
  jugadores.forEach((j) => {
    avatarPorNombre[j.nombre] = j.avatar;
  });

  const jugadoresOrdenados = Object.entries(resultadosObj).sort(
    ([, statsA], [, statsB]) => statsB.cumplidos - statsA.cumplidos
  );

  const volverAlInicio = () => {
    // dismissTo (en vez de replace) también descarta jugadores y juego del
    // stack nativo, que si no se quedan apilados sin límite en cada partida
    router.dismissTo("/");
  };

  return (
    <ImageBackground
      source={require("../assets/images/fuego-fondo.jpg")} // 🔥 fondo de fuego
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Resultados finales</Text>
        <View style={styles.rachaGlobalRow}>
          <FontAwesome5 name="fire" size={18} color={COLORS.accent} />
          <Text style={styles.rachaText}>
            Racha más alta: <Text style={styles.rachaValue}>{rachaMaxima}</Text>
          </Text>
        </View>
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
              <View style={styles.playerTopRow}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={avatarPorNombre[nombre] || avatarPorDefecto}
                    style={styles.avatar}
                  />
                  {medalla[index] && (
                    <View
                      style={[
                        styles.medallaBadge,
                        { backgroundColor: medalla[index].color },
                      ]}
                    >
                      <FontAwesome5
                        name={medalla[index].icon}
                        size={12}
                        color={COLORS.accentOn}
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">
                  {index + 1}. {nombre}
                </Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBadge}>
                  <FontAwesome5 name="beer" size={13} color={COLORS.accent} />
                  <Text style={styles.statValue}>{stats.cumplidos}</Text>
                </View>
                <View style={styles.statBadge}>
                  <FontAwesome5 name="times-circle" size={13} color={COLORS.danger} />
                  <Text style={styles.statValue}>{stats.fallos}</Text>
                </View>
                <View style={styles.statBadge}>
                  <FontAwesome5 name="fire" size={13} color={COLORS.accent} />
                  <Text style={styles.statValue}>
                    {rachasMaximasIndividuales[nombre] || 0}
                  </Text>
                </View>
              </View>
            </View>
          )}
          style={{ width: "100%", marginBottom: 30 }}
        />

        <TouchableOpacity style={styles.button} onPress={volverAlInicio}>
          <Text style={styles.buttonText}>Volver al inicio</Text>
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
  danger: "#E5484D",
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
    backgroundColor: COLORS.card,
    marginBottom: 10,
    padding: 14,
    borderRadius: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  playerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  avatarWrapper: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "rgba(242,169,59,0.35)",
  },
  medallaBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  playerName: {
    flex: 1,
    fontSize: 19,
    color: COLORS.text,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 8,
    paddingVertical: 8,
    gap: 5,
  },
  statValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "700",
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
  rachaGlobalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  rachaText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  rachaValue: {
    color: COLORS.accent,
    fontWeight: "700",
  },
});

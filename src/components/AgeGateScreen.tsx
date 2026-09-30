import { useState } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onConfirm: () => void;
};

export default function AgeGateScreen({ onConfirm }: Props) {
  const [rechazado, setRechazado] = useState(false);

  const handleDecline = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
      return;
    }
    // iOS no permite cerrar la app mediante código (política de Apple).
    setRechazado(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.icon}>🔞</Text>
        <Text style={styles.title}>Antes de empezar</Text>
        <Text style={styles.text}>
          Picolo es un juego para beber entre adultos, y su modo Caliente
          incluye contenido sexual explícito. Para continuar debes ser mayor
          de edad legal en tu país.
        </Text>
        <Text style={styles.textSecondary}>
          Bebe siempre con responsabilidad.
        </Text>

        {rechazado ? (
          <Text style={styles.declinedText}>
            Debes cerrar la aplicación para continuar.
          </Text>
        ) : (
          <>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmBtnText}>Soy mayor de edad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineBtn} onPress={handleDecline}>
              <Text style={styles.declineBtnText}>No soy mayor de edad</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const COLORS = {
  card: "#1C1C24",
  cardBorder: "rgba(255,255,255,0.08)",
  accent: "#F2A93B",
  accentOn: "#1C1408",
  text: "#F5F5F7",
  textMuted: "#9A9AA5",
  danger: "#E5484D",
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(10,10,13,0.96)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    zIndex: 2000,
  },
  panel: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.accent,
    padding: 28,
    alignItems: "center",
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
    textAlign: "center",
  },
  text: {
    color: COLORS.text,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 10,
  },
  textSecondary: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 22,
  },
  confirmBtn: {
    width: "100%",
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmBtnText: {
    color: COLORS.accentOn,
    fontSize: 16,
    fontWeight: "900",
  },
  declineBtn: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  declineBtnText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  declinedText: {
    color: COLORS.danger,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "700",
  },
});

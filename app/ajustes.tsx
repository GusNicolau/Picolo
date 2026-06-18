import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSettings } from "../src/context/SettingsContext";

export default function AjustesScreen() {
  const { soundEnabled, setSoundEnabled, moustacheUnlocked, canjearCodigo } = useSettings();
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState<{ texto: string; ok: boolean } | null>(null);

  const enviarCodigo = () => {
    const trimmed = codigo.trim();
    if (!trimmed) return;

    const ok = canjearCodigo(trimmed);
    setMensaje(
      ok
        ? { texto: "✅ Avatares de Moustache desbloqueados", ok: true }
        : { texto: "❌ Código incorrecto", ok: false }
    );
    setCodigo("");
  };

  return (
    <ImageBackground
      source={require("../assets/images/fuego-fondo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Ajustes</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sonido</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#3A3A42", true: COLORS.accentSoft }}
              thumbColor={soundEnabled ? COLORS.accent : "#9A9AA5"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Códigos</Text>

          {moustacheUnlocked ? (
            <Text style={styles.unlockedText}>🔓 Avatares de Moustache desbloqueados</Text>
          ) : (
            <>
              <View style={styles.codeRow}>
                <TextInput
                  style={styles.codeInput}
                  placeholder="Introduce un código"
                  placeholderTextColor="#9A9AA5"
                  value={codigo}
                  onChangeText={setCodigo}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={enviarCodigo}
                />
                <TouchableOpacity style={styles.codeButton} onPress={enviarCodigo}>
                  <Text style={styles.codeButtonText}>Canjear</Text>
                </TouchableOpacity>
              </View>
              {mensaje && (
                <Text
                  style={[
                    styles.mensaje,
                    { color: mensaje.ok ? COLORS.accent : COLORS.danger },
                  ]}
                >
                  {mensaje.texto}
                </Text>
              )}
            </>
          )}
        </View>
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
  accentSoft: "rgba(242,169,59,0.35)",
  accentOn: "#1C1408",
  text: "#F5F5F7",
  textMuted: "#9A9AA5",
  danger: "#E5484D",
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    color: COLORS.text,
    fontWeight: "700",
    marginTop: 60,
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  section: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  codeInput: {
    flex: 1,
    backgroundColor: "#141419",
    color: COLORS.text,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    fontSize: 15,
  },
  codeButton: {
    backgroundColor: COLORS.accent,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  codeButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.accentOn,
  },
  mensaje: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  unlockedText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.accent,
    textAlign: "center",
  },
});

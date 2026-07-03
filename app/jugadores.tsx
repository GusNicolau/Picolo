import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useSettings } from "../src/context/SettingsContext";






import { Genero, Jugador, usePlayers } from "../src/context/PlayersContext";

const generoOpciones: {
  key: Genero;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  colorSeleccionado: string;
  iconColorSeleccionado: string;
}[] = [
  { key: "hombre", icon: "gender-male", colorSeleccionado: "#3E7BFA", iconColorSeleccionado: "#FFFFFF" },
  { key: "mujer", icon: "gender-female", colorSeleccionado: "#F2578F", iconColorSeleccionado: "#FFFFFF" },
  { key: "inter", icon: "gender-non-binary", colorSeleccionado: "#F2A93B", iconColorSeleccionado: "#1C1408" },
];

// Mapa de avatares de amigos predefinidos (requiere el código "moustache" para desbloquearse)
const avataresAmigos: Record<string, any> = {
  Sherco: require("../assets/moustache/gustavo.webp"),
  Carlota: require("../assets/moustache/carlos.webp"),
  Toffe: require("../assets/moustache/andreu.webp"),
  Mariojt72: require("../assets/moustache/mario.webp"),
  Calent: require("../assets/moustache/dani.webp"),
  Amerla: require("../assets/moustache/ale.webp"),
  Cigrona: require("../assets/moustache/lara.webp"),
  Pantorrilla: require("../assets/moustache/pantorrilla.webp"),
  Princesa: require("../assets/moustache/princesa.webp"),
};

// Pool de avatares disponibles por defecto (animales, sin desbloquear nada)
const avataresAnimales: any[] = [
  require("../assets/avatares/rana.webp"),
  require("../assets/avatares/caballo.webp"),
  require("../assets/avatares/oveja.webp"),
  require("../assets/avatares/perro.webp"),
  require("../assets/avatares/gata.webp"),
];

export default function JugadoresScreen() {
  const [nombre, setNombre] = useState("");
  const { jugadores, addJugador, editJugador, setJugadores } = usePlayers();
  const { moustacheUnlocked } = useSettings();
  const router = useRouter();

  // Edición de nombre in-line
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  // Edición de avatar mediante modal
  const [editingAvatar, setEditingAvatar] = useState<string | null>(null);

  // Los avatares de amigos solo entran al pool si el código "moustache" se ha canjeado
  const AVATARES = useMemo(
    () =>
      moustacheUnlocked
        ? [...avataresAnimales, ...Object.values(avataresAmigos)]
        : avataresAnimales,
    [moustacheUnlocked]
  );

  const elegirAvatarAleatorio = () => {
    const usados = jugadores.map((j) => j.avatar);
    const disponibles = AVATARES.filter((a) => !usados.includes(a));
    const pool = disponibles.length > 0 ? disponibles : AVATARES;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const añadirJugador = () => {
    const trimmed = nombre.trim();
    if (!trimmed) return;

    if (jugadores.some((j) => j.nombre.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert("Nombre repetido", "Ya existe un jugador con ese nombre.");
      return;
    }

    const avatarAmigo = moustacheUnlocked ? avataresAmigos[trimmed] : undefined;
    const avataresUsados = jugadores.map((j) => j.avatar);
    const avatarAmigoDisponible = avatarAmigo && !avataresUsados.includes(avatarAmigo);
    const nuevoJugador: Jugador = {
      nombre: trimmed,
      avatar: avatarAmigoDisponible ? avatarAmigo : elegirAvatarAleatorio(),
      avatarName: avatarAmigoDisponible ? trimmed : undefined,
      genero: "inter",
    };
    addJugador(nuevoJugador);
    setNombre("");
  };

  const eliminarJugador = (nombre: string) => {
    setJugadores(jugadores.filter((j) => j.nombre !== nombre));
  };

  const empezarEdicionNombre = (nombreActual: string) => {
    setEditingName(nombreActual);
    setEditingValue(nombreActual);
  };

  const confirmarEdicionNombre = (nombreActual: string) => {
    const trimmed = editingValue.trim();
    if (!trimmed || trimmed === nombreActual) {
      setEditingName(null);
      return;
    }
    if (jugadores.some((j) => j.nombre.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert("Nombre repetido", "Ya existe un jugador con ese nombre.");
      return;
    }
    editJugador(nombreActual, { nombre: trimmed });
    setEditingName(null);
  };

  const seleccionarGenero = (nombreJugador: string, genero: Genero) => {
    editJugador(nombreJugador, { genero });
  };

  const confirmarCambioAvatar = (nombreJugador: string, nuevoAvatar: any) => {
    const enUsoPorOtro = jugadores.some(
      (j) => j.nombre !== nombreJugador && j.avatar === nuevoAvatar
    );
    if (enUsoPorOtro) return;
    editJugador(nombreJugador, { avatar: nuevoAvatar, avatarName: undefined });
    setEditingAvatar(null);
  };

  const empezarJuego = () => {
    router.push("/juego");
  };

  return (
    <ImageBackground
      source={require("../assets/images/fuego-fondo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/ajustes")}
        >
          <Ionicons name="settings-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Añadir jugadores</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un nombre"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
            onSubmitEditing={añadirJugador}
          />
          <TouchableOpacity style={styles.addButtonSmall} onPress={añadirJugador}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.moustacheButton}
          onPress={() => router.push("/avatares")}
        >
          <Text style={styles.moustacheButtonText}>Avatares</Text>
        </TouchableOpacity>


        <FlatList
          data={jugadores}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.playerContainer}>
              <View style={styles.playerTopRow}>
                <TouchableOpacity onPress={() => setEditingAvatar(item.nombre)}>
                  <Image source={item.avatar || avataresAnimales[0]} style={styles.avatar} />
                  <View style={styles.avatarEditBadge}>
                    <Text style={styles.avatarEditBadgeText}>✏️</Text>
                  </View>
                </TouchableOpacity>

                {editingName === item.nombre ? (
                  <TextInput
                    style={styles.playerNameInput}
                    value={editingValue}
                    onChangeText={setEditingValue}
                    onBlur={() => confirmarEdicionNombre(item.nombre)}
                    onSubmitEditing={() => confirmarEdicionNombre(item.nombre)}
                    autoFocus
                    maxLength={20}
                    selectTextOnFocus
                    textAlign="center"
                  />
                ) : (
                  <TouchableOpacity style={styles.nameWrapper} onPress={() => empezarEdicionNombre(item.nombre)}>
                    <Text style={styles.player} numberOfLines={1} ellipsizeMode="tail">
                      {item.nombre}
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.generoRow}>
                  {generoOpciones.map((opcion) => {
                    const isSelected = (item.genero ?? "inter") === opcion.key;
                    return (
                      <TouchableOpacity
                        key={opcion.key}
                        style={[
                          styles.generoButton,
                          isSelected && {
                            backgroundColor: opcion.colorSeleccionado,
                            borderColor: opcion.colorSeleccionado,
                          },
                        ]}
                        onPress={() => seleccionarGenero(item.nombre, opcion.key)}
                      >
                        <MaterialCommunityIcons
                          name={opcion.icon}
                          size={16}
                          color={isSelected ? opcion.iconColorSeleccionado : COLORS.textMuted}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarJugador(item.nombre)}>
                  <Text style={styles.delete}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {jugadores.length > 0 && (
          <TouchableOpacity style={styles.startButton} onPress={empezarJuego}>
            <Text style={styles.startButtonText}>▶ Empezar juego</Text>
          </TouchableOpacity>
        )}

        {editingAvatar && (
          <View style={styles.avatarModalOverlay}>
            <View style={styles.avatarModal}>
              <Text style={styles.avatarModalTitle}>Cambiar avatar</Text>
              <Text style={styles.avatarModalSubtitle}>{editingAvatar}</Text>
              <FlatList
                data={AVATARES}
                keyExtractor={(_, i) => String(i)}
                numColumns={4}
                contentContainerStyle={styles.avatarGrid}
                renderItem={({ item }) => {
                  const jugadorActual = jugadores.find((j) => j.nombre === editingAvatar);
                  const isSelected = jugadorActual?.avatar === item;
                  const enUsoPorOtro = jugadores.some(
                    (j) => j.nombre !== editingAvatar && j.avatar === item
                  );
                  return (
                    <TouchableOpacity
                      onPress={() => confirmarCambioAvatar(editingAvatar, item)}
                      disabled={enUsoPorOtro}
                      style={[
                        styles.avatarOption,
                        isSelected && styles.avatarOptionSelected,
                        enUsoPorOtro && styles.avatarOptionDisabled,
                      ]}
                    >
                      <Image source={item} style={styles.avatarOptionImage} />
                      {isSelected && (
                        <View style={styles.avatarOptionCheck}>
                          <Text style={styles.avatarOptionCheckText}>✓</Text>
                        </View>
                      )}
                      {enUsoPorOtro && (
                        <View style={styles.avatarOptionLockOverlay}>
                          <Text style={styles.avatarOptionLockText}>🔒</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity style={styles.avatarModalClose} onPress={() => setEditingAvatar(null)}>
                <Text style={styles.avatarModalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  accentOn: "#1C1408", // texto oscuro sobre botones de acento
  text: "#F5F5F7",
  textMuted: "#9A9AA5",
  danger: "#E5484D",
  dangerSoft: "rgba(229,72,77,0.12)",
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
  settingsButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: COLORS.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    color: COLORS.text,
    fontWeight: "700",
    marginTop: 60,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    fontSize: 16,
  },
  addButtonSmall: {
    backgroundColor: COLORS.accent,
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.accentOn,
  },
  // Botón secundario (outline): mismo acento, sin relleno
  moustacheButton: {
    marginTop: 4,
    marginBottom: 15,
    backgroundColor: "transparent",
    borderColor: COLORS.accentSoft,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  moustacheButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.accent,
  },
  list: {
    marginTop: 4,
    width: "100%",
  },
  playerContainer: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  playerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  generoRow: {
    flexDirection: "row",
    gap: 6,
    marginHorizontal: 8,
  },
  generoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  generoButtonSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  nameWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  player: {
    fontSize: 20,
    textAlign: "center",
    color: COLORS.text,
    fontWeight: "600",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.accentSoft,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.accentSoft,
  },
  avatarEditBadgeText: {
    fontSize: 10,
  },
  playerNameInput: {
    flex: 1,
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
    paddingVertical: 2,
    marginHorizontal: 10,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.dangerSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  delete: {
    fontSize: 15,
    color: COLORS.danger,
    fontWeight: "700",
  },
  avatarModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  avatarModal: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    width: "90%",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    maxHeight: "70%",
  },
  avatarModalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  avatarModalSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  avatarGrid: {
    alignItems: "center",
    paddingBottom: 10,
  },
  avatarOption: {
    margin: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: "visible",
    position: "relative",
  },
  avatarOptionSelected: {
    borderColor: COLORS.accent,
  },
  avatarOptionDisabled: {
    opacity: 0.35,
  },
  avatarOptionImage: {
    width: 54,
    height: 54,
    borderRadius: 8,
  },
  avatarOptionLockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOptionLockText: {
    fontSize: 18,
  },
  avatarOptionCheck: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOptionCheckText: {
    color: COLORS.accentOn,
    fontSize: 11,
    fontWeight: "900",
  },
  avatarModalClose: {
    marginTop: 16,
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  avatarModalCloseText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  startButton: {
    marginTop: 20,
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 60,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.accentOn,
    letterSpacing: 0.5,
  },
});

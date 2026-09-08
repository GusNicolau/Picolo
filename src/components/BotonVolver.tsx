import { useNavigation, useRouter, useSegments } from "expo-router";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function BotonVolver() {
  const router = useRouter();
  const segments = useSegments();
  const navigation = useNavigation();

  const handleBack = () => {
    try {
      // @ts-ignore
      if (navigation?.canGoBack && navigation.canGoBack()) {
        // @ts-ignore
        navigation.goBack();
        return;
      }
    } catch (e) {}

    if (segments.length > 1) {
      router.back();
      return;
    }

    const current = segments[segments.length - 1];
    if (current === "moustache") {
      router.replace("/jugadores");
    } else if (current === "juego" || current === "resultados") {
      router.replace("/jugadores");
    } else {
      router.push("/");
    }
  };

  // ✅ Detectar si estamos en la raíz (index)
  // @ts-ignore – ignoramos el tipo porque "index" no está declarado en los tipos de expo-router
  const currentSegment = segments[segments.length - 1];
  const isIndexScreen =
    !currentSegment ||
    // @ts-ignore – "index" no forma parte de la unión de segmentos tipados
    currentSegment === "index" ||
    // @ts-ignore – la tupla de segmentos se tipa con longitud fija (siempre 1)
    segments.length === 0 ||
    currentSegment === "juego" ||
    currentSegment === "resultados";

  if (isIndexScreen) {
    return null;
  }

  // En Jugadores y Moustache el botón se ve más pequeño que en el resto
  const esPantallaCompacta =
    currentSegment === "jugadores" || currentSegment === "moustache";
  const size = esPantallaCompacta ? 30 : 50;

  return (
    <TouchableOpacity style={styles.container} onPress={handleBack}>
      <Image
        source={require("../../assets/images/Flecha-Back.png")}
        style={[styles.icon, { width: size, height: size }]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 75,
    left: 15,
    zIndex: 999,
    padding: 10,
  },
  icon: {
    resizeMode: "contain",
    tintColor: "#FFFFFF", // 🤍 fuerza el color blanco
  },
});

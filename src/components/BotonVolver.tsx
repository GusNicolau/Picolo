import { useNavigation } from "@react-navigation/native";
import { useRouter, useSegments } from "expo-router";
import React from "react";
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
  // @ts-ignore – permitimos comparar con "index" aunque TS no lo reconozca
  const isIndexScreen = !currentSegment || currentSegment === "index" || segments.length === 0;

  if (isIndexScreen) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleBack}>
      <Image
        source={require("../../assets/images/Flecha-Back.png")}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: 0,
    zIndex: 999,
    padding: 10,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});

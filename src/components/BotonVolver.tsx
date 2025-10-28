import { useNavigation } from "@react-navigation/native";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function BotonVolver() {
  const router = useRouter();
  const segments = useSegments();
  const navigation = useNavigation();

  const handleBack = () => {
    const current = segments[segments.length - 1];

    // Pantallas que siempre deben volver a jugadores
    if (["moustache", "juego", "resultados"].includes(current)) {
      router.push("/jugadores");
      return;
    }

    // Si react-navigation puede retroceder, usarlo
    try {
      // @ts-ignore
      if (navigation?.canGoBack && navigation.canGoBack()) {
        // @ts-ignore
        navigation.goBack();
        return;
      }
    } catch (e) {}

    // Fallback a expo-router segments/router.back()
    if (segments.length > 1) {
      router.back();
      return;
    }

    // Último recurso: volver a index
    router.push("/");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleBack}>
      <Image source={require("../../assets/images/Flecha-Back.png")} style={styles.icon} />
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

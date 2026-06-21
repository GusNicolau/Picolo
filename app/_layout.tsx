import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { BackHandler, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/hooks/use-color-scheme";
import BotonVolver from "@/src/components/BotonVolver";
import { PlayersProvider } from "@/src/context/PlayersContext";
import { SettingsProvider } from "@/src/context/SettingsContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // La app siempre usa tema oscuro: forzamos el fondo nativo de la ventana raíz
  // para que no aparezca un flash blanco al navegar entre pantallas.
  React.useEffect(() => {
    SystemUI.setBackgroundColorAsync("#0A0A0D");
  }, []);

  // Bloquear botón físico en Android
  React.useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

  return (
    <SettingsProvider>
      <PlayersProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "none", // quitamos animaciones de stack
                gestureEnabled: false,
                contentStyle: {
                  // La app siempre usa tema oscuro, así que el fondo de transición
                  // entre pantallas debe ser oscuro (si no, se ve un flash blanco).
                  backgroundColor: "#0A0A0D",
                },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="jugadores" />
              <Stack.Screen name="juego" />
              <Stack.Screen name="avatares" />
              <Stack.Screen name="resultados" />
              <Stack.Screen name="ajustes" />
            </Stack>

            <BotonVolver />
            <StatusBar style="light" />
          </ThemeProvider>
        </GestureHandlerRootView>
      </PlayersProvider>
    </SettingsProvider>
  );
}

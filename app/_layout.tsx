import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { BackHandler, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/hooks/use-color-scheme";
import BotonVolver from "@/src/components/BotonVolver";
import { PlayersProvider } from "@/src/context/PlayersContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Bloquear botón físico en Android
  React.useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

  return (
    <PlayersProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none", // quitamos animaciones de stack
              gestureEnabled: false,
              contentStyle: {
                backgroundColor: colorScheme === "dark" ? "#0F3460" : "#FFFFFF",
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="jugadores" />
            <Stack.Screen name="juego" />
            <Stack.Screen name="moustache" />
            <Stack.Screen name="resultados" />
          </Stack>

          <BotonVolver />
          <StatusBar style="light" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </PlayersProvider>
  );
}

import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { PlayersProvider, usePlayers } from "../src/context/PlayersContext";

function AnimatedStack() {
  const { navDirection } = usePlayers();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Animación según la dirección
        animation: navDirection === "forward" ? "slide_from_right" : "slide_from_left",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="jugadores" />
      <Stack.Screen name="juego" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PlayersProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedStack />
        <StatusBar style="light" />
      </ThemeProvider>
    </PlayersProvider>
  );
}

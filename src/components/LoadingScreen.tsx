import { useEffect, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

const GUS = require("../../assets/images/Gus.png");

type Props = {
  onFinish?: () => void;
};

export default function LoadingScreen({ onFinish }: Props) {
  const { width } = useWindowDimensions();
  const size = Math.min(220, width * 0.55);
  const progress = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start(() => {
      onFinish?.();
    });
  }, [progress, onFinish]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Image
        source={GUS}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
      />
      <View style={[styles.barTrack, { width: size }]}>
        <Animated.View style={[styles.barFill, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  image: {
    marginBottom: 36,
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(42,28,20,0.15)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#d4a04c",
  },
});

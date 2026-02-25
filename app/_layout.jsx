import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible while we check auth

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (e) {
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      checkAuth();
    }, 2000); // simulate loading delay
  }, []);

  return (
    <KeyboardProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 150,
          contentStyle: { backgroundColor: "#09090b" },
        }}
      />

      {/* Splash overlay — sits on top until auth is resolved */}
      {loading && (
        <View style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#09090b",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <MaterialCommunityIcons name="motorbike" size={36} color="#fbbf24" />
          <Text style={{ color: "#3f3f46", fontSize: 12, letterSpacing: 4, marginTop: 16, textTransform: "uppercase" }}>
            Loading...
          </Text>
        </View>
      )}
    </KeyboardProvider>
  );
}
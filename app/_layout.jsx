import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import LoderWithImage from "../components/mycomponents/LoaderWithImage";

SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible while we check auth

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
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
        SplashScreen.hideAsync();
      }
    };
    checkAuth();
  }, []);

  return (
    <KeyboardProvider>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#09090b" },
        }}
      />

      {/* Splash overlay — sits on top until auth is resolved */}
      {loading && (
        <LoderWithImage />
      )}
    </KeyboardProvider>
  );
}
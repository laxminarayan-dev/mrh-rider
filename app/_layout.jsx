import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import LoderWithImage from "../components/mycomponents/LoaderWithImage";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

SplashScreen.preventAutoHideAsync();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }}>
      <KeyboardProvider>
        <StatusBar barStyle="light-content" backgroundColor="#09090b" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: { backgroundColor: "#09090b" },
          }}
        />

        {loading && <LoderWithImage />}
      </KeyboardProvider>
    </SafeAreaView>
  );
}
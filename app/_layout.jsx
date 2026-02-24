import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

// KeyboardProvider is REQUIRED for useKeyboardHandler to receive native callbacks
export default function RootLayout() {
  return (
    <KeyboardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </KeyboardProvider>
  );
}
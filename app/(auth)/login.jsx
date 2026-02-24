import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleLogin = async () => {
    if (email === "lucky@mrhalwai.in" && password === "password") {
      await AsyncStorage.setItem("userToken", email + password);
      setRedirectToHome(true); // trigger redirect via state
    } else {
      setError("Invalid email or password");
    }
  };

  // In your JSX, before the return:
  if (redirectToHome) return <Redirect href="/(tabs)" />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Background circles for depth */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {error && (
        <View className="absolute inset-0 z-50 bg-white/30 items-center justify-center px-6">
          {/* Card */}
          <View className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-xl">
            {/* Title */}
            <Text className="text-white text-lg font-semibold mb-1">
              Something went wrong
            </Text>

            {/* Message */}
            <Text className="text-red-500 text-md mb-5 leading-5">{error}</Text>

            {/* Button */}
            <Pressable
              onPress={() => setError(null)}
              className="self-end bg-indigo-500 px-4 py-2 rounded-lg active:bg-indigo-600"
            >
              <Text className="text-white font-medium text-sm">Dismiss</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🚀</Text>
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "email" && styles.inputFocused,
              ]}
              placeholder="you@example.com"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                focusedField === "password" && styles.inputFocused,
              ]}
              placeholder="••••••••"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* <Pressable style={styles.button} onPress={() => {}}> */}
          <Pressable
            style={[styles.button, isPressed && styles.buttonPressed]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleLogin}
          >
            <Text className="text-white font-bold text-lg">Sign In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
    justifyContent: "center",
    alignItems: "center",
  },
  // Decorative background circles
  circle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#4F46E510",
    top: -60,
    right: -80,
  },
  circle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#7C3AED10",
    bottom: 60,
    left: -60,
  },

  // Card
  card: {
    width: "88%",
    backgroundColor: "#13131A",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#ffffff0D",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 10,
    zIndex: 10,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#4F46E520",
    borderWidth: 1,
    borderColor: "#4F46E540",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 26,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F9FAFB",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  // Form
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#D1D5DB",
    marginBottom: 2,
  },
  forgotText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1E1E2A",
    borderWidth: 1,
    borderColor: "#2D2D3A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#F9FAFB",
  },
  inputFocused: {
    borderColor: "#6366F1",
    backgroundColor: "#1E1E2A",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // Button
  button: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#6366F140",
  },
  buttonPressed: {
    backgroundColor: "#4F46E5",
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: "#0A0A0F",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loader from "../../components/mycomponents/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const scrollRef = useRef();
  const router = useRouter();

  const { bottom: bottomInset } = useSafeAreaInsets();

  const keyboardHeight = useSharedValue(0);
  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  useKeyboardHandler({
    onMove: (e) => {
      "worklet";
      keyboardHeight.value = e.height;
    },
    onEnd: (e) => {
      "worklet";
      keyboardHeight.value = e.height;
      runOnJS(scrollToBottom)();
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({

    // Subtract bottomInset so we don't double-count what SafeAreaView already handles
    marginBottom: Math.max(0, keyboardHeight.value - bottomInset),
  }));


  const handleLogin = async () => {
    try {
      setAuthLoading(true);
      await AsyncStorage.setItem("userToken", "email + password");
      router.replace("/(tabs)");
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setAuthLoading(false);
      }, 5000);
    }
  };



  return (

    <View style={{ flex: 1, backgroundColor: "#09090b" }}>
      {authLoading && (<Loader />)}

      <Animated.View style={[{ flex: 1, justifyContent: "center", gap: 20 }, animatedStyle]}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
        >
          {/* Background circles */}
          <View style={{ position: "absolute", width: 320, height: 320, borderRadius: 160, backgroundColor: "rgba(251, 191, 36, 0.08)", top: -70, right: -40 }} />
          <View style={{ position: "absolute", width: 256, height: 256, borderRadius: 128, backgroundColor: "rgba(129, 140, 248, 0.08)", bottom: -40, left: -40 }} />

          {/* Error Modal */}
          {error ? (
            <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", zIndex: 50 }}>
              <View style={{ width: "90%", maxWidth: 320, backgroundColor: "#111113", borderWidth: 1, borderColor: "#1c1c1e", borderRadius: 16, padding: 24, alignItems: "center" }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1.5, borderColor: "rgba(239,68,68,0.3)", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Feather name="alert-circle" size={24} color="#ef4444" />
                </View>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Invalid Credentials</Text>
                <Text style={{ color: "#ef4444", fontSize: 13, textAlign: "center", marginBottom: 20 }}>{error}</Text>
                <Pressable onPress={() => setError("")} style={{ width: "100%", backgroundColor: "#fbbf24", paddingVertical: 12, borderRadius: 12, alignItems: "center" }}>
                  <Text style={{ color: "#000", fontWeight: "800", fontSize: 14 }}>Try Again</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {/* Main Card */}
          <View style={{ width: "100%", backgroundColor: "#111113", borderWidth: 1, borderColor: "#1c1c1e", borderRadius: 24, paddingHorizontal: 28, paddingVertical: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 }}>
            {/* Header */}
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: "#1a202c", borderWidth: 2, borderColor: "#fbbf24", alignItems: "center", justifyContent: "center", marginBottom: 20, shadowColor: "#fbbf24", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 }}>
                <MaterialCommunityIcons name="motorbike" size={28} color="#fbbf24" />
              </View>
              <Text style={{ color: "#a5b4fc", fontSize: 12, fontWeight: "500", marginBottom: 8 }}>Welcome to</Text>
              <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5, marginBottom: 8 }}>MRH Rider</Text>
              <Text style={{ color: "#a5b4fc", fontSize: 14, fontWeight: "500" }}>Sign in as a rider</Text>
            </View>

            {/* Form */}
            <View style={{ gap: 16 }}>
              {/* Email */}
              <View>
                <Text style={{ color: "#d1d5db", fontSize: 12, fontWeight: "600", letterSpacing: 0.3, marginBottom: 8, textTransform: "uppercase" }}>Email Address</Text>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#1a202c", borderWidth: 1.5, borderColor: focusedField === "email" ? "#fbbf24" : "#2d3748", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 }}>
                  <Feather name="mail" size={18} color={focusedField === "email" ? "#fbbf24" : "#6b7280"} style={{ marginRight: 10 }} />
                  <TextInput
                    style={{ flex: 1, color: "#f9fafb", fontSize: 15, fontWeight: "500" }}
                    placeholder="you@example.com"
                    placeholderTextColor="#6b7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text style={{ color: "#d1d5db", fontSize: 12, fontWeight: "600", letterSpacing: 0.3, marginBottom: 8, textTransform: "uppercase" }}>Password</Text>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#1a202c", borderWidth: 1.5, borderColor: focusedField === "password" ? "#fbbf24" : "#2d3748", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 }}>
                  <Feather name="lock" size={18} color={focusedField === "password" ? "#fbbf24" : "#6b7280"} style={{ marginRight: 10 }} />
                  <TextInput
                    style={{ flex: 1, color: "#f9fafb", fontSize: 15, fontWeight: "500" }}
                    placeholder="••••••••"
                    placeholderTextColor="#6b7280"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Sign In Button */}
              <Pressable
                style={{ marginTop: 8, borderRadius: 16, overflow: "hidden", shadowColor: "#fbbf24", shadowOffset: { width: 0, height: 4 }, shadowOpacity: isPressed ? 0.15 : 0.3, shadowRadius: 12, elevation: isPressed ? 3 : 6 }}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={handleLogin}
              >
                <LinearGradient colors={["#fbbf24", "#f59e0b"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Text style={{ color: "#000", fontSize: 16, fontWeight: "900", letterSpacing: 0.3 }}>Sign In</Text>
                  <Feather name="arrow-right" size={18} color="#000" />
                </LinearGradient>
              </Pressable>

              {/* Demo hint */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(129,140,248,0.1)", borderWidth: 1, borderColor: "rgba(129,140,248,0.2)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 }}>
                <Feather name="info" size={14} color="#a5b4fc" />
                <Text style={{ flex: 1, color: "#a5b4fc", fontSize: 12, fontWeight: "500" }}>Demo: lucky@mrhalwai.in / password</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
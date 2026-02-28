import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loader from "../../components/mycomponents/Loader";
import { normalize } from "../../lib/normalize";

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

  const keyboardHeight = normalize(useSharedValue(0));

  const scrollToBottom = () => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timeout);
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
      {authLoading && <Loader />}

      <Animated.View
        style={[{ flex: 1, justifyContent: "center", gap: 20 }, animatedStyle]}
      >
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
          <View
            style={{
              position: "absolute",
              width: normalize(320),
              height: normalize(320),
              borderRadius: normalize(160),
              backgroundColor: "rgba(251, 191, 36, 0.08)",
              top: normalize(-70),
              right: normalize(-40),
            }}
          />
          <View
            style={{
              position: "absolute",
              width: normalize(256),
              height: normalize(256),
              borderRadius: normalize(128),
              backgroundColor: "rgba(129, 140, 248, 0.08)",
              bottom: normalize(-40),
              left: normalize(-40),
            }}
          />

          {/* Error Modal */}
          {error ? (
            <View
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 50,
              }}
            >
              <View
                style={{
                  width: "90%",
                  maxWidth: normalize(320),
                  backgroundColor: "#111113",
                  borderWidth: normalize(1),
                  borderColor: "#1c1c1e",
                  borderRadius: normalize(16),
                  padding: normalize(24),
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: normalize(48),
                    height: normalize(48),
                    borderRadius: normalize(24),
                    backgroundColor: "rgba(239,68,68,0.1)",
                    borderWidth: normalize(1.5),
                    borderColor: "rgba(239,68,68,0.3)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: normalize(16),
                  }}
                >
                  <Feather name="alert-circle" size={normalize(24)} color="#ef4444" />
                </View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: normalize(18),
                    fontWeight: "700",
                    marginBottom: normalize(8),
                  }}
                >
                  Invalid Credentials
                </Text>
                <Text
                  style={{
                    color: "#ef4444",
                    fontSize: normalize(13),
                    textAlign: "center",
                    marginBottom: normalize(20),
                  }}
                >
                  {error}
                </Text>
                <Pressable
                  onPress={() => setError("")}
                  style={{
                    width: "100%",
                    backgroundColor: "#fbbf24",
                    paddingVertical: normalize(12),
                    borderRadius: normalize(12),
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "#000", fontWeight: "800", fontSize: normalize(14) }}
                  >
                    Try Again
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {/* Main Card */}
          <View
            style={{
              width: "100%",
              backgroundColor: "#111113",
              borderWidth: normalize(1),
              borderColor: "#1c1c1e",
              borderRadius: normalize(24),
              paddingHorizontal: normalize(28),
              paddingVertical: normalize(30),
              shadowColor: "#000",
              shadowOffset: { width: normalize(0), height: normalize(10) },
              shadowOpacity: 0.2,
              shadowRadius: normalize(20),
              elevation: normalize(8),
            }}
          >
            {/* Header */}
            <View style={{ alignItems: "center", marginBottom: normalize(32) }}>
              <View
                style={{
                  width: normalize(64),
                  height: normalize(64),
                  borderRadius: normalize(16),
                  backgroundColor: "#1a202c",
                  borderWidth: normalize(2),
                  borderColor: "#fbbf24",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: normalize(20),
                  shadowColor: "#fbbf24",
                  shadowOffset: { width: normalize(0), height: normalize(4) },
                  shadowOpacity: 0.15,
                  shadowRadius: normalize(12),
                  elevation: normalize(6),
                }}
              >
                <MaterialCommunityIcons
                  name="motorbike"
                  size={normalize(28)}
                  color="#fbbf24"
                />
              </View>
              <Text
                style={{
                  color: "#a5b4fc",
                  fontSize: normalize(12),
                  fontWeight: "500",
                  marginBottom: normalize(8),
                }}
              >
                Welcome to
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: normalize(28),
                  fontWeight: "900",
                  letterSpacing: -0.5,
                  marginBottom: normalize(8),
                }}
              >
                MRH Rider
              </Text>
              <Text
                style={{ color: "#a5b4fc", fontSize: normalize(14), fontWeight: "500" }}
              >
                Sign in as a rider
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: normalize(16) }}>
              {/* Email */}
              <View>
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: normalize(12),
                    fontWeight: "600",
                    letterSpacing: 0.3,
                    marginBottom: normalize(8),
                    textTransform: "uppercase",
                  }}
                >
                  Email Address
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#1a202c",
                    borderWidth: normalize(1.5),
                    borderColor:
                      focusedField === "email" ? "#fbbf24" : "#2d3748",
                    borderRadius: normalize(14),
                    paddingHorizontal: normalize(14),
                    paddingVertical: normalize(12),
                  }}
                >
                  <Feather
                    name="mail"
                    size={normalize(18)}
                    color={focusedField === "email" ? "#fbbf24" : "#6b7280"}
                    style={{ marginRight: normalize(10) }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      color: "#f9fafb",
                      fontSize: normalize(15),
                      fontWeight: "500",
                    }}
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
                <Text
                  style={{
                    color: "#d1d5db",
                    fontSize: normalize(12),
                    fontWeight: "600",
                    letterSpacing: 0.3,
                    marginBottom: normalize(8),
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#1a202c",
                    borderWidth: normalize(1.5),
                    borderColor:
                      focusedField === "password" ? "#fbbf24" : "#2d3748",
                    borderRadius: normalize(14),
                    paddingHorizontal: normalize(14),
                    paddingVertical: normalize(12),
                  }}
                >
                  <Feather
                    name="lock"
                    size={normalize(18)}
                    color={focusedField === "password" ? "#fbbf24" : "#6b7280"}
                    style={{ marginRight: normalize(10) }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      color: "#f9fafb",
                      fontSize: normalize(15),
                      fontWeight: "500",
                    }}
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
                style={{
                  marginTop: normalize(8),
                  borderRadius: normalize(16),
                  overflow: "hidden",
                  shadowColor: "#fbbf24",
                  shadowOffset: { width: normalize(0), height: normalize(4) },
                  shadowOpacity: isPressed ? 0.15 : 0.3,
                  shadowRadius: normalize(12),
                  elevation: isPressed ? normalize(3) : normalize(6),
                }}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={handleLogin}
              >
                <LinearGradient
                  colors={["#fbbf24", "#f59e0b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: normalize(15),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: normalize(8),
                  }}
                >
                  <Text
                    style={{
                      color: "#000",
                      fontSize: normalize(16),
                      fontWeight: "900",
                      letterSpacing: 0.3,
                    }}
                  >
                    Sign In
                  </Text>
                  <Feather name="arrow-right" size={normalize(18)} color="#000" />
                </LinearGradient>
              </Pressable>

              {/* Demo hint */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: normalize(8),
                  backgroundColor: "rgba(129,140,248,0.1)",
                  borderWidth: normalize(1),
                  borderColor: "rgba(129,140,248,0.2)",
                  borderRadius: normalize(12),
                  paddingHorizontal: normalize(12),
                  paddingVertical: normalize(10),
                  marginTop: normalize(8),
                }}
              >
                <Feather name="info" size={normalize(14)} color="#a5b4fc" />
                <Text
                  style={{
                    flex: 1,
                    color: "#a5b4fc",
                    fontSize: normalize(12),
                    fontWeight: "500",
                  }}
                >
                  Demo: lucky@mrhalwai.in / password
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

    </View>
  );
}

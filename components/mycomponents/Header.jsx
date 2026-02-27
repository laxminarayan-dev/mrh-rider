import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { normalize } from "../../lib/normalize";

export default function Header() {
  const router = useRouter();
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    // Handle logout navigation if needed
    router.replace("/(auth)/login");
  };
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 9,
    }).start();
  }, []);

  return (
    <>
      <Animated.View
        style={{
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [normalize(-20), 0],
              }),
            },
          ],
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: normalize(24),
          paddingTop: normalize(12),
          paddingBottom: normalize(16),
          backgroundColor: "#09090b",
          borderBottomWidth: 1,
          borderBottomColor: "#1a202c",
        }}
      >
        {/* Brand */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(12) }}>
          <View
            style={{
              width: normalize(46),
              height: normalize(46),
              borderRadius: normalize(14),
              backgroundColor: "#1a202c",
              borderWidth: 1.5,
              borderColor: "#fbbf24",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../assets/myImages/bicycle.png")}
              style={{ width: normalize(24), height: normalize(24) }}
              contentFit="contain"
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: normalize(10),
                color: "#fbbf24",
                fontWeight: "800",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              MRH Rider
            </Text>
            <Text
              style={{
                fontSize: normalize(18),
                color: "#fff",
                fontWeight: "900",
                letterSpacing: -0.5,
              }}
            >
              Dashboard
            </Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: normalize(6),
            backgroundColor: "#1a202c",
            borderWidth: 1,
            borderColor: "#fbbf24",
            paddingHorizontal: normalize(14),
            paddingVertical: normalize(8),
            borderRadius: normalize(12),
          }}
        >
          <Feather name="log-out" size={normalize(14)} color="#fbbf24" />
          <Text style={{ color: "#fbbf24", fontWeight: "700", fontSize: normalize(13) }}>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
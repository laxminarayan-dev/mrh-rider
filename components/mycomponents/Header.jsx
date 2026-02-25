import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export default function Header({ handleLogout }) {
  const router = useRouter();
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
                outputRange: [-20, 0],
              }),
            },
          ],
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 16,
          backgroundColor: "#09090b",
          borderBottomWidth: 1,
          borderBottomColor: "#1a202c",
        }}
      >
        {/* Brand */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: "#1a202c",
              borderWidth: 1.5,
              borderColor: "#fbbf24",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <MaterialCommunityIcons
              name="motorbike"
              size={24}
              color="#fbbf24"
            /> */}
            <Image
              source={require("../../assets/myImages/bicycle.png")}
              style={{ width: 24, height: 24 }}
              contentFit="contain"
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
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
                fontSize: 18,
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
            gap: 6,
            backgroundColor: "#1a202c",
            borderWidth: 1,
            borderColor: "#fbbf24",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 12,
          }}
        >
          <Feather name="log-out" size={14} color="#fbbf24" />
          <Text style={{ color: "#fbbf24", fontWeight: "700", fontSize: 13 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

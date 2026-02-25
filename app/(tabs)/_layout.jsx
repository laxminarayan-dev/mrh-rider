import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/mycomponents/Header";

export default function TabsLayout() {
  const router = useRouter();
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    // Handle logout navigation if needed
    console.log("logout");
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#09090b" }}>
      <Header handleLogout={handleLogout} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1a202c",
            borderTopColor: "#4b5563",
            paddingTop: 10,
            paddingBottom: 15,
            paddingHorizontal: 15,
            height: 74,
          },
          tabBarActiveTintColor: "#fbbf24",
          tabBarInactiveTintColor: "#6b7280",
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="current"
          options={{
            title: "Current",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="bolt" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="history" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

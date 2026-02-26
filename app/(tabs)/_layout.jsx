import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/mycomponents/Header";
import current from "./current";
import history from "./history";
import index from "./index";

const Tab = createMaterialTopTabNavigator();

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
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          swipeEnabled: true,
          headerShown: false,
          tabBarShowIcon: true,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "#1a202c",
            borderTopWidth: 1,
            borderTopColor: "#374151",
            paddingHorizontal: 10,
            paddingTop: 4,
            height: 68,
            elevation: 8,
          },
          tabBarActiveTintColor: "#fbbf24",
          tabBarInactiveTintColor: "#6b7280",
          tabBarIndicatorStyle: {
            backgroundColor: "#fbbf24",
            width: 0, // Hide the default indicator
            height: 3,
            borderRadius: 2,
            bottom: 0,
          },
          tabBarIconStyle: {
            width: 24,
            height: 24,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "800",
            textTransform: "capitalize",
            marginTop: 2,
            marginBottom: 6,
          },
          tabBarItemStyle: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 6,
          },
        }}
      >
        <Tab.Screen
          name="index"
          component={index}
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="current"
          options={{
            title: "Current",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="bolt" size={size} color={color} />
            ),
          }}
          component={current}
        />
        <Tab.Screen
          name="history"
          component={history}
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="history" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

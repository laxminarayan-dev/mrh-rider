import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#18181b", // zinc-900
          borderTopColor: "#3f3f46", // zinc-700
          paddingTop: 10,
          paddingBottom: 15,
          paddingHorizontal: 15,
          height: 70,
        },
        tabBarActiveTintColor: "#6366f1", // indigo-500
        tabBarInactiveTintColor: "#71717a", // zinc-500
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
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="current"
        options={{
          title: "Current",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="my-location" size={size} color={color} />
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
  );
}

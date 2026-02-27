import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Header from "../../components/mycomponents/Header";
import { AppProvider } from "../../lib/AppContext";

export default function TabsLayout() {
  return (
    <AppProvider>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1a201d",
            borderTopWidth: 1,
            borderTopColor: "#374151",
            paddingHorizontal: 10,
            paddingTop: 4,
            height: 68,
            elevation: 8,
          },
          tabBarActiveTintColor: "#fbbf24",
          tabBarInactiveTintColor: "#6b7280",
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "800",
            textTransform: "capitalize",
            marginTop: 2,
            marginBottom: 6,
          },
          tabBarIconStyle: {
            width: 24,
            height: 24,
          },
          tabBarItemStyle: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 6,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="current"
          options={{
            title: "Current",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="bolt" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="history" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </AppProvider>
  );
}

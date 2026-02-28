import { normalize } from "@/lib/normalize";
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
            paddingHorizontal: normalize(10),
            paddingTop: normalize(4),
            paddingBottom: normalize(8),
            height: normalize(78),
            elevation: 8,
          },
          tabBarActiveTintColor: "#fbbf24",
          tabBarInactiveTintColor: "#6b7280",
          tabBarLabelStyle: {
            fontSize: normalize(14),
            fontWeight: "800",
            textTransform: "capitalize",
            marginTop: normalize(2),
            marginBottom: normalize(6),
          },
          tabBarIconStyle: {
            width: normalize(24),
            height: normalize(24),
          },
          tabBarItemStyle: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: normalize(6),
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={normalize(24)} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="current"
          options={{
            title: "Current",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="bolt" size={normalize(24)} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="history" size={normalize(24)} color={color} />
            ),
          }}
        />
      </Tabs>
    </AppProvider>
  );
}

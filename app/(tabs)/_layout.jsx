import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useState } from "react";
import Header from "../../components/mycomponents/Header";
import ordersData from "../../constants/test.orders.json";
import { normalize } from "../../lib/normalize";
import Current from "./current";
import History from "./history";
import Home from "./index";

const Tab = createMaterialTopTabNavigator();

console.log("normalize:", normalize);
console.log("createMaterialTopTabNavigator:", createMaterialTopTabNavigator);
console.log("MaterialIcons:", MaterialIcons);

export default function TabsLayout() {
  const [isOnline, setIsOnline] = useState(false); // Simulated online status

  useEffect(() => {
    console.clear();
  }, []);

  return (
    <>
      <Header />
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          swipeEnabled: true,
          headerShown: false,
          tabBarShowIcon: true,
          tabBarShowLabel: true,
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
        {/* home page */}
        <Tab.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        >
          {() => <Home isOnline={isOnline} ordersData={ordersData} />}
        </Tab.Screen>

        {/* current orders tab screen */}
        <Tab.Screen
          name="current"
          options={{
            title: "Current",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="bolt" size={24} color={color} />
            ),
          }}
        >
          {() => <Current isOnline={isOnline} ordersData={ordersData} />}
        </Tab.Screen>

        {/* history tab screen */}
        <Tab.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="history" size={24} color={color} />
            ),
          }}
        >
          {() => <History ordersData={ordersData} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}

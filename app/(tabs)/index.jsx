import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EmptyState, OrderRow, StatCard, WelcomeCard } from "../../components/mycomponents/HomeComponents";

const STATS = [
  {
    label: "Delivered",
    value: "0",
    unit: "today",
    icon: "check-circle",
    iconLib: "feather",
    color: "#22c55e",
    bg: "#052e16",
    border: "#166534",
  },
  {
    label: "Pending",
    value: "0",
    unit: "orders",
    icon: "clock",
    iconLib: "feather",
    color: "#f59e0b",
    bg: "#1c1003",
    border: "#854d0e",
  },
  {
    label: "Avg Time",
    value: "--",
    unit: "min",
    icon: "zap",
    iconLib: "feather",
    color: "#a78bfa",
    bg: "#1a202c",
    border: "#4c1d95",
  },
];
const ORDERS = [];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setLoggedIn(!!token);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#09090b", alignItems: "center", justifyContent: "center" }}>
        <MaterialCommunityIcons name="motorbike" size={36} color="#fbbf24" />
        <Text style={{ color: "#3f3f46", fontSize: 12, letterSpacing: 4, marginTop: 16, textTransform: "uppercase" }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!loggedIn) return <Redirect href="/(auth)/login" />;

  return (
    <ScrollView
      className="bg-[#09090b]"
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
    >
      {/* Welcome Hero */}
      <WelcomeCard />

      {/* New Order Popup */}

      {/* Section label */}
      <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: "#fbbf24" }} />
          <Text style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 2.5, fontWeight: "800" }}>
            Today's Summary
          </Text>
        </View>
      </View>

      {/* Stats Rows */}
      {/* First Card - Full Width */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <StatCard {...STATS[0]} delay={0} />
      </View>

      {/* Second and Third Cards - Half Width Each */}
      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 32 }}>
        <View style={{ flex: 1 }}>
          <StatCard {...STATS[1]} delay={100} />
        </View>
        <View style={{ flex: 1 }}>
          <StatCard {...STATS[2]} delay={200} />
        </View>
      </View>

      {/* Section label */}
      <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: "#fbbf24" }} />
            <Text style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 2.5, fontWeight: "800" }}>
              Recent Orders
            </Text>
          </View>
          {ORDERS.length > 0 && (
            <TouchableOpacity>
              <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700" }}>See all →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Orders list / empty state */}
      <View style={{ paddingHorizontal: 20 }}>
        {ORDERS.length === 0 ? (
          <EmptyState />
        ) : (
          <View
            style={{
              backgroundColor: "#111113",
              borderWidth: 1,
              borderColor: "#1c1c1e",
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            {ORDERS.map((o, i) => (
              <OrderRow key={o.id} item={o} index={i} last={i === ORDERS.length - 1} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
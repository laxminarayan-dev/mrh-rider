import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EmptyState, OrderRow, StatCard, WelcomeCard } from "../../components/mycomponents/HomeComponents";
import { NewOrderPopup } from "../../components/mycomponents/NewOrderPopup";
import { useAppContext } from "../../lib/AppContext";

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Home() {
  const { isOnline, ordersData, handleActiveStatusChange, isLoading } = useAppContext();
  const [showNewOrder, setShowNewOrder] = useState(false); // Control new order popup visibility
  const [historyData, setHistoryData] = useState([]); // Store order history data

  useEffect(() => {
    if (ordersData && ordersData.length > 0) {
      let data = ordersData.filter(order => order.status === "delivered" || order.status === "cancelled");
      setHistoryData(data);
    }
  }, [ordersData])

  if (!ordersData || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#09090b" }}>
        <Text style={{ color: "#6b7280", fontSize: 14 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="bg-[#09090b]"
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
    >
      {/* Welcome Hero */}
      <WelcomeCard isOnline={isOnline} onToggleOnline={() => handleActiveStatusChange(!isOnline)} />

      {/* New Order Popup */}
      <NewOrderPopup visible={showNewOrder} onClose={() => setShowNewOrder(false)} />

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
        <StatCard ordersData={ordersData} isOnline={isOnline} />
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
          {ordersData.length > 0 && (
            <TouchableOpacity onPress={() => router.push("/history")} style={{ padding: 4 }}>
              <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700" }}>See all →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Orders list / empty state */}
      <View style={{ paddingHorizontal: 20 }}>
        {historyData.length === 0 ? (
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
            {historyData.slice(-5).reverse().map((o, i) => (
              <OrderRow key={`${o._id}${o.createdAt}`} item={o} index={i} last={i === historyData.length - 1} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
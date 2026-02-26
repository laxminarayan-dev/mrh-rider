import { devideOrdersByDate } from "@/lib/getOrderData";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";


import { EmptyHistory, HistoryCard } from "../../components/mycomponents/HistoryComponents";

// ─── Demo data (replace with real API data) ──────────────────────────────────

const STATUS_CONFIG = {
  delivered: { label: "Delivered", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", icon: "check-circle" },
  out_for_delivery: { label: "Out for Delivery", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", icon: "truck" },
  picking_up: { label: "Picking Up", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", icon: "package" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", icon: "x-circle" },
};



// ─── Main Screen ─────────────────────────────────────────────────────────────
function History({ ordersData }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all"); // all | delivered | cancelled

  useEffect(() => {
    setOrders(ordersData.filter((o) => (o.status === "delivered" || o.status === "cancelled")));
  }, [ordersData]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Group by date
  const grouped = devideOrdersByDate(filtered);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: "#d4a843" }} />
          <Text style={{ fontSize: 20, color: "#f0f0f0", fontWeight: "800", letterSpacing: -0.3 }}>
            Order History
          </Text>
        </View>
      </View>

      {/* Summary card */}
      <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
        <View
          style={{
            backgroundColor: "#111214",
            borderWidth: 1,
            borderColor: "#1e1f23",
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 10, color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Total Orders</Text>
            <Text style={{ fontSize: 22, color: "#f0f0f0", fontWeight: "800" }}>{orders.length}</Text>
          </View>
          <View style={{ width: 1, backgroundColor: "#1e1f23" }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 10, color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Delivered</Text>
            <Text style={{ fontSize: 22, color: "#22c55e", fontWeight: "800" }}>{orders.filter((o) => o.status === "delivered").length}</Text>
          </View>
          <View style={{ width: 1, backgroundColor: "#1e1f23" }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 10, color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Cancelled</Text>
            <Text style={{ fontSize: 22, color: "#ef4444", fontWeight: "800" }}>{orders.filter((o) => o.status === "cancelled").length}</Text>
          </View>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: 20, marginBottom: 18, gap: 8 }}>
        {[
          { key: "all", label: "All" },
          { key: "delivered", label: "Delivered" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => setFilter(tab.key)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 10,
              backgroundColor: filter === tab.key ? "#d4a843" : "#1e1f23",
              borderWidth: 1,
              borderColor: filter === tab.key ? "#d4a843" : "#2a2b30",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: filter === tab.key ? "#111214" : "#71717a",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders grouped by date */}
      <View style={{ paddingHorizontal: 20 }}>
        {filtered.length === 0 ? (
          <EmptyHistory />
        ) : (
          Object.entries(grouped).reverse().map(([date, dateOrders], index) => (
            <View key={date + "-" + index} style={{ marginBottom: 20 }}>
              {/* Date label */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Feather name="calendar" size={12} color="#52525b" />
                <Text style={{ fontSize: 11, color: "#52525b", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.5 }}>
                  {date}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: "#1e1f23" }} />
              </View>

              {dateOrders.map((order, i) => (
                <HistoryCard key={order._id} order={order} index={i} />
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default History;

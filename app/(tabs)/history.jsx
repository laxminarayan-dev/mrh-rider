import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Demo data (replace with real API data) ──────────────────────────────────
const DEMO_HISTORY = [
  {
    id: "ORD-7F3A12",
    customer: "Ankit Verma",
    pickup: { name: "Pizza Palace", address: "Sector 14, Gurgaon" },
    delivery: { address: "Sushant Lok 2, Block A" },
    items: 2,
    amount: "₹350",
    payment: "Online",
    distance: "1.8 km",
    status: "delivered",
    date: "Today",
    time: "1:20 PM",
    duration: "18 min",
  },
  {
    id: "ORD-4B9E56",
    customer: "Sneha Gupta",
    pickup: { name: "Biryani House", address: "MG Road, Gurgaon" },
    delivery: { address: "DLF Phase 1, Gate 3" },
    items: 1,
    amount: "₹180",
    payment: "COD",
    distance: "3.5 km",
    status: "delivered",
    date: "Today",
    time: "12:05 PM",
    duration: "22 min",
  },
  {
    id: "ORD-1D8C44",
    customer: "Vikram Singh",
    pickup: { name: "Chai Point", address: "Cyber Hub, Gurgaon" },
    delivery: { address: "Udyog Vihar Phase 5" },
    items: 4,
    amount: "₹520",
    payment: "Online",
    distance: "4.2 km",
    status: "cancelled",
    date: "Yesterday",
    time: "6:45 PM",
    duration: "--",
  },
  {
    id: "ORD-6A2F78",
    customer: "Meera Joshi",
    pickup: { name: "Rolls Corner", address: "Sector 29, Gurgaon" },
    delivery: { address: "South City 1, Block D" },
    items: 2,
    amount: "₹290",
    payment: "COD",
    distance: "2.1 km",
    status: "delivered",
    date: "Yesterday",
    time: "2:10 PM",
    duration: "15 min",
  },
];

const STATUS_CONFIG = {
  delivered: { label: "Delivered", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", icon: "check-circle" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", icon: "x-circle" },
};

// ─── History Card ────────────────────────────────────────────────────────────
function HistoryCard({ order, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.delivered;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 55,
      friction: 9,
      delay: index * 80,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        marginBottom: 12,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
      >
        <View
          style={{
            backgroundColor: "#111214",
            borderWidth: 1,
            borderColor: "#1e1f23",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Main Row */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 }}>
            {/* Status Icon */}
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: status.bg,
                borderWidth: 1,
                borderColor: status.border,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Feather name={status.icon} size={16} color={status.color} />
            </View>

            {/* Order info */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 14, color: "#f0f0f0", fontWeight: "700" }}>{order.id}</Text>
                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: "#3f3f46" }} />
                <Text style={{ fontSize: 11, color: "#52525b", fontWeight: "500" }}>{order.time}</Text>
              </View>
              <Text style={{ fontSize: 12, color: "#71717a", fontWeight: "500", marginTop: 2 }}>{order.customer}</Text>
            </View>

            {/* Amount + chevron */}
            <View style={{ alignItems: "flex-end", flexDirection: "row", gap: 8 }}>
              <Text style={{ fontSize: 15, color: "#f0f0f0", fontWeight: "800" }}>{order.amount}</Text>
              <Feather name={expanded ? "chevron-up" : "chevron-down"} size={16} color="#52525b" />
            </View>
          </View>

          {/* Expanded Details */}
          {expanded && (
            <View>
              <View style={{ height: 1, backgroundColor: "#1e1f23", marginHorizontal: 16 }} />

              {/* Locations */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}>
                {/* Pickup */}
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(34,197,94,0.1)", borderWidth: 1, borderColor: "rgba(34,197,94,0.2)", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                    <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: "#22c55e" }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 1 }}>Pickup</Text>
                    <Text style={{ fontSize: 13, color: "#e4e4e7", fontWeight: "600" }}>{order.pickup.name}</Text>
                    <Text style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>{order.pickup.address}</Text>
                  </View>
                </View>

                {/* Connector */}
                <View style={{ marginLeft: 9, width: 1, height: 6, backgroundColor: "#1e1f23" }} />

                {/* Delivery */}
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1, borderColor: "rgba(239,68,68,0.2)", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                    <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: "#ef4444" }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 1 }}>Delivery</Text>
                    <Text style={{ fontSize: 13, color: "#e4e4e7", fontWeight: "600" }}>{order.delivery.address}</Text>
                  </View>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: "#1e1f23", marginHorizontal: 16 }} />

              {/* Info chips */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1e1f23", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
                  <MaterialCommunityIcons name="map-marker-distance" size={12} color="#71717a" />
                  <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600" }}>{order.distance}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1e1f23", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
                  <Feather name="clock" size={11} color="#71717a" />
                  <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600" }}>{order.duration}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1e1f23", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
                  <MaterialCommunityIcons name="cash" size={13} color="#71717a" />
                  <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600" }}>{order.payment}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1e1f23", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
                  <MaterialCommunityIcons name="package-variant" size={12} color="#71717a" />
                  <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600" }}>{order.items} items</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyHistory() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 45,
      friction: 8,
      delay: 200,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
        marginTop: 40,
      }}
    >
      <View
        style={{
          backgroundColor: "#111214",
          borderWidth: 1,
          borderColor: "#1e1f23",
          borderRadius: 20,
          paddingVertical: 56,
          paddingHorizontal: 32,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            backgroundColor: "rgba(212,168,67,0.08)",
            borderWidth: 1,
            borderColor: "rgba(212,168,67,0.15)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 22,
          }}
        >
          <Feather name="archive" size={32} color="#d4a843" />
        </View>

        <Text style={{ fontSize: 17, fontWeight: "800", color: "#f0f0f0", textAlign: "center", marginBottom: 8 }}>
          No Delivery History
        </Text>
        <Text style={{ fontSize: 13, color: "#52525b", textAlign: "center", lineHeight: 20, fontWeight: "500", maxWidth: 240 }}>
          Your completed and cancelled deliveries will appear here.
        </Text>

        <View style={{ marginTop: 24, width: 40, height: 3, borderRadius: 2, backgroundColor: "rgba(212,168,67,0.25)" }} />
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
function History() {
  const [orders] = useState(DEMO_HISTORY);
  const [filter, setFilter] = useState("all"); // all | delivered | cancelled

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Group by date
  const grouped = filtered.reduce((acc, order) => {
    if (!acc[order.date]) acc[order.date] = [];
    acc[order.date].push(order);
    return acc;
  }, {});

  const totalEarnings = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + parseInt(o.amount.replace(/[^\d]/g, ""), 10), 0);

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
            <Text style={{ fontSize: 10, color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Earnings</Text>
            <Text style={{ fontSize: 22, color: "#d4a843", fontWeight: "800" }}>₹{totalEarnings}</Text>
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
          Object.entries(grouped).map(([date, dateOrders]) => (
            <View key={date} style={{ marginBottom: 20 }}>
              {/* Date label */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Feather name="calendar" size={12} color="#52525b" />
                <Text style={{ fontSize: 11, color: "#52525b", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.5 }}>
                  {date}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: "#1e1f23" }} />
              </View>

              {dateOrders.map((order, i) => (
                <HistoryCard key={order.id} order={order} index={i} />
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default History;

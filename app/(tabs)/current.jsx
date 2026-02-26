import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Demo data (replace with real data from socket/API) ──────────────────────
const DEMO_ORDERS = [
  {
    id: "ORD-28A1F3",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    pickup: { name: "Tandoori Bites", address: "Sector 22, Gurgaon" },
    delivery: { address: "DLF Phase 3, Block B, Flat 402" },
    items: 3,
    amount: "₹485",
    payment: "COD",
    distance: "2.4 km",
    status: "picking_up", // picking_up | on_the_way | arrived
    placedAt: "2:35 PM",
  },
  {
    id: "ORD-93C7D2",
    customer: "Priya Patel",
    phone: "+91 91234 56780",
    pickup: { name: "Wok Express", address: "MG Road, Gurgaon" },
    delivery: { address: "Sushant Lok 1, C Block, House 14" },
    items: 1,
    amount: "₹220",
    payment: "Online",
    distance: "3.1 km",
    status: "on_the_way",
    placedAt: "2:50 PM",
  },
];

const STATUS_CONFIG = {
  picking_up: { label: "Picking Up", color: "#d4a843", bg: "rgba(212,168,67,0.1)", border: "rgba(212,168,67,0.2)", icon: "package" },
  on_the_way: { label: "On the Way", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", icon: "navigation" },
  arrived: { label: "Arrived", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", icon: "map-pin" },
};

// ─── Order Card ──────────────────────────────────────────────────────────────
function OrderCard({ order, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.picking_up;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 55,
      friction: 9,
      delay: index * 120,
    }).start();
  }, []);

  const openNavigation = () => {
    // Replace with actual coordinates from order
    const address = encodeURIComponent(order.delivery.address);
    const url = `google.navigation:q=${address}&mode=d`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
    });
  };

  const callCustomer = () => {
    Linking.openURL(`tel:${order.phone}`);
  };

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        marginBottom: 14,
      }}
    >
      <View
        style={{
          backgroundColor: "#111214",
          borderWidth: 1,
          borderColor: "#1e1f23",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: "rgba(212,168,67,0.08)",
                borderWidth: 1,
                borderColor: "rgba(212,168,67,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name="package-variant" size={18} color="#d4a843" />
            </View>
            <View>
              <Text style={{ fontSize: 15, color: "#f0f0f0", fontWeight: "700" }}>{order.id}</Text>
              <Text style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>{order.placedAt}</Text>
            </View>
          </View>

          {/* Status badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: status.bg,
              borderWidth: 1,
              borderColor: status.border,
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: status.color }} />
            <Text style={{ color: status.color, fontSize: 11, fontWeight: "600" }}>{status.label}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#1e1f23", marginHorizontal: 16 }} />

        {/* Locations */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
          {/* Pickup */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(34,197,94,0.1)", borderWidth: 1, borderColor: "rgba(34,197,94,0.2)", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Pickup</Text>
              <Text style={{ fontSize: 13, color: "#e4e4e7", fontWeight: "600" }}>{order.pickup.name}</Text>
              <Text style={{ fontSize: 12, color: "#52525b", marginTop: 1 }}>{order.pickup.address}</Text>
            </View>
          </View>

          {/* Connector line */}
          <View style={{ marginLeft: 11, width: 1, height: 8, backgroundColor: "#1e1f23" }} />

          {/* Delivery */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1, borderColor: "rgba(239,68,68,0.2)", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#ef4444" }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Delivery</Text>
              <Text style={{ fontSize: 13, color: "#e4e4e7", fontWeight: "600" }}>{order.delivery.address}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#1e1f23", marginHorizontal: 16 }} />

        {/* Info row */}
        <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Feather name="user" size={12} color="#52525b" />
            <Text style={{ fontSize: 12, color: "#a1a1aa", fontWeight: "600" }}>{order.customer}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <MaterialCommunityIcons name="map-marker-distance" size={13} color="#52525b" />
            <Text style={{ fontSize: 12, color: "#a1a1aa", fontWeight: "600" }}>{order.distance}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <MaterialCommunityIcons name="cash" size={14} color="#52525b" />
            <Text style={{ fontSize: 12, color: "#a1a1aa", fontWeight: "600" }}>{order.payment}</Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <Text style={{ fontSize: 14, color: "#f0f0f0", fontWeight: "800" }}>{order.amount}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#1e1f23", marginHorizontal: 16 }} />

        {/* Action buttons */}
        <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 10 }}>
          <TouchableOpacity
            onPress={callCustomer}
            activeOpacity={0.7}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: "#1e1f23",
              borderRadius: 12,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: "#2a2b30",
            }}
          >
            <Feather name="phone" size={14} color="#a1a1aa" />
            <Text style={{ color: "#a1a1aa", fontSize: 13, fontWeight: "600" }}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openNavigation}
            activeOpacity={0.7}
            style={{
              flex: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: "#d4a843",
              borderRadius: 12,
              paddingVertical: 10,
            }}
          >
            <Feather name="navigation" size={14} color="#111214" />
            <Text style={{ color: "#111214", fontSize: 13, fontWeight: "800" }}>Navigate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyCurrentOrders() {
  const anim = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 45,
      friction: 8,
      delay: 200,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
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
        <Animated.View
          style={{
            transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }],
            marginBottom: 22,
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
            }}
          >
            <Feather name="inbox" size={32} color="#d4a843" />
          </View>
        </Animated.View>

        <Text style={{ fontSize: 17, fontWeight: "800", color: "#f0f0f0", textAlign: "center", marginBottom: 8 }}>
          No Active Orders
        </Text>
        <Text style={{ fontSize: 13, color: "#52525b", textAlign: "center", lineHeight: 20, fontWeight: "500", maxWidth: 240 }}>
          When you accept a delivery, it will show up here with full details and navigation.
        </Text>

        <View style={{ marginTop: 24, width: 40, height: 3, borderRadius: 2, backgroundColor: "rgba(212,168,67,0.25)" }} />
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
function Current() {
  const [orders] = useState(DEMO_ORDERS); // Replace with real state

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: "#d4a843" }} />
            <Text style={{ fontSize: 20, color: "#f0f0f0", fontWeight: "800", letterSpacing: -0.3 }}>
              Current Orders
            </Text>
          </View>
          {orders.length > 0 && (
            <View
              style={{
                backgroundColor: "rgba(212,168,67,0.1)",
                borderWidth: 1,
                borderColor: "rgba(212,168,67,0.2)",
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 12, color: "#d4a843", fontWeight: "700" }}>
                {orders.length} active
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Orders */}
      <View style={{ paddingHorizontal: 20 }}>
        {orders.length === 0 ? (
          <EmptyCurrentOrders />
        ) : (
          orders.map((order, i) => (
            <OrderCard key={order.id} order={order} index={i} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default Current;

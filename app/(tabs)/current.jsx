import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useLocationStatus } from "../../components/mycomponents/CurrentComponent/useLocationStatus";
import openGoogleMaps from "../../components/mycomponents/OpenGoogleMap";
import hasArrived, { getDistanceMeters } from "../../lib/hasArived";
import { normalize } from "../../lib/normalize";

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_ORDERS = [
  {
    id: "ORD-93C7D2",
    customer: "Priya Patel",
    phone: "+91 91234 56780",
    pickup: { name: "Wok Express", address: "MG Road, Gurgaon", lat: 28.4595, lng: 77.0266 },
    delivery: { address: "Sushant Lok 1, C Block, House 14", lat: 28.4677, lng: 77.0714 },
    items: 1,
    amount: "₹220",
    payment: "Online",
    distance: "3.1 km",
    status: "on_the_way",
    placedAt: "2:50 PM",
  },
  {
    id: "ORD-28A1F3",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    pickup: { name: "Tandoori Bites", address: "Sector 22, Gurgaon", lat: 28.4595, lng: 77.0266 },
    delivery: { address: "DLF Phase 3, Block B, Flat 402", lat: 28.4945, lng: 77.0935 },
    items: 3,
    amount: "₹485",
    payment: "COD",
    distance: "2.4 km",
    status: "picking_up",
    placedAt: "2:35 PM",
  },

];

const STATUS_CONFIG = {
  picking_up: { label: "Picking Up", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: "package", dot: "#f59e0b" },
  ready: { label: "Ready", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: "package", dot: "#f59e0b" },
  on_the_way: { label: "On the Way", color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.25)", icon: "navigation", dot: "#22c55e" },
  out_for_delivery: { label: "Out for Delivery", color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.25)", icon: "navigation", dot: "#22c55e" },
  arrived: { label: "Arrived", color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.25)", icon: "map-pin", dot: "#60a5fa" },
  delivered: { label: "Delivered", color: "#6b7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.25)", icon: "check-circle", dot: "#6b7280" },
};

// ─── Pill Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.picking_up;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === "on_the_way" || status === "out_for_delivery") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.5, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [status]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: normalize(5),
        backgroundColor: cfg.bg,
        borderWidth: 1,
        borderColor: cfg.border,
        borderRadius: normalize(20),
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
      }}
    >
      <Animated.View
        style={{
          width: normalize(6),
          height: normalize(6),
          borderRadius: normalize(3),
          backgroundColor: cfg.dot,
          transform: [{ scale: pulse }],
        }}
      />
      <Text style={{ color: cfg.color, fontSize: normalize(11), fontWeight: "700", letterSpacing: 0.3 }}>
        {cfg.label}
      </Text>
    </View>
  );
}

// ─── Info Chip ────────────────────────────────────────────────────────────────
function InfoChip({ iconLib, icon, label, iconSize = 12 }) {
  const Icon = iconLib === "mci" ? MaterialCommunityIcons : Feather;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4) }}>
      <Icon name={icon} size={normalize(iconSize)} color="#3f3f46" />
      <Text style={{ fontSize: normalize(12), color: "#71717a", fontWeight: "600" }}>{label}</Text>
    </View>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <View style={{ height: 1, backgroundColor: "#18181b", marginHorizontal: normalize(16) }} />
);

// ─── Order Card ──────────────────────────────────────────────────────────────
function OrderCard({ ordersData, index, hasArrivedToCurrent, handleDelivered }) {
  const anim = useRef(new Animated.Value(0)).current;
  const cfg = STATUS_CONFIG[ordersData.status] || STATUS_CONFIG.picking_up;
  const isActive = index === 0;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
      delay: index * 100,
    }).start();
  }, []);
  const callCustomer = () => Linking.openURL(`tel:${ordersData.phone}`);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [normalize(24), 0] }) },
          { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
        ],
        opacity: isActive ? 1 : 0.4,
        pointerEvents: isActive ? "auto" : "none",
        marginBottom: normalize(14),
      }}
    >
      <View
        style={{
          backgroundColor: "#111214",
          borderWidth: 1,
          borderColor: "#202024",
          borderRadius: normalize(20),
          overflow: "hidden",
          borderLeftWidth: normalize(3),
          borderLeftColor: cfg.color,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: normalize(16),
            paddingTop: normalize(14),
            paddingBottom: normalize(12),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(10) }}>
            <View
              style={{
                width: normalize(38),
                height: normalize(38),
                borderRadius: normalize(12),
                backgroundColor: `${cfg.color}14`,
                borderWidth: 1,
                borderColor: `${cfg.color}30`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name={cfg.icon} size={normalize(19)} color={cfg.color} />
            </View>
            <View>
              <Text style={{ fontSize: normalize(14), color: "#f4f4f5", fontWeight: "800", letterSpacing: 0.2 }}>
                {ordersData.id}
              </Text>
              <Text style={{ fontSize: normalize(11), color: "#3f3f46", marginTop: normalize(2) }}>
                Placed at {ordersData.placedAt}
              </Text>
            </View>
          </View>
          <StatusBadge status={ordersData.status} />
        </View>

        <Divider />

        {/* Route */}
        <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(14) }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: normalize(12) }}>
            <View style={{ alignItems: "center", width: normalize(20) }}>
              <View
                style={{
                  width: normalize(20),
                  height: normalize(20),
                  borderRadius: normalize(10),
                  backgroundColor: "rgba(34,197,94,0.12)",
                  borderWidth: 1.5,
                  borderColor: "#22c55e",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: normalize(7), height: normalize(7), borderRadius: normalize(4), backgroundColor: "#22c55e" }} />
              </View>
              <View style={{ width: 1.5, height: normalize(24), backgroundColor: "#27272a", marginTop: normalize(3) }} />
            </View>
            <View style={{ flex: 1, paddingBottom: normalize(12) }}>
              <Text style={{ fontSize: normalize(10), color: "#3f3f46", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: normalize(3) }}>
                Pickup
              </Text>
              <Text style={{ fontSize: normalize(13), color: "#e4e4e7", fontWeight: "700" }}>{ordersData.pickup.name}</Text>
              <Text style={{ fontSize: normalize(12), color: "#52525b", marginTop: normalize(2) }}>{ordersData.pickup.address}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: normalize(12) }}>
            <View style={{ width: normalize(20), alignItems: "center" }}>
              <View
                style={{
                  width: normalize(20),
                  height: normalize(20),
                  borderRadius: normalize(10),
                  backgroundColor: "rgba(239,68,68,0.12)",
                  borderWidth: 1.5,
                  borderColor: "#ef4444",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: normalize(7), height: normalize(7), borderRadius: normalize(4), backgroundColor: "#ef4444" }} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: normalize(10), color: "#3f3f46", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: normalize(3) }}>
                Delivery
              </Text>
              <Text style={{ fontSize: normalize(13), color: "#e4e4e7", fontWeight: "700" }}>{ordersData.delivery.address}</Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Meta */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: normalize(16),
            paddingVertical: normalize(11),
            gap: normalize(14),
          }}
        >
          <InfoChip iconLib="feather" icon="user" label={ordersData.customer} iconSize={12} />
          <InfoChip iconLib="mci" icon="map-marker-distance" label={ordersData.distance} iconSize={13} />
          <InfoChip iconLib="mci" icon="cash" label={ordersData.payment} iconSize={14} />
          <View style={{ marginLeft: "auto" }}>
            <Text style={{ fontSize: normalize(15), color: "#f4f4f5", fontWeight: "800" }}>{ordersData.amount}</Text>
          </View>
        </View>

        <Divider />

        {/* Actions */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: normalize(14),
            paddingVertical: normalize(12),
            gap: normalize(10),
          }}
        >
          <TouchableOpacity
            onPress={callCustomer}
            activeOpacity={0.7}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: normalize(6),
              backgroundColor: "#1c1c1f",
              borderRadius: normalize(12),
              paddingVertical: normalize(11),
              borderWidth: 1,
              borderColor: "#27272a",
            }}
          >
            <Feather name="phone" size={normalize(14)} color="#71717a" />
            <Text style={{ color: "#a1a1aa", fontSize: normalize(13), fontWeight: "700" }}>Call</Text>
          </TouchableOpacity>

          {hasArrivedToCurrent ?

            <TouchableOpacity
              onPress={() => handleDelivered(ordersData.id)}
              activeOpacity={0.75}
              style={{
                flex: 2.2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: normalize(7),
                backgroundColor: cfg.color,
                borderRadius: normalize(12),
                paddingVertical: normalize(11),
              }}
            >
              <Feather name="navigation" size={normalize(14)} color="#0a0a0b" />
              <Text style={{ color: "#0a0a0b", fontSize: normalize(13), fontWeight: "800", letterSpacing: 0.2 }}>Mark As Delivered</Text>
            </TouchableOpacity>
            : <TouchableOpacity
              onPress={() => openGoogleMaps(
                { lat: ordersData.pickup.lat, lng: ordersData.pickup.lng },
                { lat: ordersData.delivery.lat, lng: ordersData.delivery.lng }
              )}
              activeOpacity={0.75}
              style={{
                flex: 2.2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: normalize(7),
                backgroundColor: cfg.color,
                borderRadius: normalize(12),
                paddingVertical: normalize(11),
              }}
            >
              <Feather name="navigation" size={normalize(14)} color="#0a0a0b" />
              <Text style={{ color: "#0a0a0b", fontSize: normalize(13), fontWeight: "800", letterSpacing: 0.2 }}>Navigate</Text>
            </TouchableOpacity>}
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
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 45, friction: 8, delay: 200 }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.93, 1] }) }],
        marginTop: normalize(40),
      }}
    >
      <View
        style={{
          backgroundColor: "#111214",
          borderWidth: 1,
          borderColor: "#202024",
          borderRadius: normalize(22),
          paddingVertical: normalize(60),
          paddingHorizontal: normalize(32),
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, normalize(-8)] }) }],
            marginBottom: normalize(24),
          }}
        >
          <View
            style={{
              width: normalize(76),
              height: normalize(76),
              borderRadius: normalize(24),
              backgroundColor: "rgba(245,158,11,0.08)",
              borderWidth: 1,
              borderColor: "rgba(245,158,11,0.18)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="inbox" size={normalize(33)} color="#f59e0b" />
          </View>
        </Animated.View>

        <Text style={{ fontSize: normalize(18), fontWeight: "800", color: "#f4f4f5", textAlign: "center", marginBottom: normalize(8), letterSpacing: -0.3 }}>
          No Active Orders
        </Text>
        <Text
          style={{
            fontSize: normalize(13),
            color: "#3f3f46",
            textAlign: "center",
            lineHeight: normalize(20),
            fontWeight: "500",
            maxWidth: normalize(240),
          }}
        >
          When you accept a delivery, it will appear here with full details and navigation.
        </Text>
        <View style={{ marginTop: normalize(26), width: normalize(36), height: normalize(3), borderRadius: normalize(2), backgroundColor: "rgba(245,158,11,0.3)" }} />
      </View>
    </Animated.View>
  );
}


// ─── Main Screen ─────────────────────────────────────────────────────────────
function Current() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [hasArrivedToCurrent, setHasArrivedToCurrent] = useState(false);
  const hasSortedRef = useRef(false);

  // const locationReady = useLocationGuard();
  const { status: locationStatus, currentLocation } = useLocationStatus();

  useEffect(() => {
    if (!currentLocation || orders.length === 0) {
      setCurrentOrder(null);
      return;
    }

    let nearest = null;
    let minDistance = Infinity;

    orders.forEach(order => {
      const dist = getDistanceMeters(currentLocation, {
        lat: order.delivery.lat,
        lng: order.delivery.lng,
      });

      if (dist < minDistance) {
        minDistance = dist;
        nearest = order;
      }
    });


    setCurrentOrder(nearest);


  }, [currentLocation, orders]);


  useEffect(() => {
    if (!currentLocation || orders.length === 0) return;

    if (hasSortedRef.current) return; // already sorted once

    const sorted = [...orders].sort((a, b) => {
      const distA = getDistanceMeters(currentLocation, a.delivery);
      const distB = getDistanceMeters(currentLocation, b.delivery);
      return distA - distB;
    });

    setSortedOrders(sorted);

    hasSortedRef.current = true; // lock it

  }, [currentLocation, orders]);

  useEffect(() => {
    const isArrived = hasArrived(currentLocation, { lat: currentOrder?.delivery.lat, lng: currentOrder?.delivery.lng });
    setHasArrivedToCurrent(isArrived);
  }, [currentLocation, currentOrder]);

  const handleDelivered = (id) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);

    hasSortedRef.current = false; // unlock sorting
  };

  if (locationStatus === "checking") {
    return null;
  } if (locationStatus === "no-permission") {
    return (
      <View style={styles.guardContainer}>
        <Text style={styles.guardText}>
          Location permission is required to start ride.
        </Text>

        <Pressable
          onPress={() => Location.requestForegroundPermissionsAsync()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  } if (locationStatus === "gps-off") {
    return (
      <View style={styles.guardContainer}>
        <Text style={styles.guardText}>
          Please turn on GPS (Location Services).
        </Text>

        <Pressable
          onPress={() =>
            Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS")
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Turn On GPS</Text>
        </Pressable>
      </View>
    );
  }

  return (

    <ScrollView
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: normalize(100), paddingTop: normalize(24) }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: normalize(20), marginBottom: normalize(20) }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(10) }}>
            <View
              style={{
                width: normalize(4),
                height: normalize(20),
                borderRadius: normalize(2),
                backgroundColor: "#f59e0b",
              }}
            />
            <Text style={{ fontSize: normalize(21), color: "#f4f4f5", fontWeight: "800", letterSpacing: -0.5 }}>
              Current Orders
            </Text>
          </View>

          {sortedOrders.length > 0 && (
            <View
              style={{
                backgroundColor: "rgba(245,158,11,0.1)",
                borderWidth: 1,
                borderColor: "rgba(245,158,11,0.22)",
                borderRadius: normalize(20),
                paddingHorizontal: normalize(12),
                paddingVertical: normalize(5),
                flexDirection: "row",
                alignItems: "center",
                gap: normalize(5),
              }}
            >
              <View style={{ width: normalize(6), height: normalize(6), borderRadius: normalize(3), backgroundColor: "#f59e0b" }} />
              <Text style={{ fontSize: normalize(12), color: "#f59e0b", fontWeight: "700" }}>
                {sortedOrders.length} active
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Cards */}
      <View style={{ paddingHorizontal: normalize(16) }}>
        {orders.length === 0 ? (
          <EmptyCurrentOrders />
        ) : sortedOrders.length == 0 ? (
          <View style={{ marginTop: normalize(40), alignItems: "center", flexDirection: "column", alignItems: "center", gap: normalize(100) }}>
            <Text style={{ color: "#71717a", fontSize: normalize(13), textAlign: "center", marginTop: normalize(40) }}>
              Sorting orders based on your location...
            </Text>
            <ActivityIndicator size="large" color="#f59e0b" />
          </View>
        ) : (
          (
            sortedOrders.map((o, i) => <OrderCard
              key={o.id}
              ordersData={o}
              index={i}
              hasArrivedToCurrent={hasArrivedToCurrent}
              handleDelivered={handleDelivered} />)
          )
        )}
      </View>
    </ScrollView>

  );
}


export default Current;


const styles = {
  guardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  guardText: {
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "700",
    color: "#000",
  },
};
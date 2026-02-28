import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View
} from "react-native";
import { EmptyCurrentOrders, GPSOffPlaceholder, NoPermissonPlaceholder, OfflinePlaceholder, OrderCard } from "../../components/mycomponents/CurrentComponent/CurrentAllComponents";
import { useLocationStatus } from "../../components/mycomponents/CurrentComponent/useLocationStatus";
import { useAppContext } from "../../lib/AppContext";
import hasArrived, { getDistanceMeters } from "../../lib/hasArived";
import { normalize } from "../../lib/normalize";

// ─── Main Screen ─────────────────────────────────────────────────────────────
function Current() {
  const { ordersData, isOnline } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [hasArrivedToCurrent, setHasArrivedToCurrent] = useState(false);
  const hasSortedRef = useRef(false);
  // Custom hook to check location permission and GPS status
  const { status: locationStatus, currentLocation } = useLocationStatus();

  // Initialize orders from props (simulate fetching from API)
  useEffect(() => {
    let filtered = ordersData.filter((o) =>
      ["picking_up", "ready", "on_the_way", "out_for_delivery"].includes(o.status),
    );
    setOrders(filtered);
  }, [ordersData]);

  // Find nearest order based on current location
  useEffect(() => {
    if (!currentLocation || orders.length === 0) {
      setCurrentOrder(null);
      return;
    }

    let nearest = null;
    let minDistance = Infinity;

    orders.forEach((order) => {
      console.log("Calculating distance to order:", order.deliveryAddress[0]?.coordinates);
      const dist = getDistanceMeters(currentLocation, {
        lat: order.deliveryAddress[0]?.coordinates[0],
        lng: order.deliveryAddress[0]?.coordinates[1],
      });

      if (dist < minDistance) {
        minDistance = dist;
        nearest = order;
      }
    });

    setCurrentOrder(nearest);
  }, [currentLocation, orders]);

  // Sort orders by distance to current location (only once when location or orders change)
  useEffect(() => {
    if (!currentLocation || orders.length === 0) return;

    if (hasSortedRef.current) return; // already sorted once

    const sorted = [...orders].sort((a, b) => {
      const distA = getDistanceMeters(currentLocation, a.deliveryAddress[0]?.coordinates);
      const distB = getDistanceMeters(currentLocation, b.deliveryAddress[0]?.coordinates);
      return distA - distB;
    });

    setSortedOrders(sorted);

    hasSortedRef.current = true; // lock it
  }, [currentLocation, orders]);

  // Check if arrived to current order's delivery location
  useEffect(() => {
    const isArrived = hasArrived(currentLocation, {
      lat: currentOrder?.deliveryAddress[0]?.coordinates[0],
      lng: currentOrder?.deliveryAddress[0]?.coordinates[1],
    });
    setHasArrivedToCurrent(isArrived);
  }, [currentLocation, currentOrder]);

  // Handle marking order as delivered
  const handleDelivered = (_id) => {
    const updated = orders.filter((o) => o._id !== _id);
    setOrders(updated);

    hasSortedRef.current = false; // unlock sorting
  };

  // Guard against offline status
  if (!isOnline) {
    return <OfflinePlaceholder />;
  }
  // Guard against location issues
  if (locationStatus === "checking") {
    return null;
  }
  // Guard against no permission or GPS off
  if (locationStatus === "no-permission") {
    return (
      <NoPermissonPlaceholder />
    );
  }
  // Guard against GPS off
  if (locationStatus === "gps-off") {
    return (
      <GPSOffPlaceholder />
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: normalize(100),
        paddingTop: normalize(24),
      }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(20),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: normalize(10),
            }}
          >
            <View
              style={{
                width: normalize(4),
                height: normalize(20),
                borderRadius: normalize(2),
                backgroundColor: "#f59e0b",
              }}
            />
            <Text
              style={{
                fontSize: normalize(21),
                color: "#f4f4f5",
                fontWeight: "800",
                letterSpacing: -0.5,
              }}
            >
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
              <View
                style={{
                  width: normalize(6),
                  height: normalize(6),
                  borderRadius: normalize(3),
                  backgroundColor: "#f59e0b",
                }}
              />
              <Text
                style={{
                  fontSize: normalize(12),
                  color: "#f59e0b",
                  fontWeight: "700",
                }}
              >
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
          <View
            style={{
              marginTop: normalize(40),
              alignItems: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: normalize(100),
            }}
          >
            <Text
              style={{
                color: "#71717a",
                fontSize: normalize(13),
                textAlign: "center",
                marginTop: normalize(40),
              }}
            >
              Sorting orders based on your location...
            </Text>
            <ActivityIndicator size="large" color="#f59e0b" />
          </View>
        ) : (
          sortedOrders.map((o, i) => (
            <OrderCard
              key={o._id}
              ordersData={o}
              index={i}
              hasArrivedToCurrent={hasArrivedToCurrent}
              handleDelivered={handleDelivered}
            />
          ))
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

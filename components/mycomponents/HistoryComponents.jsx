import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import getTimeAndDate from "../../lib/getTimeAndDate";
import getTimeDiffrence from "../../lib/getTimeDiffrence";
import { formatDistance, getDistanceMeters } from "../../lib/hasArived";
import { normalize } from "../../lib/normalize";


const STATUS_CONFIG = {
    delivered: { label: "Delivered", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", icon: "check-circle" },
    out_for_delivery: { label: "Out for Delivery", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", icon: "truck" },
    picking_up: { label: "Picking Up", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", icon: "package" },
    cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", icon: "x-circle" },
};

// ─── History Card ────────────────────────────────────────────────────────────
export const HistoryCard = ({ order, index }) => {

    const anim = useRef(new Animated.Value(0)).current;
    const [expanded, setExpanded] = useState(false);
    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.delivered;
    const { time } = getTimeAndDate(order.createdAt);

    const safeId = (`ORDER-${order._id.slice(-6)}`).toUpperCase() || "Id";
    const safeTime = time || "Time";
    const safeCustomer = order.user?.fullName || "Customer";
    const safeAmount = order.totalAmount || "Amount";

    const shopLocation = {
        lat: order.shop.shopLocation.coordinates[1],
        lng: order.shop.shopLocation.coordinates[0],
    }
    const deliveryLocation = {
        lat: order.deliveryAddress[0]?.coordinates[0],
        lng: order.deliveryAddress[0]?.coordinates[1],
    }
    const distance = formatDistance(getDistanceMeters(shopLocation, deliveryLocation));
    const deliveryDuration = order?.deliveredAt ? getTimeDiffrence({ start: order.assignedAt, end: order.deliveredAt }).toFixed(0) + " mins" : "Cancelled";
    const payment = order.paymentMethod || "COD";

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
                        borderWidth: normalize(1),
                        borderColor: "#1e1f23",
                        borderRadius: normalize(16),
                        overflow: "hidden",
                    }}
                >
                    {/* Main Row */}
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: normalize(16), paddingVertical: normalize(14), gap: normalize(10) }}>
                        {/* Status Icon */}
                        <View
                            style={{
                                width: normalize(36),
                                height: normalize(36),
                                borderRadius: normalize(12),
                                backgroundColor: status.bg,
                                borderWidth: normalize(1),
                                borderColor: status.border,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: normalize(12),
                            }}
                        >
                            <Feather name={status.icon} size={normalize(16)} color={status.color} />
                        </View>

                        {/* Order info */}
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(6) }}>
                                <Text style={{ fontSize: normalize(14), color: "#f0f0f0", fontWeight: "700" }}>{safeId}</Text>
                                <View style={{ width: normalize(3), height: normalize(3), borderRadius: normalize(2), backgroundColor: "#3f3f46" }} />
                                <Text style={{ fontSize: normalize(11), color: "#52525b", fontWeight: "500" }}>{safeTime}</Text>
                            </View>
                            <Text style={{ fontSize: normalize(12), color: "#71717a", fontWeight: "500", marginTop: normalize(2) }}>{safeCustomer}</Text>
                        </View>

                        {/* Amount + chevron */}
                        <View style={{ alignItems: "flex-end", flexDirection: "row", gap: normalize(8) }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: normalize(2) }}>
                                <MaterialIcons name="currency-rupee" size={normalize(15)} color="#f0f0f0" />
                                <Text style={{ fontSize: normalize(15), color: "#f0f0f0", fontWeight: "800" }}>{safeAmount}</Text>
                            </View>
                            <Feather name={expanded ? "chevron-up" : "chevron-down"} size={normalize(16)} color="#52525b" />
                        </View>
                    </View>

                    {/* Expanded Details */}
                    {expanded && (
                        <View>
                            <View style={{ height: normalize(1), backgroundColor: "#1e1f23", marginHorizontal: normalize(16) }} />

                            {/* Locations */}
                            <View style={{ paddingHorizontal: normalize(16), paddingVertical: normalize(14), gap: normalize(10) }}>
                                {/* Pickup */}
                                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: normalize(10) }}>
                                    <View style={{ width: normalize(20), height: normalize(20), borderRadius: normalize(10), backgroundColor: "rgba(34,197,94,0.1)", borderWidth: normalize(1), borderColor: "rgba(34,197,94,0.2)", alignItems: "center", justifyContent: "center", marginTop: normalize(1) }}>
                                        <View style={{ width: normalize(5), height: normalize(5), borderRadius: normalize(3), backgroundColor: "#22c55e" }} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: normalize(10), color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: normalize(0.8), marginBottom: normalize(1) }}>Pickup</Text>
                                        <Text style={{ fontSize: normalize(13), color: "#e4e4e7", fontWeight: "600" }}>{order?.shop?.name}</Text>
                                        <Text style={{ fontSize: normalize(11), color: "#52525b", marginTop: normalize(1) }}>{order?.shop?.shopLocation?.formattedAddress}</Text>
                                    </View>
                                </View>

                                {/* Connector */}
                                <View style={{ marginLeft: normalize(9), width: normalize(1), height: normalize(6), backgroundColor: "#1e1f23" }} />

                                {/* Delivery */}
                                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: normalize(10) }}>
                                    <View style={{ width: normalize(20), height: normalize(20), borderRadius: normalize(10), backgroundColor: "rgba(239,68,68,0.1)", borderWidth: normalize(1), borderColor: "rgba(239,68,68,0.2)", alignItems: "center", justifyContent: "center", marginTop: normalize(1) }}>
                                        <View style={{ width: normalize(5), height: normalize(5), borderRadius: normalize(3), backgroundColor: "#ef4444" }} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: normalize(10), color: "#52525b", fontWeight: "600", textTransform: "uppercase", letterSpacing: normalize(0.8), marginBottom: normalize(1) }}>Delivery</Text>
                                        <Text style={{ fontSize: normalize(13), color: "#e4e4e7", fontWeight: "600" }}>{order?.deliveryAddress[0]?.formattedAddress || "Delivery Address"}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ height: normalize(1), backgroundColor: "#1e1f23", marginHorizontal: normalize(16) }} />

                            {/* Info chips */}
                            <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: normalize(16), paddingVertical: normalize(12), gap: normalize(8) }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4), backgroundColor: "#1e1f23", borderRadius: normalize(8), paddingHorizontal: normalize(8), paddingVertical: normalize(5) }}>
                                    <MaterialCommunityIcons name="map-marker-distance" size={normalize(12)} color="#71717a" />
                                    <Text style={{ fontSize: normalize(11), color: "#a1a1aa", fontWeight: "600" }}>{distance || "Distance"}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4), backgroundColor: "#1e1f23", borderRadius: normalize(8), paddingHorizontal: normalize(8), paddingVertical: normalize(5) }}>
                                    <Feather name="clock" size={normalize(11)} color="#71717a" />
                                    <Text style={{ fontSize: normalize(11), color: "#a1a1aa", fontWeight: "600" }}>{deliveryDuration || "Duration"}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4), backgroundColor: "#1e1f23", borderRadius: normalize(8), paddingHorizontal: normalize(8), paddingVertical: normalize(5) }}>
                                    <MaterialCommunityIcons name="cash" size={normalize(13)} color="#71717a" />
                                    <Text style={{ fontSize: normalize(11), color: "#a1a1aa", fontWeight: "600" }}>{payment || "Payment"}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(4), backgroundColor: "#1e1f23", borderRadius: normalize(8), paddingHorizontal: normalize(8), paddingVertical: normalize(5) }}>
                                    <MaterialCommunityIcons name="package-variant" size={normalize(12)} color="#71717a" />
                                    <Text style={{ fontSize: normalize(11), color: "#a1a1aa", fontWeight: "600" }}>{order?.orderItems?.length || 0} items</Text>
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
export const EmptyHistory = () => {
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
                    borderRadius: normalize(20),
                    paddingVertical: normalize(56),
                    paddingHorizontal: normalize(32),
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: normalize(72),
                        height: normalize(72),
                        borderRadius: normalize(22),
                        backgroundColor: "rgba(212,168,67,0.08)",
                        borderWidth: 1,
                        borderColor: "rgba(212,168,67,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: normalize(22),
                    }}
                >
                    <Feather name="archive" size={normalize(32)} color="#d4a843" />
                </View>

                <Text style={{ fontSize: normalize(17), fontWeight: "800", color: "#f0f0f0", textAlign: "center", marginBottom: 8 }}>
                    No Delivery History
                </Text>
                <Text style={{ fontSize: normalize(13), color: "#52525b", textAlign: "center", lineHeight: 20, fontWeight: "500", maxWidth: 240 }}>
                    Your completed and cancelled deliveries will appear here.
                </Text>

                <View style={{ marginTop: 24, width: normalize(40), height: normalize(3), borderRadius: normalize(2), backgroundColor: "rgba(212,168,67,0.25)" }} />
            </View>
        </Animated.View>
    );
}
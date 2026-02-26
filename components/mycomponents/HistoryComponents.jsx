import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import getTimeAndDate from "../../lib/getTimeAndDate";


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

    const safeId = (order._id) || "Id";
    const safeTime = time || "Time";
    const safeCustomer = order.user?.fullName || "Customer";
    const safeAmount = order.totalAmount || "Amount";

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
                                <Text style={{ fontSize: 14, color: "#f0f0f0", fontWeight: "700" }}>{safeId}</Text>
                                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: "#3f3f46" }} />
                                <Text style={{ fontSize: 11, color: "#52525b", fontWeight: "500" }}>{safeTime}</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: "#71717a", fontWeight: "500", marginTop: 2 }}>{safeCustomer}</Text>
                        </View>

                        {/* Amount + chevron */}
                        <View style={{ alignItems: "flex-end", flexDirection: "row", gap: 8 }}>
                            <Text style={{ fontSize: 15, color: "#f0f0f0", fontWeight: "800" }}>{safeAmount}</Text>
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
                                        <Text style={{ fontSize: 13, color: "#e4e4e7", fontWeight: "600" }}>{order?.shop?.name}</Text>
                                        <Text style={{ fontSize: 11, color: "#52525b", marginTop: 1 }}>{order?.shop?.shopLocation?.formattedAddress}</Text>
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
                                        <Text style={{ fontSize: 13, color: "#e4e4e7", fontWeight: "600" }}>{order?.deliveryAddress[0]?.formattedAddress || "Delivery Address"}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: "#1e1f23", marginHorizontal: 16 }} />

                            {/* Info chips */}
                            <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1e1f23", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
                                    <MaterialCommunityIcons name="map-marker-distance" size={12} color="#71717a" />
                                    <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600" }}>{order.distance || "Distance"}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1e1f23", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
                                    <Feather name="clock" size={11} color="#71717a" />
                                    <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600" }}>{order.duration || "Duration"}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1e1f23", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
                                    <MaterialCommunityIcons name="cash" size={13} color="#71717a" />
                                    <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600" }}>{order.payment || "Payment"}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#1e1f23", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
                                    <MaterialCommunityIcons name="package-variant" size={12} color="#71717a" />
                                    <Text style={{ fontSize: 11, color: "#a1a1aa", fontWeight: "600" }}>{order.items || "Items"} items</Text>
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
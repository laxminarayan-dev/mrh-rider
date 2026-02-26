import getTimeDiffrence from "@/lib/getTimeDiffrence";
import {
    Feather,
    FontAwesome5,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getOrdersByStatus, getWeeklyData } from "../../lib/getOrderData";
import getTimeAndDate from "../../lib/getTimeAndDate";

const GOLD = "#d4a843";
const GOLD_DIM = "rgba(212,168,67,0.12)";
const GOLD_BORDER = "rgba(212,168,67,0.2)";
const CARD_BG = "#111214";
const BORDER = "#1e1f23";

// ─── Pulse Ring component ───────────────────────────────────────────────────
export function PulseRing({ color = "#d4a843", delay = 0 }) {
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(scale, {
                        toValue: 1.5,
                        duration: 2200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 0.8,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 2200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.4,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <Animated.View
            style={{
                position: "absolute",
                width: 52,
                height: 52,
                borderRadius: 26,
                borderWidth: 1.5,
                borderColor: color,
                opacity,
                transform: [{ scale }],
            }}
        />
    );
}

// ─── Hero Welcome Card ───────────────────────────────────────────────────────
export function WelcomeCard({ isOnline = false, onToggleOnline = () => { } }) {
    const anim = useRef(new Animated.Value(0)).current;
    const [isConfirmationModelVisible, setConfirmationModelVisible] = useState(false);

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
            delay: 100,
        }).start();
    }, []);

    return (
        <>
            <Animated.View
                style={{
                    opacity: anim,
                    transform: [
                        { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
                    ],
                    marginHorizontal: 20,
                    marginBottom: 24,
                    borderRadius: 20,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 10,
                }}
            >
                <View style={{ backgroundColor: "#111214", borderWidth: 1, borderColor: "#1e1f23", borderRadius: 20, padding: 22 }}>

                    {/* Subtle accent line at top */}
                    <View style={{ position: "absolute", top: 0, left: 24, right: 24, height: 1, backgroundColor: "rgba(212,168,67,0.15)" }} />

                    {/* Avatar + Name row */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                        <View style={{ position: "relative", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                            <PulseRing color="#d4a843" delay={0} />
                            <PulseRing color="#d4a843" delay={600} />
                            <View
                                style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 26,
                                    backgroundColor: "rgba(212,168,67,0.1)",
                                    borderWidth: 1.5,
                                    borderColor: "rgba(212,168,67,0.25)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <FontAwesome5 name="user-alt" size={20} color="#d4a843" />
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, color: "#d4a843", fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>
                                Welcome back
                            </Text>
                            <Text style={{ fontSize: 22, color: "#f0f0f0", fontWeight: "800", letterSpacing: -0.3 }}>
                                Lucky Jaiswal
                            </Text>
                        </View>

                        {/* Online/Offline badge */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: isOnline ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", borderWidth: 1, borderColor: isOnline ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isOnline ? "#22c55e" : "#ef4444" }} />
                            <Text style={{ color: isOnline ? "#4ade80" : "#f87171", fontSize: 11, fontWeight: "600" }}>{isOnline ? "Online" : "Offline"}</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginBottom: 16 }} />

                    {/* Info text */}
                    <Text style={{ color: "#71717a", fontSize: 13, lineHeight: 20, fontWeight: "500", marginBottom: 18 }}>
                        Your admin will assign deliveries and they'll appear here. Stay ready to earn!
                    </Text>

                    {/* CTA */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            borderRadius: 14,
                            paddingVertical: 13,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            backgroundColor: !isOnline ? "#22c55e" : "#ef4444",
                        }}
                        onPress={() => { setConfirmationModelVisible(true) }}
                    >
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "rgba(255,255,255,0.9)",
                            }}
                        />
                        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14, letterSpacing: 0.5 }}>
                            GO {isOnline ? "OFFLINE" : "ONLINE"}
                        </Text>
                        <Feather name="radio" size={15} color="rgba(255,255,255,0.85)" />
                    </TouchableOpacity>
                </View>

            </Animated.View>

            {/* Confirmation Modal */}

            {isConfirmationModelVisible && <View style={{
                position: "absolute", top: -150, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
            }}>
                <View style={{
                    backgroundColor: "#111214",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#1e1f23",
                    padding: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 18,
                    width: "80%",
                }}>
                    <Text style={{ color: "#f0f0f0", fontSize: 17, fontWeight: "800", letterSpacing: -0.2 }}>
                        Are you sure?
                    </Text>
                    <Text style={{ color: "#71717a", fontSize: 13, lineHeight: 20, fontWeight: "500", textAlign: "center" }}>
                        Do you want to go {isOnline ? "offline" : "online"}? You won't receive new deliveries until you go back online.
                    </Text>
                    <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: "#1e1f23", paddingVertical: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#2a2b30" }}
                            onPress={() => setConfirmationModelVisible(false)}
                        >
                            <Text style={{ color: "#a1a1aa", fontWeight: "700", fontSize: 14 }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: "#d4a843", paddingVertical: 12, borderRadius: 12, alignItems: "center" }}
                            onPress={() => {
                                setConfirmationModelVisible(false);
                                onToggleOnline();
                            }}
                        >
                            <Text style={{ color: "#111214", fontWeight: "800", fontSize: 14 }}>Yes, {isOnline ? "Go Offline" : "Go Online"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>}

        </>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

export function StatCard({ ordersData }) {

    const avgMinutes = 24;
    const targetMinutes = 30;

    return (
        <View style={{ padding: 16, gap: 12 }}>
            {/* Full width — bar chart */}
            <WeeklyDeliveryCard
                data={ordersData}
                delay={0}
            />

            {/* Two half-width cards */}
            <View style={{ flexDirection: "row", gap: 12 }}>
                <ActiveOrdersCard data={ordersData} delay={100} />
                <AvgTimeCard data={ordersData} minutes={avgMinutes} targetMinutes={targetMinutes} delay={160} />
            </View>
        </View>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState() {
    const anim = useRef(new Animated.Value(0)).current;
    const float = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 45,
            friction: 8,
            delay: 300,
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
            }}
        >
            <View
                style={{
                    backgroundColor: "#111214",
                    borderWidth: 1,
                    borderColor: "#1e1f23",
                    borderRadius: 20,
                    paddingVertical: 48,
                    paddingHorizontal: 32,
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                {/* Floating icon */}
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
                        <MaterialCommunityIcons name="package-variant-closed" size={34} color="#d4a843" />
                    </View>
                </Animated.View>

                <Text style={{ fontSize: 17, fontWeight: "800", color: "#f0f0f0", textAlign: "center", marginBottom: 8, letterSpacing: -0.2 }}>
                    No Orders Yet
                </Text>
                <Text style={{ fontSize: 13, color: "#52525b", textAlign: "center", lineHeight: 20, fontWeight: "500", maxWidth: 240 }}>
                    Your admin will assign deliveries shortly. They'll appear here once ready.
                </Text>

                {/* Minimal accent bar */}
                <View
                    style={{
                        marginTop: 24,
                        width: 40,
                        height: 3,
                        borderRadius: 2,
                        backgroundColor: "rgba(212,168,67,0.25)",
                    }}
                />
            </View>
        </Animated.View>
    );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
export function OrderRow({ item, index, last }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 55,
            friction: 9,
            delay: index * 80 + 300,
        }).start();
    }, []);
    if (item.status === "out_for_delivery" || item.status === "assigned") {
        return null;
    }
    const { date, time } = getTimeAndDate(item?.deliveredAt);
    // Guard: ensure these are always strings before rendering
    const safeDate = date && date !== "Invalid Date" ? date : null;
    const safeTime = time && time !== "Invalid Date" ? String(time).toUpperCase() : null;
    const safeAmount = item?.totalAmount != null ? String(item.totalAmount) : "—";
    const safeCustomer = item?.user?.fullName ?? "Unknown";
    const safeAddress = item?.deliveryAddress[0]?.formattedAddress ?? "—";

    const isDelivered = item?.status === "delivered";
    const statusLabel = isDelivered
        ? safeDate && safeTime
            ? `Delivered at ${safeDate} · ${safeTime}`
            : "Delivered"
        : "Cancelled by Customer";

    return (
        <Animated.View
            style={{
                opacity: anim,
                transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    borderBottomWidth: last ? 0 : 1,
                    borderBottomColor: "#1e1f23",
                }}
            >
                {/* Index badge */}
                <View
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: "rgba(212,168,67,0.08)",
                        borderWidth: 1,
                        borderColor: "rgba(212,168,67,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 14,
                    }}
                >
                    <Text style={{ fontSize: 11, fontWeight: "800", color: "#d4a843" }}>
                        #{index + 1}
                    </Text>
                </View>

                {/* Customer + address */}
                <View style={{ flex: 1 }}>
                    <Text style={{ color: "#e4e4e7", fontWeight: "700", fontSize: 14 }}>
                        {safeCustomer}
                    </Text>
                    <Text style={{ color: "#52525b", fontSize: 12, marginTop: 2 }}>
                        {safeAddress}
                    </Text>
                </View>

                {/* Amount + status */}
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "#f0f0f0", fontWeight: "800", fontSize: 15 }}>
                        {safeAmount}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginTop: 3, justifyContent: "flex-end" }}>
                        <View style={{
                            width: 5,
                            height: 5,
                            borderRadius: 3,
                            backgroundColor: isDelivered ? "#22c55e" : "#f87171",
                        }} />
                        <Text style={{
                            color: isDelivered ? "#22c55e" : "#f87171",
                            fontSize: 11,
                            fontWeight: "500",
                        }}>
                            {statusLabel}
                        </Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}

export function NewOrderPopup({ visible = false, onClose = () => { } }) {
    return (
        <>
            {visible && <View style={{
                position: "absolute", top: -150, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
            }}>
                <View style={{
                    backgroundColor: "#111214",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#1e1f23",
                    padding: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 18,
                    width: "80%",
                }}>
                    <Text style={{ color: "#f0f0f0", fontSize: 17, fontWeight: "800", letterSpacing: -0.2 }}>
                        New Delivery Assigned!
                    </Text>
                    <Text style={{ color: "#71717a", fontSize: 13, lineHeight: 20, fontWeight: "500", textAlign: "center" }}>
                        You have a new delivery assigned. Please check your orders list and get ready to pick it up.
                    </Text>
                    <TouchableOpacity
                        style={{ backgroundColor: "#d4a843", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" }}
                        onPress={onClose}
                    >
                        <Text style={{ color: "#111214", fontWeight: "800", fontSize: 14 }}>View Orders</Text>
                    </TouchableOpacity>
                </View>
            </View>}
        </>
    );
}

/* ─── FULL WIDTH — 7-day bar chart ─── */
export function WeeklyDeliveryCard({ data, delay = 0 }) {

    const [weeklyData, setWeeklyData] = useState(getWeeklyData(data));  // deliveries per of last 7 days, with day labels and isRecent flag

    useEffect(() => {
        setWeeklyData(getWeeklyData(data))  // deliveries per of last 7 days, with day labels and isRecent flag
    }, [data])

    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true, delay }).start();
    }, []);

    const maxBarHeight = Math.max(...weeklyData.map(d => d.count), 1); // max count for scaling bars, at least 1 to avoid division by zero
    const totalDeliveries = weeklyData.reduce((sum, d) => sum + d.count, 0);


    return (
        <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
            <View style={{ backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 20, padding: 20, overflow: "hidden" }}>

                {/* glow */}
                <View style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(212,168,67,0.04)" }} pointerEvents="none" />

                {/* header */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: GOLD_DIM, borderWidth: 1, borderColor: GOLD_BORDER, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                        <Feather name="bar-chart-2" size={16} color={GOLD} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: 1.4, fontWeight: "700" }}>Last 7 Days</Text>
                        <Text style={{ fontSize: 10, color: "#3f3f46", marginTop: 1 }}>Daily deliveries</Text>
                    </View>
                    <View style={{ marginLeft: "auto", alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 26, fontWeight: "800", color: "#f0f0f0", letterSpacing: -0.8, lineHeight: 28 }}>{totalDeliveries}</Text>
                        <Text style={{ fontSize: 9, color: GOLD, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 }}>Total</Text>
                    </View>
                </View>

                {/* thin divider */}
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.04)", marginVertical: 16 }} />

                {/* bars */}
                <View style={{ flexDirection: "row", gap: 4, alignItems: "flex-end" }}>
                    {weeklyData.map((data, i) => {
                        const CONTAINER_H = 110;
                        const fillRatio = maxBarHeight > 0 ? data.count / maxBarHeight : 0;
                        const barH = data.count === 0 ? 0 : Math.max(fillRatio * 72, data.count > 0 ? 6 : 0);

                        return data.count === 0 ? (
                            <View key={i} style={{ height: CONTAINER_H, flex: 1, alignItems: "center", gap: 6, borderColor: "rgba(212,168,67,0.10)", borderWidth: 1, borderStyle: "dashed", borderRadius: 8, paddingTop: 6 }}>
                                <Text style={{ fontSize: 10, fontWeight: "700", color: "#52525b" }}>0</Text>
                                <View style={{ width: "100%", height: 72, justifyContent: "flex-end", alignItems: "center" }}>
                                    <View style={{ width: "72%", height: 0, borderRadius: 8 }} />
                                </View>
                                <Text style={{ fontSize: 9, fontWeight: "700", color: "#52525b", textTransform: "uppercase", letterSpacing: 1, position: "absolute", bottom: -16 }}>{data.day}</Text>
                            </View>
                        ) : (
                            <View key={i} style={{ height: CONTAINER_H, flex: 1, alignItems: "center", gap: 6, borderColor: i === weeklyData.length - 1 ? "#f97316" : "#52525b", borderWidth: 1, borderStyle: "dashed", borderRadius: 8, paddingTop: 6 }}>
                                <Text style={{ fontSize: 10, fontWeight: "700", color: "#f0f0f0", letterSpacing: 0.4 }}>
                                    {data.count}
                                </Text>
                                <View style={{ width: "100%", height: 72, justifyContent: "flex-end", alignItems: "center", bottom: -6 }}>
                                    <View style={{
                                        width: "76%",
                                        height: barH,           // plain number, no animation — no native driver conflict
                                        borderRadius: 5,
                                        overflow: "hidden",
                                        backgroundColor: i === weeklyData.length - 1
                                            ? "#f97316"
                                            : `#ffffff70`,
                                    }} />

                                </View>
                                <Text style={{ fontSize: 9, fontWeight: "700", color: data.isRecent ? "#f97316" : "#52525b", textTransform: "uppercase", letterSpacing: 1, position: "absolute", bottom: -16 }}>
                                    {data.day}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Today tag */}
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 30 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#f97316" }} />
                        <Text style={{ fontSize: 9, color: "#52525b", letterSpacing: 0.8, fontWeight: "600", textTransform: "uppercase" }}>Today</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}

/* ─── HALF WIDTH — Active Orders ─── */
export function ActiveOrdersCard({ data, delay = 100 }) {
    const [count, setCount] = useState(0);  // count of active orders

    useEffect(() => {
        let c = getOrdersByStatus(data)?.out_for_delivery || getOrdersByStatus(data)?.ready || [];
        setCount(c.length)
    }, [data])


    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 55, friction: 8, delay }).start();
    }, []);

    // small dot indicators
    const MAX_DOTS = 6;
    const dots = Array.from({ length: MAX_DOTS }, (_, i) => i < count);

    return (
        <Animated.View style={[{ flex: 1 }, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }, { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
            <View style={{ backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 20, padding: 18, minHeight: 160, overflow: "hidden" }}>

                {/* glow */}
                <View style={{ position: "absolute", bottom: -24, left: -24, width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(212,168,67,0.05)" }} pointerEvents="none" />

                {/* icon */}
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: GOLD_DIM, borderWidth: 1, borderColor: GOLD_BORDER, alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Feather name="package" size={15} color={GOLD} />
                </View>

                {/* value */}
                <Text style={{ fontSize: 42, fontWeight: "800", color: count > 0 ? "#f0f0f0" : "#3f3f46", letterSpacing: -1.5, lineHeight: 44 }}>
                    {count}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: "700", color: GOLD, textTransform: "uppercase", letterSpacing: 0.9, marginTop: 2, marginBottom: 12 }}>
                    Active
                </Text>

                {/* label */}
                <Text style={{ fontSize: 9, color: "#52525b", textTransform: "uppercase", letterSpacing: 1.3, fontWeight: "700", marginBottom: 14 }}>
                    Assigned Orders
                </Text>

                {/* dot indicators */}
                <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap", marginTop: "auto" }}>
                    {dots.map((active, i) => (
                        <View key={i} style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: active ? GOLD : "rgba(212,168,67,0.1)", borderWidth: 1, borderColor: active ? GOLD_BORDER : "rgba(255,255,255,0.04)" }} />
                    ))}
                </View>
            </View>
        </Animated.View>
    );
}

/* ─── HALF WIDTH — Avg Delivery Time ─── */
export function AvgTimeCard({ data, targetMinutes = 30, delay = 160 }) {

    const [avgMinutes, setAvgMinutes] = useState(0);

    useEffect(() => {
        let deliveredOrders = getOrdersByStatus(data)?.delivered || [];
        if (deliveredOrders.length > 0) {
            const totalMinutes = Math.round(deliveredOrders.reduce((sum, order) => sum + getTimeDiffrence({ end: order?.deliveredAt || "2026-02-23T04:21:57.000Z", start: order?.assignedAt || "2026-02-23T04:07:38.000Z" }), 0));
            setAvgMinutes(totalMinutes / deliveredOrders.length);
        }
    }, [data])


    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 55, friction: 8, delay }).start();
    }, []);

    const arcAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(arcAnim, { toValue: 1, duration: 900, useNativeDriver: false, delay: delay + 200 }).start();
    }, []);

    const isGood = avgMinutes <= targetMinutes;
    const ratio = Math.min(avgMinutes / (targetMinutes * 1.5), 1);
    const progressWidth = arcAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", `${ratio * 100}%`] });

    const display = avgMinutes >= 60
        ? `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}min`
        : `${avgMinutes.toFixed(2)}`;
    const unit = avgMinutes >= 60 ? "" : "min";

    return (
        <Animated.View style={[{ flex: 1 }, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }, { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
            <View style={{ backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, borderRadius: 20, padding: 18, minHeight: 160, overflow: "hidden" }}>

                {/* glow */}
                <View style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(212,168,67,0.05)" }} pointerEvents="none" />

                {/* icon */}
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: GOLD_DIM, borderWidth: 1, borderColor: GOLD_BORDER, alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Feather name="clock" size={15} color={GOLD} />
                </View>

                {/* value */}
                <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 3 }}>
                    <Text style={{ fontSize: 42, fontWeight: "800", color: "#f0f0f0", letterSpacing: -1.5, lineHeight: 44 }}>
                        {display}
                    </Text>
                    {unit ? <Text style={{ fontSize: 10, fontWeight: "700", color: GOLD, textTransform: "uppercase", letterSpacing: 0.9, marginBottom: 6 }}>{unit}</Text> : null}
                </View>

                {/* label */}
                <Text style={{ fontSize: 9, color: "#52525b", textTransform: "uppercase", letterSpacing: 1.3, fontWeight: "700", marginTop: 2, marginBottom: 14 }}>
                    Avg Delivery
                </Text>

                {/* progress bar vs target */}
                <View style={{ marginTop: "auto" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                        <Text style={{ fontSize: 8, color: "#3f3f46", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>vs target</Text>
                        <Text style={{ fontSize: 8, color: isGood ? "#4ade80" : "#f87171", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 }}>
                            {isGood ? `${targetMinutes - avgMinutes}m under` : `${avgMinutes - targetMinutes}m over`}
                        </Text>
                    </View>
                    <View style={{ height: 4, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                        <Animated.View style={{ height: "100%", width: progressWidth, borderRadius: 2, backgroundColor: isGood ? "rgba(74,222,128,0.6)" : "rgba(248,113,113,0.6)" }} />
                    </View>
                    <Text style={{ fontSize: 8, color: "#3f3f46", marginTop: 4, fontWeight: "600" }}>Target: {targetMinutes} min</Text>
                </View>
            </View>
        </Animated.View>
    );
}
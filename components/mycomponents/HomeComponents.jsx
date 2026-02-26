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
export function StatCard({ label, value, unit, icon, color, bg, border, delay }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 55,
            friction: 8,
            delay,
        }).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: anim,
                transform: [
                    { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                ],
                flex: 1,
            }}
        >
            <View
                style={{
                    backgroundColor: "#111214",
                    borderWidth: 1,
                    borderColor: "#1e1f23",
                    borderRadius: 16,
                    padding: 16,
                }}
            >
                {/* Icon */}
                <View
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: "rgba(212,168,67,0.08)",
                        borderWidth: 1,
                        borderColor: "rgba(212,168,67,0.15)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                    }}
                >
                    <Feather name={icon} size={16} color="#d4a843" />
                </View>

                {/* Value */}
                <Text style={{ fontSize: 32, fontWeight: "800", color: "#f0f0f0", letterSpacing: -0.5, lineHeight: 36 }}>
                    {value}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: "600", color: "#d4a843", marginTop: 2, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {unit}
                </Text>

                {/* Divider */}
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.04)", marginBottom: 10 }} />

                <Text style={{ fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: "600" }}>
                    {label}
                </Text>
            </View>
        </Animated.View>
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
                    <Text style={{ fontSize: 11, fontWeight: "800", color: "#d4a843" }}>#{index + 1}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{ color: "#e4e4e7", fontWeight: "700", fontSize: 14 }}>{item.customer}</Text>
                    <Text style={{ color: "#52525b", fontSize: 12, marginTop: 2 }}>{item.address}</Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "#f0f0f0", fontWeight: "800", fontSize: 15 }}>{item.amount}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
                        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: "#22c55e" }} />
                        <Text style={{ color: "#52525b", fontSize: 11 }}>{item.time}</Text>
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
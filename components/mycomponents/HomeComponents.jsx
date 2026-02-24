import { useEffect, useRef } from "react";
import {
    Animated,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import {
    MaterialCommunityIcons,
    FontAwesome5,
    Feather,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// ─── Pulse Ring component ───────────────────────────────────────────────────
export function PulseRing({ color = "#fbbf24", delay = 0 }) {
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(scale, {
                        toValue: 1.6,
                        duration: 1800,
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
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.6,
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
                width: 56,
                height: 56,
                borderRadius: 28,
                borderWidth: 2,
                borderColor: color,
                opacity,
                transform: [{ scale }],
            }}
        />
    );
}

// ─── Hero Welcome Card ───────────────────────────────────────────────────────
export function WelcomeCard() {
    const router = useRouter();
    const anim = useRef(new Animated.Value(0)).current;
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
            delay: 100,
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(shimmer, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: anim,
                transform: [
                    { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
                ],
                marginHorizontal: 20,
                marginBottom: 28,
                borderRadius: 28,
                overflow: "hidden",
                shadowColor: "#6366f1",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 12,
            }}
        >
            <LinearGradient
                colors={["#1a202c", "#2d3748", "#1a202c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 24 }}
            >
                {/* Decorative circle top-right */}
                <View
                    style={{
                        position: "absolute",
                        top: -30,
                        right: -30,
                        width: 130,
                        height: 130,
                        borderRadius: 65,
                        backgroundColor: "rgba(129,140,248,0.08)",
                        borderWidth: 1,
                        borderColor: "rgba(129,140,248,0.12)",
                    }}
                />
                <View
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: "rgba(251,191,36,0.06)",
                    }}
                />

                {/* Avatar + Name row */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <View style={{ position: "relative", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                        <PulseRing color="#fbbf24" delay={0} />
                        <PulseRing color="#fbbf24" delay={600} />
                        <View
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                backgroundColor: "rgba(99,102,241,0.25)",
                                borderWidth: 2,
                                borderColor: "rgba(129,140,248,0.5)",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesome5 name="user-alt" size={22} color="#c7d2fe" />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 10, color: "#fbbf24", fontWeight: "800", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 4 }}>
                            Welcome back
                        </Text>
                        <Text style={{ fontSize: 26, color: "#fff", fontWeight: "900", letterSpacing: -0.5 }}>
                            Lucky Jaiswal
                        </Text>
                    </View>

                    {/* Online badge */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(34,197,94,0.15)", borderWidth: 1, borderColor: "rgba(34,197,94,0.3)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e" }} />
                        <Text style={{ color: "#4ade80", fontSize: 11, fontWeight: "700" }}>Online</Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: 18 }} />

                {/* Info text */}
                <Text style={{ color: "#a5b4fc", fontSize: 13, lineHeight: 20, fontWeight: "500", marginBottom: 20 }}>
                    Your admin will assign deliveries and they'll appear here. Stay ready to earn!
                </Text>

                {/* CTA */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{
                        backgroundColor: "#fbbf24",
                        borderRadius: 16,
                        paddingVertical: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                    onPress={() => router.push("/current")}
                >
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 15, letterSpacing: 0.2 }}>
                        View My Orders
                    </Text>
                    <Feather name="arrow-right" size={16} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
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
                    { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
                ],
                flex: 1,
            }}
        >
            <View
                style={{
                    backgroundColor: bg,
                    borderWidth: 1,
                    borderColor: border,
                    borderRadius: 22,
                    padding: 18,
                }}
            >
                {/* Icon */}
                <View
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: `${color}18`,
                        borderWidth: 1,
                        borderColor: `${color}35`,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 14,
                    }}
                >
                    <Feather name={icon} size={18} color={color} />
                </View>

                {/* Value */}
                <Text style={{ fontSize: 36, fontWeight: "900", color: "#fff", letterSpacing: -1, lineHeight: 38 }}>
                    {value}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: "700", color, marginTop: 2, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                    {unit}
                </Text>

                {/* Divider */}
                <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginBottom: 10 }} />

                <Text style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: "700" }}>
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
                Animated.timing(float, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(float, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: anim,
                transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }],
            }}
        >
            <View
                style={{
                    backgroundColor: "#0f0f11",
                    borderWidth: 1,
                    borderColor: "#27272a",
                    borderRadius: 28,
                    paddingVertical: 52,
                    paddingHorizontal: 32,
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                {/* Background grid pattern */}
                <View
                    style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        opacity: 0.04,
                    }}
                >
                    {Array.from({ length: 6 }).map((_, row) =>
                        Array.from({ length: 6 }).map((_, col) => (
                            <View
                                key={`${row}-${col}`}
                                style={{
                                    position: "absolute",
                                    width: 1,
                                    height: "100%",
                                    backgroundColor: "gold",
                                    left: col * (width / 5),
                                }}
                            />
                        ))
                    )}
                </View>

                {/* Floating icon */}
                <Animated.View
                    style={{
                        transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
                        marginBottom: 24,
                    }}
                >
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 28,
                            backgroundColor: "#1e1b4b",
                            borderWidth: 1.5,
                            borderColor: "#4b5563",
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#fbbf24",
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.4,
                            shadowRadius: 16,
                        }}
                    >
                        <MaterialCommunityIcons name="package-variant-closed" size={38} color="#fbbf24" />
                    </View>
                </Animated.View>

                <Text style={{ fontSize: 18, fontWeight: "900", color: "#fff", textAlign: "center", marginBottom: 10, letterSpacing: -0.3 }}>
                    No Orders Yet
                </Text>
                <Text style={{ fontSize: 13, color: "#52525b", textAlign: "center", lineHeight: 20, fontWeight: "500", maxWidth: 240 }}>
                    Your admin will assign deliveries shortly. They'll appear here once ready.
                </Text>

                {/* Dotted border accent at bottom */}
                <View
                    style={{
                        marginTop: 28,
                        flexDirection: "row",
                        gap: 6,
                        alignItems: "center",
                    }}
                >
                    {Array.from({ length: 5 }).map((_, i) => (
                        <View
                            key={i}
                            style={{
                                width: i === 2 ? 24 : 6,
                                height: 3,
                                borderRadius: 2,
                                backgroundColor: i === 2 ? "#fbbf24" : "#27272a",
                            }}
                        />
                    ))}
                </View>
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
                transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: last ? 0 : 1,
                    borderBottomColor: "#1c1c1e",
                }}
            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        backgroundColor: "#1e1b4b",
                        borderWidth: 1,
                        borderColor: "#3730a3",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 14,
                    }}
                >
                    <Text style={{ fontSize: 11, fontWeight: "900", color: "#fbbf24" }}>#{index + 1}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{item.customer}</Text>
                    <Text style={{ color: "#52525b", fontSize: 12, marginTop: 2 }}>{item.address}</Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>{item.amount}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
                        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: "#22c55e" }} />
                        <Text style={{ color: "#52525b", fontSize: 11 }}>{item.time}</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}
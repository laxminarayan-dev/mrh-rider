import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Linking, Pressable, Text,
    TouchableOpacity,
    View
} from "react-native";
import getTimeAndDate from "../../../lib/getTimeAndDate";
import { formatDistance, getDistanceMeters } from "../../../lib/hasArived";
import { normalize } from "../../../lib/normalize";
import openGoogleMaps from "../OpenGoogleMap";

const STATUS_CONFIG = {
    picking_up: {
        label: "Picking Up",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.25)",
        icon: "package",
        dot: "#f59e0b",
    },
    ready: {
        label: "Ready",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.25)",
        icon: "package",
        dot: "#f59e0b",
    },
    on_the_way: {
        label: "On the Way",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.25)",
        icon: "navigation",
        dot: "#22c55e",
    },
    out_for_delivery: {
        label: "Out for Delivery",
        color: "#22c55e",
        bg: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.25)",
        icon: "navigation",
        dot: "#22c55e",
    },
    arrived: {
        label: "Arrived",
        color: "#60a5fa",
        bg: "rgba(96,165,250,0.12)",
        border: "rgba(96,165,250,0.25)",
        icon: "map-pin",
        dot: "#60a5fa",
    },
    delivered: {
        label: "Delivered",
        color: "#6b7280",
        bg: "rgba(107,114,128,0.12)",
        border: "rgba(107,114,128,0.25)",
        icon: "check-circle",
        dot: "#6b7280",
    },
};

// ─── Pill Badge ───────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.picking_up;
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (status === "on_the_way" || status === "out_for_delivery") {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulse, {
                        toValue: 1.5,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulse, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
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
            <Text
                style={{
                    color: cfg.color,
                    fontSize: normalize(11),
                    fontWeight: "700",
                    letterSpacing: 0.3,
                }}
            >
                {cfg.label}
            </Text>
        </View>
    );
}

// ─── Info Chip ────────────────────────────────────────────────────────────────
export function InfoChip({ iconLib, icon, label, iconSize = 12 }) {
    const Icon = iconLib === "mci" ? MaterialCommunityIcons : Feather;
    return (
        <View
            style={{ flexDirection: "row", alignItems: "center", gap: normalize(4) }}
        >
            <Icon name={icon} size={normalize(iconSize)} color="#3f3f46" />
            <Text
                style={{ fontSize: normalize(12), color: "#71717a", fontWeight: "600" }}
            >
                {label}
            </Text>
        </View>
    );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider = () => (
    <View
        style={{
            height: 1,
            backgroundColor: "#18181b",
            marginHorizontal: normalize(16),
        }}
    />
);

// ─── Order Card ──────────────────────────────────────────────────────────────
export function OrderCard({
    ordersData,
    index,
    hasArrivedToCurrent,
    handleDelivered,
}) {
    const anim = useRef(new Animated.Value(0)).current;
    const cfg = STATUS_CONFIG[ordersData.status] || STATUS_CONFIG.picking_up;
    const isActive = index === 0;
    const { time: placedAt } = getTimeAndDate(ordersData.createdAt)
    const shopLocation = {
        lat: ordersData.shop.shopLocation.coordinates[1],
        lng: ordersData.shop.shopLocation.coordinates[0],
    }
    const deliveryLocation = {
        lat: ordersData.deliveryAddress[0]?.coordinates[0],
        lng: ordersData.deliveryAddress[0]?.coordinates[1],
    }
    const distance = formatDistance(getDistanceMeters(shopLocation, deliveryLocation));

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
                    {
                        translateY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [normalize(24), 0],
                        }),
                    },
                    {
                        scale: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.97, 1],
                        }),
                    },
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
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: normalize(10),
                        }}
                    >
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
                            <MaterialCommunityIcons
                                name={cfg.icon}
                                size={normalize(19)}
                                color={cfg.color}
                            />
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    color: "#f4f4f5",
                                    fontWeight: "800",
                                    letterSpacing: 0.2,
                                }}
                            >
                                ORDER-{ordersData._id.slice(-6).toUpperCase()}
                            </Text>
                            <Text
                                style={{
                                    fontSize: normalize(11),
                                    color: "#3f3f46",
                                    marginTop: normalize(2),
                                }}
                            >
                                Placed at {placedAt.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                    <StatusBadge status={ordersData.status} />
                </View>

                <Divider />

                {/* Route */}
                <View
                    style={{
                        paddingHorizontal: normalize(16),
                        paddingVertical: normalize(14),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: normalize(12),
                        }}
                    >
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
                                <View
                                    style={{
                                        width: normalize(7),
                                        height: normalize(7),
                                        borderRadius: normalize(4),
                                        backgroundColor: "#22c55e",
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    width: 1.5,
                                    height: normalize(24),
                                    backgroundColor: "#27272a",
                                    marginTop: normalize(3),
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, paddingBottom: normalize(12) }}>
                            <Text
                                style={{
                                    fontSize: normalize(10),
                                    color: "#3f3f46",
                                    fontWeight: "700",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    marginBottom: normalize(3),
                                }}
                            >
                                Pickup
                            </Text>
                            <Text
                                style={{
                                    fontSize: normalize(13),
                                    color: "#e4e4e7",
                                    fontWeight: "700",
                                }}
                            >
                                {ordersData.shop.name}
                            </Text>
                            <Text
                                style={{
                                    fontSize: normalize(12),
                                    color: "#52525b",
                                    marginTop: normalize(2),
                                }}
                            >
                                {ordersData.shop?.shopLocation?.formattedAddress}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: normalize(12),
                        }}
                    >
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
                                <View
                                    style={{
                                        width: normalize(7),
                                        height: normalize(7),
                                        borderRadius: normalize(4),
                                        backgroundColor: "#ef4444",
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: normalize(10),
                                    color: "#3f3f46",
                                    fontWeight: "700",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    marginBottom: normalize(3),
                                }}
                            >
                                Delivery
                            </Text>
                            <Text
                                style={{
                                    fontSize: normalize(13),
                                    color: "#e4e4e7",
                                    fontWeight: "700",
                                }}
                            >
                                {ordersData.deliveryAddress[0]?.formattedAddress}
                            </Text>
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
                    <InfoChip
                        iconLib="feather"
                        icon="user"
                        label={ordersData.user.fullName}
                        iconSize={12}
                    />
                    <InfoChip
                        iconLib="mci"
                        icon="map-marker-distance"
                        label={distance || "N/A"}
                        iconSize={13}
                    />
                    <InfoChip
                        iconLib="mci"
                        icon="cash"
                        label={ordersData.paymentMethod === "Online" ? "Paid" : "COD"}
                        iconSize={14}
                    />
                    <View style={{
                        marginLeft: "auto",
                        flexDirection: "row",
                        gap: normalize(1),
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <MaterialIcons name="currency-rupee" size={normalize(14)} color="#f4f4f5" />
                        <Text
                            style={{
                                fontSize: normalize(15),
                                color: "#f4f4f5",
                                fontWeight: "800",

                            }}
                        >
                            {ordersData.totalAmount}
                        </Text>
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
                        <Text
                            style={{
                                color: "#a1a1aa",
                                fontSize: normalize(13),
                                fontWeight: "700",
                            }}
                        >
                            Call
                        </Text>
                    </TouchableOpacity>

                    {hasArrivedToCurrent ? (
                        <TouchableOpacity
                            onPress={() => handleDelivered(ordersData._id)}
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
                            <Text
                                style={{
                                    color: "#0a0a0b",
                                    fontSize: normalize(13),
                                    fontWeight: "800",
                                    letterSpacing: 0.2,
                                }}
                            >
                                Mark As Delivered
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                openGoogleMaps(
                                    { lat: ordersData.shop.shopLocation.coordinates[1], lng: ordersData.shop.shopLocation.coordinates[0] },
                                    {
                                        lat: ordersData.deliveryAddress[0]?.coordinates[0],
                                        lng: ordersData.deliveryAddress[0]?.coordinates[1],
                                    },
                                )
                            }
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
                            <Text
                                style={{
                                    color: "#0a0a0b",
                                    fontSize: normalize(13),
                                    fontWeight: "800",
                                    letterSpacing: 0.2,
                                }}
                            >
                                Navigate
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Animated.View>
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyCurrentOrders() {
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
                Animated.timing(float, {
                    toValue: 1,
                    duration: 2600,
                    useNativeDriver: true,
                }),
                Animated.timing(float, {
                    toValue: 0,
                    duration: 2600,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: anim,
                transform: [
                    {
                        scale: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.93, 1],
                        }),
                    },
                ],
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
                        transform: [
                            {
                                translateY: float.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, normalize(-8)],
                                }),
                            },
                        ],
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

                <Text
                    style={{
                        fontSize: normalize(18),
                        fontWeight: "800",
                        color: "#f4f4f5",
                        textAlign: "center",
                        marginBottom: normalize(8),
                        letterSpacing: -0.3,
                    }}
                >
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
                    When you accept a delivery, it will appear here with full details and
                    navigation.
                </Text>
                <View
                    style={{
                        marginTop: normalize(26),
                        width: normalize(36),
                        height: normalize(3),
                        borderRadius: normalize(2),
                        backgroundColor: "rgba(245,158,11,0.3)",
                    }}
                />
            </View>
        </Animated.View>
    );
}

export function OfflinePlaceholder({ setIsOnline }) {
    const router = useRouter();
    return (
        <View style={styles.offlineContainer}>
            <View style={styles.offlineCard}>
                <View style={styles.iconWrapper}>
                    <Feather name="wifi-off" size={normalize(32)} color="#ef4444" />
                </View>

                <Text style={styles.offlineTitle}>
                    You're Offline
                </Text>

                <Text style={styles.offlineSubtitle}>
                    Go online to start receiving live delivery orders.
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.goOnlineButton}
                    onPress={() => router.replace("/(tabs)")} // adjust to your logic
                >
                    <Text style={styles.goOnlineText}>Go Online</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export function NoPermissonPlaceholder() {
    return (
        <View style={styles.guardContainer}>
            <View style={styles.guardCard}>

                {/* Icon */}
                <View style={styles.iconWrapper}>
                    <Feather name="map-pin" size={32} color="#f59e0b" />
                </View>

                {/* Title */}
                <Text style={styles.guardTitle}>
                    Location Permission Required
                </Text>

                {/* Subtitle */}
                <Text style={styles.guardSubtitle}>
                    We need your location access to start accepting and navigating rides.
                </Text>

                {/* Button */}
                <Pressable
                    onPress={() => Location.requestForegroundPermissionsAsync()}
                    style={styles.guardButton}
                >
                    <Text style={styles.guardButtonText}>
                        Grant Permission
                    </Text>
                </Pressable>

            </View>
        </View>
    )
}

export function GPSOffPlaceholder({ setIsOnline }) {
    return (
        <View style={styles.guardContainer}>
            <View style={styles.guardCard}>

                {/* Icon */}
                <View style={styles.gpsIconWrapper}>
                    <Feather name="navigation" size={32} color="#ef4444" />
                </View>

                {/* Title */}
                <Text style={styles.guardTitle}>
                    GPS is Turned Off
                </Text>

                {/* Subtitle */}
                <Text style={styles.guardSubtitle}>
                    Please enable Location Services (GPS) to continue using the app.
                </Text>

                {/* Button */}
                <Pressable
                    onPress={() =>
                        Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS")
                    }
                    style={styles.gpsButton}
                >
                    <Text style={styles.gpsButtonText}>
                        Turn On GPS
                    </Text>
                </Pressable>

            </View>
        </View>
    )
}

const styles = {
    offlineContainer: {
        flex: 1,
        backgroundColor: "#09090b",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: normalize(24),
    },

    offlineCard: {
        width: "100%",
        backgroundColor: "#111214",
        borderRadius: normalize(20),
        paddingVertical: normalize(40),
        paddingHorizontal: normalize(28),
        borderWidth: normalize(1),
        borderColor: "#1e1f23",
        alignItems: "center",
    },

    iconWrapper: {
        width: normalize(72),
        height: normalize(72),
        borderRadius: normalize(20),
        backgroundColor: "rgba(239,68,68,0.08)",
        borderWidth: normalize(1),
        borderColor: "rgba(239,68,68,0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: normalize(20),
    },

    offlineTitle: {
        fontSize: normalize(18),
        fontWeight: "800",
        color: "#f0f0f0",
        marginBottom: normalize(8),
    },

    offlineSubtitle: {
        fontSize: normalize(13),
        color: "#52525b",
        textAlign: "center",
        lineHeight: normalize(20),
        marginBottom: normalize(24),
    },

    goOnlineButton: {
        backgroundColor: "#22c55e",
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(28),
        borderRadius: normalize(12),
    },

    goOnlineText: {
        fontSize: normalize(14),
        fontWeight: "700",
        color: "#111214",
    },

    guardContainer: {
        flex: 1,
        backgroundColor: "#09090b",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: normalize(24),
    },

    guardCard: {
        width: "100%",
        backgroundColor: "#111214",
        borderWidth: normalize(1),
        borderColor: "#1e1f23",
        borderRadius: normalize(24),
        paddingVertical: normalize(40),
        paddingHorizontal: normalize(28),
        alignItems: "center",
    },

    iconWrapper: {
        width: normalize(80),
        height: normalize(80),
        borderRadius: normalize(20),
        backgroundColor: "rgba(245,158,11,0.08)",
        borderWidth: normalize(1),
        borderColor: "rgba(245,158,11,0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: normalize(20),
    },

    guardTitle: {
        fontSize: normalize(18),
        fontWeight: "800",
        color: "#f0f0f0",
        marginBottom: normalize(8),
        textAlign: "center",
    },

    guardSubtitle: {
        fontSize: normalize(13),
        color: "#52525b",
        textAlign: "center",
        lineHeight: normalize(20),
        marginBottom: normalize(24),
    },

    guardButton: {
        backgroundColor: "#f59e0b",
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(28),
        borderRadius: normalize(12),
    },

    guardButtonText: {
        fontSize: normalize(14),
        fontWeight: "700",
        color: "#111214",
    },
    gpsIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "rgba(239,68,68,0.08)",
        borderWidth: 1,
        borderColor: "rgba(239,68,68,0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    gpsButton: {
        backgroundColor: "#ef4444",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 12,
    },

    gpsButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#ffffff",
    },
};
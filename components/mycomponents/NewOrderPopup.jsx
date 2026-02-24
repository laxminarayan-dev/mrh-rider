import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

export function NewOrderPopup({ visible, order, onAccept, onDecline }) {
    const slideAnim = useRef(new Animated.Value(-400)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -400,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="none">
            {/* Backdrop */}
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    opacity: opacityAnim,
                    justifyContent: "flex-end",
                }}
                pointerEvents={visible ? "auto" : "none"}
            >
                {/* Popup Content */}
                <Animated.View
                    style={{
                        transform: [{ translateY: slideAnim }],
                        backgroundColor: "#111113",
                        borderTopLeftRadius: 32,
                        borderTopRightRadius: 32,
                        borderWidth: 1,
                        borderColor: "#1c1c1e",
                        borderBottomWidth: 0,
                        paddingHorizontal: 20,
                        paddingTop: 28,
                        paddingBottom: 28,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 16,
                        elevation: 20,
                    }}
                >
                    {/* Header with Alert */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: "rgba(251,191,36,0.15)",
                                borderWidth: 1.5,
                                borderColor: "#fbbf24",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MaterialCommunityIcons name="bell-alert" size={24} color="#fbbf24" />
                        </View>
                        <View>
                            <Text style={{ fontSize: 9, color: "#fbbf24", fontWeight: "800", letterSpacing: 2.5, textTransform: "uppercase" }}>
                                New Order
                            </Text>
                            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "900", marginTop: 2 }}>
                                Order #{order?.id?.slice(0, 8) || "Incoming"}
                            </Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: 18 }} />

                    {/* Order Details */}
                    <View style={{ gap: 16, marginBottom: 20 }}>
                        {/* Pickup Location */}
                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <View style={{ paddingTop: 2 }}>
                                <View
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        backgroundColor: "#052e16",
                                        borderWidth: 1.5,
                                        borderColor: "#22c55e",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Feather name="map-pin" size={14} color="#22c55e" />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 11, color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                                    Pickup
                                </Text>
                                <Text style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}>
                                    {order?.pickupLocation?.name || "Restaurant Name"}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#a5b4fc", marginTop: 2 }}>
                                    {order?.pickupLocation?.address || "Address details"}
                                </Text>
                            </View>
                        </View>

                        {/* Distance Indicator */}
                        <View
                            style={{
                                height: 40,
                                justifyContent: "center",
                                alignItems: "center",
                                marginHorizontal: 14,
                            }}
                        >
                            <View
                                style={{
                                    width: 1.5,
                                    height: 20,
                                    backgroundColor: "rgba(251,191,36,0.3)",
                                    marginRight: 6,
                                }}
                            />
                            <Text style={{ fontSize: 11, color: "#fbbf24", fontWeight: "700" }}>
                                {order?.distance || "~2 km"}
                            </Text>
                        </View>

                        {/* Delivery Location */}
                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <View style={{ paddingTop: 2 }}>
                                <View
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        backgroundColor: "#1c1003",
                                        borderWidth: 1.5,
                                        borderColor: "#f59e0b",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Feather name="map-pin" size={14} color="#f59e0b" />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 11, color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                                    Delivery
                                </Text>
                                <Text style={{ fontSize: 14, color: "#fff", fontWeight: "600" }}>
                                    {order?.deliveryLocation?.name || "Customer Location"}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#a5b4fc", marginTop: 2 }}>
                                    {order?.deliveryLocation?.address || "Address details"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Info Badge */}
                    <View
                        style={{
                            backgroundColor: "rgba(251,191,36,0.1)",
                            borderWidth: 1,
                            borderColor: "rgba(251,191,36,0.3)",
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            marginBottom: 20,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <Text style={{ fontSize: 10, color: "#fbbf24", fontWeight: "700", letterSpacing: 0.5 }}>
                                Estimated Earnings
                            </Text>
                            <Text style={{ fontSize: 16, color: "#fbbf24", fontWeight: "900", marginTop: 2 }}>
                                ₹{order?.earnings || "150"}
                            </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={{ fontSize: 10, color: "#fbbf24", fontWeight: "700", letterSpacing: 0.5 }}>
                                Est. Time
                            </Text>
                            <Text style={{ fontSize: 16, color: "#fbbf24", fontWeight: "900", marginTop: 2 }}>
                                {order?.estimatedTime || "15"} min
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        {/* Decline */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onDecline}
                            style={{
                                flex: 1,
                                height: 54,
                                borderRadius: 16,
                                backgroundColor: "rgba(239,68,68,0.1)",
                                borderWidth: 1.5,
                                borderColor: "rgba(239,68,68,0.3)",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ color: "#ef4444", fontWeight: "800", fontSize: 15, letterSpacing: 0.3 }}>
                                Decline
                            </Text>
                        </TouchableOpacity>

                        {/* Accept */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={onAccept}
                            style={{
                                flex: 1,
                                height: 54,
                                borderRadius: 16,
                                backgroundColor: "#fbbf24",
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#fbbf24",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <Text style={{ color: "#000", fontWeight: "900", fontSize: 15, letterSpacing: 0.3 }}>
                                    Accept Order
                                </Text>
                                <Feather name="check" size={16} color="#000" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Auto-dismiss Timer Info */}
                    <Text style={{ color: "#6b7280", fontSize: 11, textAlign: "center", marginTop: 12, fontWeight: "500" }}>
                        This offer expires in 30 seconds
                    </Text>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";


export function NewOrderPopup({ visible = false, order = {}, onClose = () => { } }) {
    const slideAnim = useRef(new Animated.Value(300)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 300,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="none">
            {/* Main Wrapper: This handles the dimming and positioning */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>

                {/* Backdrop: Absolute fill, sits behind content */}
                <Pressable
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255,255,255,0.7)",
                    }}
                    onPress={() => {
                        console.log("Backdrop clicked");
                        onClose();
                    }}
                />

                {/* Popup Content: Animated container */}
                <Animated.View
                    style={{
                        opacity: opacityAnim,
                        transform: [{ translateY: slideAnim }],
                        backgroundColor: "#111113",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        borderWidth: 1,
                        borderColor: "#1c1c1e",
                        paddingHorizontal: 20,
                        paddingTop: 28,
                        paddingBottom: 40,
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
                                width: 52,
                                height: 52,
                                borderRadius: 26,
                                backgroundColor: "#09090b",
                                borderWidth: 1.5,
                                borderColor: "#fbbf24",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MaterialCommunityIcons name="bell-ring" size={26} color="#fbbf24" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                <MaterialCommunityIcons name="lightning-bolt" size={12} color="#fbbf24" />
                                <Text style={{ fontSize: 9, color: "#fbbf24", fontWeight: "800", letterSpacing: 2.5, textTransform: "uppercase" }}>
                                    New Order
                                </Text>
                            </View>
                            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "900", marginTop: 2 }}>
                                Order #{order?.id?.slice(0, 8) || "Incoming"}
                            </Text>
                        </View>
                        <View style={{ backgroundColor: "rgba(251,191,36,0.1)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(251,191,36,0.2)" }}>
                            <Pressable onPress={onClose}>
                                <MaterialCommunityIcons name="close-circle-outline" size={24} color="#fbbf24" />
                            </Pressable>
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
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                marginHorizontal: 14,
                                paddingVertical: 8,
                            }}
                        >
                            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(251,191,36,0.15)" }} />
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(251,191,36,0.1)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "rgba(251,191,36,0.2)" }}>
                                <MaterialCommunityIcons name="map-marker-distance" size={14} color="#fbbf24" />
                                <Text style={{ fontSize: 11, color: "#fbbf24", fontWeight: "700" }}>
                                    {order?.distance || "~2 km"}
                                </Text>
                                <Feather name="arrow-down" size={12} color="#fbbf24" />
                            </View>
                            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(251,191,36,0.15)" }} />
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

                    {/* Info Badges Row */}
                    <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>

                        {/* Time Badge */}
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(99,102,241,0.08)",
                                borderWidth: 1,
                                borderColor: "rgba(99,102,241,0.25)",
                                borderRadius: 16,
                                padding: 14,
                                alignItems: "center",
                            }}
                        >
                            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(99,102,241,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                                <Ionicons name="time-outline" size={18} color="#818cf8" />
                            </View>
                            <Text style={{ fontSize: 9, color: "#6b7280", fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                                Est. Time
                            </Text>
                            <Text style={{ fontSize: 20, color: "#818cf8", fontWeight: "900" }}>
                                {order?.estimatedTime || "15"} min
                            </Text>
                        </View>

                        {/* Items Badge */}
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(251,191,36,0.08)",
                                borderWidth: 1,
                                borderColor: "rgba(251,191,36,0.25)",
                                borderRadius: 16,
                                padding: 14,
                                alignItems: "center",
                            }}
                        >
                            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(251,191,36,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                                <MaterialCommunityIcons name="package-variant" size={18} color="#fbbf24" />
                            </View>
                            <Text style={{ fontSize: 9, color: "#6b7280", fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                                Items
                            </Text>
                            <Text style={{ fontSize: 20, color: "#fbbf24", fontWeight: "900" }}>
                                {order?.items || "3"}
                            </Text>
                        </View>
                    </View>

                    {/* Order Status */}
                    <View style={{ backgroundColor: "rgba(99,102,241,0.08)", borderWidth: 1, borderColor: "rgba(99,102,241,0.25)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "rgba(99,102,241,0.15)", alignItems: "center", justifyContent: "center" }}>
                                <Feather name="info" size={16} color="#818cf8" />
                            </View>
                            <Text style={{ fontSize: 14, color: "#818cf8", fontWeight: "800" }}>Order Status</Text>
                        </View>
                        <View style={{ gap: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="user" size={13} color="#6b7280" />
                                    <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "600" }}>Customer</Text>
                                </View>
                                <Text style={{ fontSize: 13, color: "#fff", fontWeight: "700" }}>{order?.customer || "Rahul Sharma"}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)" }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="phone" size={13} color="#6b7280" />
                                    <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "600" }}>Phone</Text>
                                </View>
                                <Text style={{ fontSize: 13, color: "#fff", fontWeight: "700" }}>{order?.phone || "+91 98765 43210"}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)" }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <MaterialCommunityIcons name="cash" size={15} color="#6b7280" />
                                    <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "600" }}>Payment</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(34,197,94,0.12)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                                    <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: "#22c55e" }} />
                                    <Text style={{ fontSize: 11, color: "#22c55e", fontWeight: "700" }}>{order?.paymentMethod || "COD"}</Text>
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)" }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="clock" size={13} color="#6b7280" />
                                    <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "600" }}>Placed At</Text>
                                </View>
                                <Text style={{ fontSize: 13, color: "#fff", fontWeight: "700" }}>{order?.placedAt || "2:35 PM"}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Assigned Info */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "rgba(251,191,36,0.08)", borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(251,191,36,0.15)" }}>
                        <MaterialIcons name="directions-bike" size={16} color="#fbbf24" />
                        <Text style={{ color: "#fbbf24", fontSize: 12, fontWeight: "700" }}>
                            Assigned to you by admin
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
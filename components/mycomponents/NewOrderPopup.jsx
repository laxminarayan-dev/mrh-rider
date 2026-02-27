import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";
import { normalize } from "../../lib/normalize";


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
                        borderTopLeftRadius: normalize(30),
                        borderTopRightRadius: normalize(30),
                        borderWidth: 1,
                        borderColor: "#1c1c1e",
                        paddingHorizontal: normalize(20),
                        paddingTop: normalize(28),
                        paddingBottom: normalize(40),
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: normalize(-4) },
                        shadowOpacity: 0.3,
                        shadowRadius: normalize(16),
                        elevation: 20,
                    }}
                >
                    {/* Header with Alert */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(12), marginBottom: normalize(20) }}>
                        <View
                            style={{
                                width: normalize(52),
                                height: normalize(52),
                                borderRadius: normalize(26),
                                backgroundColor: "#09090b",
                                borderWidth: 1.5,
                                borderColor: "#fbbf24",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MaterialCommunityIcons name="bell-ring" size={normalize(26)} color="#fbbf24" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(6) }}>
                                <MaterialCommunityIcons name="lightning-bolt" size={normalize(12)} color="#fbbf24" />
                                <Text style={{ fontSize: normalize(9), color: "#fbbf24", fontWeight: "800", letterSpacing: 2.5, textTransform: "uppercase" }}>
                                    New Order
                                </Text>
                            </View>
                            <Text style={{ fontSize: normalize(20), color: "#fff", fontWeight: "900", marginTop: normalize(2) }}>
                                Order #{order?.id?.slice(0, 8) || "Incoming"}
                            </Text>
                        </View>
                        <View style={{ backgroundColor: "rgba(251,191,36,0.1)", borderRadius: normalize(10), paddingHorizontal: normalize(8), paddingVertical: normalize(4), borderWidth: 1, borderColor: "rgba(251,191,36,0.2)" }}>
                            <Pressable onPress={onClose}>
                                <MaterialCommunityIcons name="close-circle-outline" size={normalize(24)} color="#fbbf24" />
                            </Pressable>
                        </View>
                    </View>


                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: normalize(18) }} />

                    {/* Order Details */}
                    <View style={{ gap: normalize(16), marginBottom: normalize(20) }}>
                        {/* Pickup Location */}
                        <View style={{ flexDirection: "row", gap: normalize(12) }}>
                            <View style={{ paddingTop: normalize(2) }}>
                                <View
                                    style={{
                                        width: normalize(28),
                                        height: normalize(28),
                                        borderRadius: normalize(14),
                                        backgroundColor: "#052e16",
                                        borderWidth: 1.5,
                                        borderColor: "#22c55e",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Feather name="map-pin" size={normalize(14)} color="#22c55e" />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: normalize(11), color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: normalize(2) }}>
                                    Pickup
                                </Text>
                                <Text style={{ fontSize: normalize(14), color: "#fff", fontWeight: "600" }}>
                                    {order?.pickupLocation?.name || "Restaurant Name"}
                                </Text>
                                <Text style={{ fontSize: normalize(12), color: "#a5b4fc", marginTop: normalize(2) }}>
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
                                gap: normalize(8),
                                marginHorizontal: normalize(14),
                                paddingVertical: normalize(8),
                            }}
                        >
                            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(251,191,36,0.15)" }} />
                            <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(6), backgroundColor: "rgba(251,191,36,0.1)", borderRadius: normalize(20), paddingHorizontal: normalize(12), paddingVertical: normalize(5), borderWidth: 1, borderColor: "rgba(251,191,36,0.2)" }}>
                                <MaterialCommunityIcons name="map-marker-distance" size={normalize(14)} color="#fbbf24" />
                                <Text style={{ fontSize: normalize(11), color: "#fbbf24", fontWeight: "700" }}>
                                    {order?.distance || "~2 km"}
                                </Text>
                                <Feather name="arrow-down" size={normalize(12)} color="#fbbf24" />
                            </View>
                            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(251,191,36,0.15)" }} />
                        </View>

                        {/* Delivery Location */}
                        <View style={{ flexDirection: "row", gap: normalize(12) }}>
                            <View style={{ paddingTop: normalize(2) }}>
                                <View
                                    style={{
                                        width: normalize(28),
                                        height: normalize(28),
                                        borderRadius: normalize(14),
                                        backgroundColor: "#1c1003",
                                        borderWidth: 1.5,
                                        borderColor: "#f59e0b",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Feather name="map-pin" size={normalize(14)} color="#f59e0b" />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: normalize(11), color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: normalize(2) }}>
                                    Delivery
                                </Text>
                                <Text style={{ fontSize: normalize(14), color: "#fff", fontWeight: "600" }}>
                                    {order?.deliveryLocation?.name || "Customer Location"}
                                </Text>
                                <Text style={{ fontSize: normalize(12), color: "#a5b4fc", marginTop: normalize(2) }}>
                                    {order?.deliveryLocation?.address || "Address details"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Info Badges Row */}
                    <View style={{ flexDirection: "row", gap: normalize(16), marginBottom: normalize(20) }}>

                        {/* Time Badge */}
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(99,102,241,0.08)",
                                borderWidth: 1,
                                borderColor: "rgba(99,102,241,0.25)",
                                borderRadius: normalize(16),
                                padding: 14,
                                alignItems: "center",
                            }}
                        >
                            <View style={{ width: normalize(36), height: normalize(36), borderRadius: normalize(12), backgroundColor: "rgba(99,102,241,0.15)", alignItems: "center", justifyContent: "center", marginBottom: normalize(8) }}>
                                <Ionicons name="time-outline" size={normalize(18)} color="#818cf8" />
                            </View>
                            <Text style={{ fontSize: normalize(9), color: "#6b7280", fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: normalize(2) }}>
                                Est. Time
                            </Text>
                            <Text style={{ fontSize: normalize(20), color: "#818cf8", fontWeight: "900" }}>
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
                                borderRadius: normalize(16),
                                padding: 14,
                                alignItems: "center",
                            }}
                        >
                            <View style={{ width: normalize(36), height: normalize(36), borderRadius: normalize(12), backgroundColor: "rgba(251,191,36,0.15)", alignItems: "center", justifyContent: "center", marginBottom: normalize(8) }}>
                                <MaterialCommunityIcons name="package-variant" size={normalize(18)} color="#fbbf24" />
                            </View>
                            <Text style={{ fontSize: normalize(9), color: "#6b7280", fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: normalize(2) }}>
                                Items
                            </Text>
                            <Text style={{ fontSize: normalize(20), color: "#fbbf24", fontWeight: "900" }}>
                                {order?.items || "3"}
                            </Text>
                        </View>
                    </View>

                    {/* Order Status */}
                    <View style={{ backgroundColor: "rgba(99,102,241,0.08)", borderWidth: 1, borderColor: "rgba(99,102,241,0.25)", borderRadius: normalize(16), padding: normalize(16), marginBottom: normalize(16) }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(10), marginBottom: normalize(12) }}>
                            <View style={{ width: normalize(32), height: normalize(32), borderRadius: normalize(10), backgroundColor: "rgba(99,102,241,0.15)", alignItems: "center", justifyContent: "center" }}>
                                <Feather name="info" size={normalize(16)} color="#818cf8" />
                            </View>
                            <Text style={{ fontSize: normalize(14), color: "#818cf8", fontWeight: "800" }}>Order Status</Text>
                        </View>
                        <View style={{ gap: normalize(10) }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(8) }}>
                                    <Feather name="user" size={normalize(13)} color="#6b7280" />
                                    <Text style={{ fontSize: normalize(12), color: "#6b7280", fontWeight: "600" }}>Customer</Text>
                                </View>
                                <Text style={{ fontSize: normalize(13), color: "#fff", fontWeight: "700" }}>{order?.customer || "Rahul Sharma"}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)" }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(8) }}>
                                    <Feather name="phone" size={normalize(13)} color="#6b7280" />
                                    <Text style={{ fontSize: normalize(12), color: "#6b7280", fontWeight: "600" }}>Phone</Text>
                                </View>
                                <Text style={{ fontSize: normalize(13), color: "#fff", fontWeight: "700" }}>{order?.phone || "+91 98765 43210"}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)" }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(8) }}>
                                    <MaterialCommunityIcons name="cash" size={normalize(15)} color="#6b7280" />
                                    <Text style={{ fontSize: normalize(12), color: "#6b7280", fontWeight: "600" }}>Payment</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(5), backgroundColor: "rgba(34,197,94,0.12)", borderRadius: normalize(8), paddingHorizontal: normalize(8), paddingVertical: normalize(3) }}>
                                    <View style={{ width: normalize(5), height: normalize(5), borderRadius: normalize(3), backgroundColor: "#22c55e" }} />
                                    <Text style={{ fontSize: normalize(11), color: "#22c55e", fontWeight: "700" }}>{order?.paymentMethod || "COD"}</Text>
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)" }} />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: normalize(8) }}>
                                    <Feather name="clock" size={normalize(13)} color="#6b7280" />
                                    <Text style={{ fontSize: normalize(12), color: "#6b7280", fontWeight: "600" }}>Placed At</Text>
                                </View>
                                <Text style={{ fontSize: normalize(13), color: "#fff", fontWeight: "700" }}>{order?.placedAt || "2:35 PM"}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Assigned Info */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: normalize(6), backgroundColor: "rgba(251,191,36,0.08)", borderRadius: normalize(12), paddingVertical: normalize(10), borderWidth: 1, borderColor: "rgba(251,191,36,0.15)" }}>
                        <MaterialIcons name="directions-bike" size={normalize(16)} color="#fbbf24" />
                        <Text style={{ color: "#fbbf24", fontSize: normalize(12), fontWeight: "700" }}>
                            Assigned to you by admin
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
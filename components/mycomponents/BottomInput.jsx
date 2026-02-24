import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomInput() {

    const [testMsg, setTestMsg] = useState("");

    // Bottom inset (e.g. gesture bar on Android) — we subtract this
    // because SafeAreaView already accounts for it, so without subtracting
    // the layout shifts by (keyboardHeight + bottomInset) = too much
    const { bottom: bottomInset } = useSafeAreaInsets();

    const keyboardHeight = useSharedValue(0);

    useKeyboardHandler({
        onMove: (e) => {
            "worklet";
            keyboardHeight.value = e.height;
        },
        onEnd: (e) => {
            "worklet";
            keyboardHeight.value = e.height;
        },
    });

    const animatedStyle = useAnimatedStyle(() => ({
        // Subtract bottomInset so we don't double-count what SafeAreaView already handles
        paddingBottom: Math.max(0, keyboardHeight.value - bottomInset),
    }));

    return (
        <Animated.View
            style={[
                { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, gap: 10, backgroundColor: "#111113", borderTopWidth: 1, borderTopColor: "#2d3748" },
                animatedStyle,
            ]}
        >
            <View style={{ flex: 1, backgroundColor: "#1a202c", borderWidth: 1, borderColor: "#2d3748", borderRadius: 25, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 12, marginTop: 4 }}>
                <TextInput
                    placeholder="Test input — switch to emoji here 👆"
                    placeholderTextColor="#6b7280"
                    style={{ color: "#f9fafb", fontSize: 14 }}
                    value={testMsg}
                    onChangeText={setTestMsg}
                />
            </View>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#fbbf24", alignItems: "center", justifyContent: "center" }}>
                <Feather name="send" size={16} color="#000" />
            </View>
        </Animated.View>
    );
}
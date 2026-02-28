import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

export default async function getCurrentLocation(
    { highAccuracy = true } = {}
) {
    try {
        while (true) {
            // 1️⃣ Check if GPS enabled
            const enabled = await Location.hasServicesEnabledAsync();

            if (!enabled) {
                const retry = await new Promise(resolve => {
                    Alert.alert(
                        "Location Services Disabled",
                        "Please enable GPS to continue ride.",
                        [
                            {
                                text: "Exit",
                                style: "destructive",
                                onPress: () => resolve(false),
                            },
                            {
                                text: "Open Settings",
                                onPress: () => {
                                    Linking.openSettings();
                                    resolve(true);
                                },
                            },
                        ]
                    );
                });

                if (!retry) return null;
                continue; // 🔁 check again
            }

            // 2️⃣ Check permission
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                const retry = await new Promise(resolve => {
                    Alert.alert(
                        "Permission Required",
                        "Location permission is required to start ride.",
                        [
                            {
                                text: "Exit",
                                style: "destructive",
                                onPress: () => resolve(false),
                            },
                            {
                                text: "Grant Permission",
                                onPress: () => resolve(true),
                            },
                        ]
                    );
                });

                if (!retry) return null;
                continue; // 🔁 ask again
            }

            // 3️⃣ Get location
            const location = await Location.getCurrentPositionAsync({
                accuracy: highAccuracy
                    ? Location.Accuracy.High
                    : Location.Accuracy.Balanced,
            });

            return {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                accuracy: location.coords.accuracy,
                timestamp: location.timestamp,
            };
        }
    } catch (error) {
        console.warn("Location error:", error.message);
        return null;
    }
}
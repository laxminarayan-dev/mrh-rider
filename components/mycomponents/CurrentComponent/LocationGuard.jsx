import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

function useLocationGuard() {
    const [isReady, setIsReady] = useState(false);

    async function checkLocation() {
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            setIsReady(false);
            return;
        }

        const { status } =
            await Location.getForegroundPermissionsAsync();

        if (status !== "granted") {
            setIsReady(false);
            return;
        }

        setIsReady(true);
    }

    useEffect(() => {
        checkLocation();

        const sub = AppState.addEventListener("change", state => {
            if (state === "active") {
                checkLocation(); // 🔁 recheck when coming from settings
            }
        });

        return () => sub.remove();
    }, []);

    return isReady;
}
export default useLocationGuard;
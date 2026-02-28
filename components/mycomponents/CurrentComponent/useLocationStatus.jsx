import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export function useLocationStatus() {
    const [status, setStatus] = useState("checking");
    // checking | no-permission | gps-off | ready

    const [currentLocation, setCurrentLocation] = useState(null);
    const locationSub = useRef(null);

    async function checkStatus() {
        const enabled = await Location.hasServicesEnabledAsync();
        const { status: permissionStatus } =
            await Location.getForegroundPermissionsAsync();

        if (permissionStatus !== "granted") {
            setStatus("no-permission");
            stopWatching();
            return;
        }

        if (!enabled) {
            setStatus("gps-off");
            stopWatching();
            return;
        }

        setStatus("ready");
        startWatching();
    }

    async function startWatching() {
        if (locationSub.current) return;

        locationSub.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                distanceInterval: 5,
                timeInterval: 3000,
            },
            (location) => {
                setCurrentLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    accuracy: location.coords.accuracy,
                    timestamp: location.timestamp,
                });
            }
        );
    }

    function stopWatching() {
        locationSub.current?.remove();
        locationSub.current = null;
        setCurrentLocation(null);
    }

    useEffect(() => {
        checkStatus();

        const appSub = AppState.addEventListener("change", state => {
            if (state === "active") {
                checkStatus();
            }
        });

        const interval = setInterval(() => {
            checkStatus();
        }, 3000);

        return () => {
            appSub.remove();
            clearInterval(interval);
            stopWatching();
        };
    }, []);

    return { status, currentLocation };
}
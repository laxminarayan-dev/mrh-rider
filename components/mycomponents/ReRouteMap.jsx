import * as Location from "expo-location";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { normalize } from "../../lib/normalize";

const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;
const NOTIFY_API = "https://your-api.com/ride";

async function fetchORSRoute(waypoints) {
    const coordinates = waypoints.map(w => [w.lng, w.lat]);

    const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car/geojson?api_key=${ORS_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coordinates }),
        }
    );

    if (!res.ok) throw new Error(`ORS error ${res.status}`);

    const data = await res.json();

    const geometry = data?.features?.[0]?.geometry?.coordinates;
    const steps =
        data?.features?.[0]?.properties?.segments?.[0]?.steps || [];

    if (!geometry) throw new Error("ORS response missing geometry");

    const coords = geometry.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
    }));

    return { coords, steps };
}

const ReRouteMap = forwardRef(function ReRouteMap(
    {
        waypoints = [],
        height = 280,
        routeColor = "#f59e0b",
        rideActive,
        setRideActive,
        elapsedSeconds,
        setElapsedSeconds,
        distanceCovered,
        setDistanceCovered,
    },
    ref
) {
    const mapRef = useRef(null);
    const locationSub = useRef(null);
    const timerRef = useRef(null);
    const prevLocation = useRef(null);

    const [routeCoords, setRouteCoords] = useState([]);
    const [navigationSteps, setNavigationSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loadingRoute, setLoadingRoute] = useState(false);

    const destination = waypoints[waypoints.length - 1];

    useImperativeHandle(ref, () => ({
        startRide,
        endRide,
    }));

    useEffect(() => {
        Location.requestForegroundPermissionsAsync();
    }, []);

    function getDistanceMeters(a, b) {
        const R = 6371000;
        const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
        const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
        const x =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((a.latitude * Math.PI) / 180) *
            Math.cos((b.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    }

    async function startRide() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        setElapsedSeconds(0);
        setDistanceCovered(0);
        setRideActive(true);

        timerRef.current = setInterval(() => {
            setElapsedSeconds(s => s + 1);
        }, 1000);

        locationSub.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                distanceInterval: 5,
            },
            async (loc) => {
                const coords = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                };

                setCurrentLocation(coords);

                if (prevLocation.current) {
                    const d = getDistanceMeters(prevLocation.current, coords);
                    setDistanceCovered(prev => prev + d);
                }

                prevLocation.current = coords;

                if (!destination) return;

                setLoadingRoute(true);

                try {
                    const data = await fetchORSRoute([
                        { lat: coords.latitude, lng: coords.longitude },
                        { lat: destination.lat, lng: destination.lng },
                    ]);

                    setRouteCoords(data.coords);
                    setNavigationSteps(data.steps);
                    setCurrentStepIndex(0);
                } catch (err) {
                    console.log(err);
                }

                setLoadingRoute(false);
            }
        );
    }

    async function endRide() {
        locationSub.current?.remove();
        clearInterval(timerRef.current);
        setRideActive(false);
        setCurrentLocation(null);
    }

    useEffect(() => {
        if (!currentLocation || navigationSteps.length === 0) return;

        const step = navigationSteps[currentStepIndex];
        if (!step) return;

        const stepEndIndex = step.way_points?.[1];
        const stepEndCoord = routeCoords[stepEndIndex];

        if (!stepEndCoord) return;

        const dist = getDistanceMeters(currentLocation, stepEndCoord);

        if (dist < 20) {
            setCurrentStepIndex(prev => prev + 1);
        }
    }, [currentLocation]);

    useEffect(() => {
        if (!rideActive || !currentLocation) return;

        mapRef.current?.animateToRegion(
            {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            },
            800
        );
    }, [currentLocation]);

    if (waypoints.length === 0) return null;

    const pickupCenter = {
        latitude: waypoints[0].lat,
        longitude: waypoints[0].lng,
    };

    return (
        <View style={{ height, borderRadius: 16, overflow: "hidden" }}>

            {/* 🔥 Google Maps Style Navigation Header */}
            {rideActive && navigationSteps[currentStepIndex] && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        width: "100%",
                        backgroundColor: "#111",
                        padding: normalize(14),
                        zIndex: 999,
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                        {navigationSteps[currentStepIndex].instruction}
                    </Text>
                </View>
            )}

            <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: pickupCenter.latitude,
                    longitude: pickupCenter.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {destination && (
                    <Marker
                        coordinate={{
                            latitude: destination.lat,
                            longitude: destination.lng,
                        }}
                        pinColor="#ef4444"
                    />
                )}

                {routeCoords.length > 1 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeColor={routeColor}
                        strokeWidth={5}
                    />
                )}

                {currentLocation && (
                    <Marker coordinate={currentLocation}>
                        <View
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: 9,
                                backgroundColor: "#3b82f6",
                                borderWidth: 3,
                                borderColor: "#fff",
                            }}
                        />
                    </Marker>
                )}
            </MapView>

            {loadingRoute && (
                <ActivityIndicator
                    style={{ position: "absolute", top: "50%", alignSelf: "center" }}
                    color={routeColor}
                />
            )}
        </View>
    );
});

export default ReRouteMap;
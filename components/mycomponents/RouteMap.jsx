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
  if (!data?.features?.[0]?.geometry?.coordinates)
    throw new Error("ORS response missing geometry");
  return data.features[0].geometry.coordinates.map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));
}

const RouteMap = forwardRef(function RouteMap(
  {
    waypoints = [],
    height = 280,
    routeColor = "#f59e0b",
    rideId = null,
    rideActive,
    setRideActive,
    elapsedSeconds,
    setElapsedSeconds,
    distanceCovered,
    setDistanceCovered,
  },
  ref
) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [loadingRide, setLoadingRide] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userMoved, setUserMoved] = useState(false);

  const mapRef = useRef(null);
  const locationSub = useRef(null);
  const timerRef = useRef(null);
  const prevLocation = useRef(null);
  const userMovedTimer = useRef(null);

  // Expose startRide / endRide to parent via ref
  useImperativeHandle(ref, () => ({
    startRide,
    endRide,
  }));

  // Request location permission on mount
  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  // Fetch ORS route on mount / waypoint change
  useEffect(() => {
    if (waypoints.length < 2) return;
    setLoadingRoute(true);
    fetchORSRoute(waypoints)
      .then(setRouteCoords)
      .catch(err => console.error("ORS routing error:", err))
      .finally(() => setLoadingRoute(false));
  }, [JSON.stringify(waypoints)]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      locationSub.current?.remove();
      clearInterval(timerRef.current);
      clearTimeout(userMovedTimer.current);
    };
  }, []);

  // Map centering logic:
  // - Before ride: stays on pickup, never moves
  // - After ride starts: follows rider GPS (unless user manually panned)
  useEffect(() => {
    if (!currentLocation) return;
    if (!rideActive) return;         // don't follow GPS until ride starts
    if (userMoved) return;           // don't interrupt manual pan

    mapRef.current?.animateToRegion(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      800
    );
  }, [currentLocation, rideActive, userMoved]);

  function getDistanceMeters(a, b) {
    const R = 6371000;
    const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
    const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((a.latitude * Math.PI) / 180) *
      Math.cos((b.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  async function startRide() {
    setLoadingRide(true);
    try {
      // Check / request permission
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== "granted") {
          alert("Location permission is required to start the ride.");
          return;
        }
      }

      // Notify server
      await fetch(NOTIFY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideId,
          status: "started",
          time: new Date().toISOString(),
        }),
      }).catch(err => console.warn("Server notify failed:", err));

      // Reset stats
      setElapsedSeconds(0);
      setDistanceCovered(0);
      prevLocation.current = null;

      // Start timer
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);

      // Start GPS tracking
      locationSub.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5,
        },
        (loc) => {
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
        }
      );

      setRideActive(true);
    } catch (err) {
      console.error("Start ride error:", err);
    } finally {
      setLoadingRide(false);
    }
  }

  async function endRide() {
    setLoadingRide(true);
    try {
      locationSub.current?.remove();
      locationSub.current = null;
      clearInterval(timerRef.current);

      // Notify server
      await fetch(NOTIFY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideId,
          status: "ended",
          duration: elapsedSeconds,
          distance: distanceCovered,
          time: new Date().toISOString(),
        }),
      }).catch(err => console.warn("Server notify failed:", err));

      setRideActive(false);
      setCurrentLocation(null);
      setUserMoved(false);
    } catch (err) {
      console.error("End ride error:", err);
    } finally {
      setLoadingRide(false);
    }
  }

  if (waypoints.length === 0) return null;

  // Center on pickup before ride, rider GPS handled by animateToRegion after
  const pickupCenter = {
    latitude: waypoints[0].lat,
    longitude: waypoints[0].lng,
  };


  useEffect(() => {
    mapRef.current?.animateToRegion(
      {
        latitude: pickupCenter.latitude,
        longitude: pickupCenter.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      800
    );
  }, [pickupCenter.latitude, pickupCenter.longitude])

  return (
    <View style={{ height, borderRadius: normalize(16), overflow: "hidden" }}>
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
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        onPanDrag={() => {
          // Pause auto-centering for 5s when user manually pans
          setUserMoved(true);
          clearTimeout(userMovedTimer.current);
          userMovedTimer.current = setTimeout(() => {
            setUserMoved(false);
          }, 5000);
        }}
      >
        {/* Pickup + delivery markers */}
        {waypoints.map((w, i) => (
          <Marker
            key={`marker-${i}`}
            coordinate={{ latitude: w.lat, longitude: w.lng }}
            title={w.label || `Point ${i + 1}`}
            pinColor={w.color || (i === 0 ? "#22c55e" : "#ef4444")}
          />
        ))}

        {/* ORS road route */}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={routeColor}
            strokeWidth={4}
          />
        )}

        {/* Live rider position — custom blue dot */}
        {rideActive && currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="You"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={{
                width: normalize(20),
                height: normalize(20),
                borderRadius: normalize(10),
                backgroundColor: "#3b82f6",
                borderWidth: 3,
                borderColor: "#fff",
                elevation: 6,
              }}
            />
          </Marker>
        )}
      </MapView>

      {/* Route loading spinner */}
      {loadingRoute && (
        <ActivityIndicator
          style={{ position: "absolute", top: "50%", alignSelf: "center" }}
          color={routeColor}
        />
      )}

      {/* Recenter button — shows when user panned during active ride / user seeing map*/}
      <View
        onTouchEnd={() => {

          if (rideActive) {
            setUserMoved(false)
          } else {
            mapRef.current?.animateToRegion(
              {
                latitude: pickupCenter.latitude,
                longitude: pickupCenter.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              800
            );
          }

        }}
        style={{
          position: "absolute",
          bottom: normalize(12),
          right: normalize(12),
          backgroundColor: "#18181b",
          borderRadius: normalize(20),
          paddingHorizontal: normalize(12),
          paddingVertical: normalize(8),
          borderWidth: 1,
          borderColor: "#3f3f46",
        }}
      >
        <Text style={{ color: "#f59e0b", fontSize: normalize(11), fontWeight: "700" }}>
          ⊙ Recenter
        </Text>
      </View>
    </View>
  );
});

export default RouteMap;
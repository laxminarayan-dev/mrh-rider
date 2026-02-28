import { Linking, Platform } from "react-native";

function openGoogleMaps(start, end) {
    if (!start || !end) return;

    const startCoords = `${start.lat},${start.lng}`;
    const endCoords = `${end.lat},${end.lng}`;

    let url;

    if (Platform.OS === "android") {
        // Direct navigation mode (no browser, no chooser)
        url = `google.navigation:q=${endCoords}&mode=d`;
    } else {
        // iOS fallback
        url = `comgooglemaps://?saddr=${startCoords}&daddr=${endCoords}&directionsmode=driving`;
    }

    Linking.openURL(url);
}

export default openGoogleMaps;
export function getDistanceMeters(pointA, pointB) {
    if (!pointA || !pointB) return 0;

    const R = 6371000; // Earth radius in meters

    const lat1 = (pointA.lat * Math.PI) / 180;
    const lat2 = (pointB.lat * Math.PI) / 180;

    const deltaLat =
        ((pointB.lat - pointA.lat) * Math.PI) / 180;

    const deltaLng =
        ((pointB.lng - pointA.lng) * Math.PI) / 180;

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in meters
}

export function formatDistance(distanceInMeters) {
    if (distanceInMeters >= 1000) {
        return (distanceInMeters / 1000).toFixed(2) + " km";
    } else {
        return distanceInMeters.toFixed(0) + " m";
    }
}


function hasArrived(currentLocation, stopLocation) {
    if (!currentLocation) return false;

    const distance = getDistanceMeters(currentLocation, stopLocation);

    const dynamicThreshold = Math.max(
        currentLocation.accuracy * 2,
        30 // minimum 30 meters
    );

    return distance <= dynamicThreshold;
}

export default hasArrived;



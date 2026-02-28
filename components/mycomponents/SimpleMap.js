import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

export default function SimpleMap() {
    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                rotateEnabled={true}
                pitchEnabled={true}
                showsUserLocation={true}
                initialRegion={{
                    latitude: 28.7041,
                    longitude: 77.1025,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: 28.7041,
                        longitude: 77.1025,
                    }}
                    title="Delhi"
                    description="Demo Marker"
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});
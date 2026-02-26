import { Button, Linking, ScrollView, Text, View } from "react-native";

function OpenGoogleMap() {
    function openGoogleMaps() {
        // const sourceLat = 28.6139;
        // const sourceLng = 77.2090;

        const destLat = 28.7041;
        const destLng = 77.1025;

        const url = `google.navigation:q=${destLat},${destLng}&mode=d`;

        Linking.openURL(url);
    }

    return (
        <ScrollView
            className="bg-[#09090b]"
            style={{ flex: 1, backgroundColor: "#09090b" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
        >
            <View className="px-4">
                <Text className="text-white text-2xl font-bold mb-4">Current Orders</Text>
            </View>
            <View style={{ flex: 1, height: 400, margin: 16, borderRadius: 8, overflow: 'hidden' }}>
                <Button title="Open in Google Maps" onPress={openGoogleMaps} />
            </View>
        </ScrollView>
    );
}

export default OpenGoogleMap;

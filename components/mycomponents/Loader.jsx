import { ActivityIndicator, View } from "react-native";
export default function Loader() {
    return (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#09090b", opacity: 0.4, alignItems: "center", justifyContent: "center", width: "100%", height: "100%", zIndex: 999 }}>
            <ActivityIndicator size="large" color="#fbbf24" />
        </View>
    );
}
import { Image } from "expo-image";
import { Text, View } from "react-native";
export default function LoaderWithImage() {
    return <View style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "#09090b",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <Image
            source={require("../../assets/myImages/splash.png")}
            style={{ width: 120, height: 120 }}
            contentFit="contain"
        />
        <Text style={{ color: "#3f3f46", fontSize: 12, letterSpacing: 4, marginTop: 16, textTransform: "uppercase" }}>
            Loading...
        </Text>
    </View>
}
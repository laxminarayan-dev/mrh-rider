import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function History() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          History
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default History;

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Current() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text>Current Delivery</Text>
      </View>
    </SafeAreaView>
  );
}

export default Current;

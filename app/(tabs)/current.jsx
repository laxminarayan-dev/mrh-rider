import { Text, View } from "react-native";
import { ScrollView } from "react-native";

function Current() {
  return (
    <ScrollView
      className="bg-[#09090b]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
    >
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text>Current Delivery</Text>
      </View>
    </ScrollView>
  );
}

export default Current;

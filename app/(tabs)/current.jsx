import { ScrollView, Text, View } from "react-native";

function Current() {
  return (
    <ScrollView
      className="bg-[#09090b]"
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
    >
      <View style={{ marginHorizontal: 20, marginTop: 20 }}
        className="bg-red-400"
      >
        <Text>Current Delivery</Text>
      </View>
    </ScrollView>
  );
}

export default Current;

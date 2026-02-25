import { ScrollView, Text, View } from "react-native";

function History() {
  return (

    <ScrollView
      className="bg-[#09090b]"
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
    >
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text>History </Text>
      </View>
    </ScrollView>
  );
}

export default History;

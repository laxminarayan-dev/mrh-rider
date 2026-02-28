import { devideOrdersByDate } from "@/lib/getOrderData";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { EmptyHistory, HistoryCard } from "../../components/mycomponents/HistoryComponents";
import { useAppContext } from "../../lib/AppContext";
import { normalize } from "../../lib/normalize";

function History() {
  const { ordersData } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setOrders(
      ordersData.filter(
        (o) => o.status === "delivered" || o.status === "cancelled"
      )
    );
  }, [ordersData]);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const grouped = devideOrdersByDate(filtered) || {};

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#09090b" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: normalize(48),
        paddingTop: normalize(24),
      }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(18),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: normalize(8),
          }}
        >
          <View
            style={{
              width: normalize(3),
              height: normalize(16),
              borderRadius: normalize(2),
              backgroundColor: "#d4a843",
            }}
          />
          <Text
            style={{
              fontSize: normalize(20),
              color: "#f0f0f0",
              fontWeight: "800",
              letterSpacing: normalize(-0.3),
            }}
          >
            Order History
          </Text>
        </View>
      </View>

      {/* Summary card */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(18),
        }}
      >
        <View
          style={{
            backgroundColor: "#111214",
            borderWidth: normalize(1),
            borderColor: "#1e1f23",
            borderRadius: normalize(16),
            padding: normalize(16),
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: normalize(10),
                color: "#52525b",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: normalize(1),
                marginBottom: normalize(4),
              }}
            >
              Total Orders
            </Text>
            <Text
              style={{
                fontSize: normalize(22),
                color: "#f0f0f0",
                fontWeight: "800",
              }}
            >
              {orders.length}
            </Text>
          </View>

          <View
            style={{
              width: normalize(1),
              backgroundColor: "#1e1f23",
            }}
          />

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: normalize(10),
                color: "#52525b",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: normalize(1),
                marginBottom: normalize(4),
              }}
            >
              Delivered
            </Text>
            <Text
              style={{
                fontSize: normalize(22),
                color: "#22c55e",
                fontWeight: "800",
              }}
            >
              {orders.filter((o) => o.status === "delivered").length}
            </Text>
          </View>

          <View
            style={{
              width: normalize(1),
              backgroundColor: "#1e1f23",
            }}
          />

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: normalize(10),
                color: "#52525b",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: normalize(1),
                marginBottom: normalize(4),
              }}
            >
              Cancelled
            </Text>
            <Text
              style={{
                fontSize: normalize(22),
                color: "#ef4444",
                fontWeight: "800",
              }}
            >
              {orders.filter((o) => o.status === "cancelled").length}
            </Text>
          </View>
        </View>
      </View>

      {/* Filter tabs */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: normalize(20),
          marginBottom: normalize(18),
          gap: normalize(8),
        }}
      >
        {[
          { key: "all", label: "All" },
          { key: "delivered", label: "Delivered" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => setFilter(tab.key)}
            style={{
              paddingHorizontal: normalize(14),
              paddingVertical: normalize(7),
              borderRadius: normalize(10),
              backgroundColor:
                filter === tab.key ? "#d4a843" : "#1e1f23",
              borderWidth: normalize(1),
              borderColor:
                filter === tab.key ? "#d4a843" : "#2a2b30",
            }}
          >
            <Text
              style={{
                fontSize: normalize(12),
                fontWeight: "700",
                color:
                  filter === tab.key ? "#111214" : "#71717a",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders grouped by date */}
      <View style={{ paddingHorizontal: normalize(20) }}>
        {filtered.length === 0 ? (
          <EmptyHistory />
        ) : (
          Object.entries(grouped)
            .reverse()
            .map(([date, dateOrders], index) => (
              <View
                key={date + "-" + index}
                style={{ marginBottom: normalize(20) }}
              >
                {/* Date label */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: normalize(8),
                    marginBottom: normalize(12),
                  }}
                >
                  <Feather
                    name="calendar"
                    size={normalize(12)}
                    color="#52525b"
                  />
                  <Text
                    style={{
                      fontSize: normalize(11),
                      color: "#52525b",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: normalize(1.5),
                    }}
                  >
                    {date}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      height: normalize(1),
                      backgroundColor: "#1e1f23",
                    }}
                  />
                </View>

                {dateOrders.map((order, i) => (
                  <HistoryCard
                    key={order._id}
                    order={order}
                    index={i}
                  />
                ))}
              </View>
            ))
        )}
      </View>
    </ScrollView>
  );
}

export default History;
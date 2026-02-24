import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const STATS = [
  { label: "Today's Orders", value: "18", unit: "delivered" },
  { label: "Pending", value: "4", unit: "orders" },
  { label: "Earnings", value: "₹860", unit: "today" },
  { label: "Avg Time", value: "22", unit: "min/order" },
];

const ORDERS = [
  {
    id: 1,
    customer: "Rahul Sharma",
    address: "Sector 18, Noida",
    amount: "₹240",
    time: "12 min ago",
  },
  {
    id: 2,
    customer: "Priya Verma",
    address: "Alpha 1, Greater Noida",
    amount: "₹180",
    time: "35 min ago",
  },
  {
    id: 3,
    customer: "Amit Kumar",
    address: "Knowledge Park 2",
    amount: "₹320",
    time: "1 hr ago",
  },
];

function StatCard({ label, value, unit, delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
        width: (width - 68) / 2,
      }}
      className="bg-zinc-800 border border-zinc-700 rounded-3xl p-5"
    >
      <Text className="text-4xl font-black text-white tracking-tight">
        {value}
      </Text>
      <Text className="text-sm font-semibold text-indigo-500 mt-1 mb-3">
        {unit}
      </Text>
      <View className="h-px bg-zinc-700 mb-3" />
      <Text className="text-xs text-zinc-400 uppercase tracking-widest">
        {label}
      </Text>
    </Animated.View>
  );
}

function OrderRow({ item, index, last }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 80 + 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
      className={`flex-row items-center px-5 py-4 ${!last ? "border-b border-zinc-700" : ""}`}
    >
      {/* Index badge */}
      <View className="w-9 h-9 rounded-full bg-indigo-900/20 items-center justify-center mr-4">
        <Text className="text-xs font-black text-indigo-500">#{index + 1}</Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-white font-bold text-base leading-tight">
          {item.customer}
        </Text>
        <Text className="text-zinc-400 text-xs mt-0.5">{item.address}</Text>
      </View>

      {/* Meta */}
      <View className="items-end">
        <Text className="text-white font-black text-base">{item.amount}</Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <Text className="text-zinc-400 text-xs">{item.time}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    setLoggedIn(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setLoggedIn(!!token);
      setLoading(false);
    };
    checkAuth();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <Text className="text-zinc-400 text-sm tracking-widest">
          Loading...
        </Text>
      </View>
    );
  }

  if (!loggedIn) return <Redirect href="/(auth)/login" />;

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-12"
      >
        {/* ── Header ── */}
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-12, 0],
                }),
              },
            ],
          }}
          className="px-6 pt-6 pb-8"
        >
          {/* Top row */}
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-xs text-zinc-400 uppercase tracking-[3px] mb-1">
                Delivery Dashboard
              </Text>
              <Text className="text-3xl font-black text-white tracking-tight leading-tight">
                Lucky Jaiswal
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-2xl items-center justify-center"
            >
              <Text className="text-white text-sm font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Earnings highlight card */}
          <View className="bg-indigo-600 rounded-3xl px-6 py-5 flex-row justify-between items-center">
            <View>
              <Text className="text-indigo-200 text-xs uppercase tracking-widest mb-1">
                Total Earned
              </Text>
              <Text className="text-white text-4xl font-black tracking-tight">
                ₹860
              </Text>
              <Text className="text-indigo-300 text-xs mt-1">
                18 orders delivered today
              </Text>
            </View>
            <View className="items-end gap-2">
              <View className="bg-white/20 rounded-2xl px-3 py-1.5">
                <Text className="text-white text-xs font-semibold">
                  4 Pending
                </Text>
              </View>
              <View className="bg-emerald-400/20 rounded-2xl px-3 py-1.5">
                <Text className="text-emerald-300 text-xs font-semibold">
                  22 min avg
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── Stats Grid ── */}
        <View className="px-6 mb-8">
          <Text className="text-xs text-zinc-400 uppercase tracking-[2.5px] mb-4">
            Today's Summary
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {STATS.map((s, i) => (
              <StatCard key={i} {...s} delay={i * 80} />
            ))}
          </View>
        </View>

        {/* ── Recent Orders ── */}
        <View className="px-6">
          <Text className="text-xs text-zinc-400 uppercase tracking-[2.5px] mb-4">
            Recent Orders
          </Text>
          <View className="bg-zinc-800 border border-zinc-700 rounded-3xl overflow-hidden">
            {ORDERS.map((o, i) => (
              <OrderRow
                key={o.id}
                item={o}
                index={i}
                last={i === ORDERS.length - 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

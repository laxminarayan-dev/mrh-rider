import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const fetchOrdersData = async (setIsLoading, setOrdersData) => {
    setIsLoading(true);
    try {
        const riderId = await AsyncStorage.getItem("riderId") || "699c14039bdfc2203923f676";
        console.log("Backend URL:", BACKEND_URL);
        const response = await fetch(`${BACKEND_URL}/api/rider/orders/${riderId}`);
        const data = await response.json();
        setOrdersData(data);
    } catch (error) {
        console.error("Error fetching orders data:", error);
        setOrdersData([]);
    } finally {
        setIsLoading(false);
    }
};

export default fetchOrdersData;
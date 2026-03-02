import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const fetchRiderInfo = async (setIsLoading, setData) => {
    try {
        setIsLoading(true);
        const riderId = await AsyncStorage.getItem("riderId")
        if (!riderId) {
            console.error("No rider ID found in AsyncStorage");
            return null;
        }
        const response = await fetch(`${BACKEND_URL}/api/rider/profile/${riderId}`);
        if (!response.ok) {
            console.error("Failed to fetch rider info:", response.status);
            return null;
        }
        const data = await response.json();
        console.log("Fetched rider info:", data);
        setData(data);
        return data;
    } catch (error) {
        console.error("Error fetching rider info:", error);
        return null;
    } finally {
        setIsLoading(false);
    }
};

export default fetchRiderInfo;
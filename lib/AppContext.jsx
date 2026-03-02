import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from "react";
import fetchOrdersData from "../utils/db/fetchOrdersData";
import { socket } from "./socket";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [ordersData, setOrdersData] = useState([]);
    const [isOnline, setIsOnline] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [riderInfo, setRiderInfo] = useState(null);

    const handleActiveStatusChange = async (isOnline) => {
        const riderId = await AsyncStorage.getItem("riderId") || "699c14039bdfc2203923f676"; // Fallback to a default value if not found
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/rider/status/${riderId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isActive: isOnline }),
            });
            const data = await response.json();
            setIsOnline(data.isActive);
        } catch (error) {
            console.error("Error fetching active status:", error);
            setIsOnline(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initSocket = async () => {
            const riderId =
                (await AsyncStorage.getItem("riderId")) ||
                "699c14039bdfc2203923f676";

            if (!mounted) return;

            socket.connect();

            socket.emit("join:rider", riderId);

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
            });

            socket.on("order-assigned", (order) => {
                fetchOrdersData(setIsLoading, setOrdersData);
            });
            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });
        };

        initSocket();

        return () => {
            mounted = false;
            socket.off("connect");
            socket.off("disconnect");
            socket.off("order-assigned");

            socket.disconnect();
        };
    }, []);

    return (
        <AppContext.Provider value={{ isOnline, setIsOnline, ordersData, setOrdersData, isLoading, setIsLoading, handleActiveStatusChange, riderInfo, setRiderInfo }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}

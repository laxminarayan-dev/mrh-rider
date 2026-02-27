import { createContext, useContext, useState } from "react";
import ordersData from "../constants/test.orders.json";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [isOnline, setIsOnline] = useState(false);

    return (
        <AppContext.Provider value={{ isOnline, setIsOnline, ordersData }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}

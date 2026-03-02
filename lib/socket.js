import { io } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

console.log("Initializing socket with URL:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
    path: "/mrh-backend/socket.io",
    transports: ["websocket"], // important for RN
    autoConnect: false,
});
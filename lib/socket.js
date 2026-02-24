import AsyncStorage from '@react-native-async-storage/async-storage';

let ws = null;
let reconnectTimeout = null;
let isManuallyDisconnected = false;

// WebSocket URL (convert HTTP to WS)
const getWebSocketUrl = (httpUrl) => {
    return httpUrl.replace(/^http/, 'ws').replace(/\/$/, '');
};

// Connect to WebSocket server
export const initSocket = async (callback) => {
    try {
        const backendUrl = 'YOUR_BACKEND_URL'; // Replace with your actual backend URL
        const token = await AsyncStorage.getItem('userToken');

        if (!backendUrl || backendUrl === 'YOUR_BACKEND_URL') {
            console.warn('Socket: Backend URL not configured');
            return null;
        }

        const wsUrl = getWebSocketUrl(backendUrl);

        ws = new WebSocket(`${wsUrl}?token=${token}`);

        ws.onopen = () => {
            console.log('Socket connected');
            isManuallyDisconnected = false;

            // Identify client
            ws.send(JSON.stringify({
                type: 'connect',
                role: 'rider',
                token: token,
            }));
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'newOrder') {
                    console.log('New order received:', message.data);
                    if (callback) callback(message.data);
                } else if (message.type === 'orderAutoExpired') {
                    console.log('Order expired:', message.orderId);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('Socket error:', error);
        };

        ws.onclose = () => {
            console.log('Socket disconnected');
            ws = null;

            // Auto-reconnect if not manually disconnected
            if (!isManuallyDisconnected) {
                reconnectTimeout = setTimeout(() => {
                    initSocket(callback);
                }, 3000);
            }
        };

        return ws;
    } catch (error) {
        console.error('Failed to initialize socket:', error);
        return null;
    }
};

// Emit order acceptance
export const acceptOrder = (orderId) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'orderAccepted',
            orderId: orderId,
        }));
    } else {
        console.warn('Socket not connected, cannot accept order');
    }
};

// Emit order decline
export const declineOrder = (orderId) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'orderDeclined',
            orderId: orderId,
        }));
    } else {
        console.warn('Socket not connected, cannot decline order');
    }
};

// Get socket instance
export const getSocket = () => ws;

// Disconnect socket
export const disconnectSocket = () => {
    isManuallyDisconnected = true;

    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
    }

    if (ws) {
        ws.close();
        ws = null;
    }
};

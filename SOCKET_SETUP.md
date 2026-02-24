# New Order Popup & Socket Setup Guide

## Overview
The rider app now displays a popup notification whenever a new order arrives in real-time using Socket.IO.

## Features
- **Real-time notifications**: Orders appear instantly when assigned by admin
- **30-second expiration**: Orders auto-dismiss if not accepted within 30 seconds
- **Accept/Decline actions**: Riders can accept or decline orders directly from the popup
- **Order details**: Shows pickup location, delivery location, distance, earnings, and estimated time

## Setup Instructions

### 1. Configure Your Backend URL
Open `lib/socket.js` and replace `YOUR_BACKEND_URL` with your actual backend URL:

```javascript
const backendUrl = 'http://your-backend-url.com'; // e.g., 'http://localhost:3000'
```

### 2. Socket Events

#### Events Sent from App to Backend
- `orderAccepted` - Rider accepts an order
  ```javascript
  { orderId: "order_id" }
  ```
- `orderDeclined` - Rider declines an order
  ```javascript
  { orderId: "order_id" }
  ```

#### Events Received from Backend
- `newOrder` - New order assigned to rider
  ```javascript
  {
    id: "order_id",
    pickupLocation: { name: "Restaurant Name", address: "Address" },
    deliveryLocation: { name: "Customer Location", address: "Address" },
    distance: "2.5 km",
    earnings: 150,
    estimatedTime: "15",
    // ... other order details
  }
  ```
- `orderAutoExpired` - Order expired (if 30 seconds passed without acceptance)
  ```javascript
  { orderId: "order_id" }
  ```

### 3. Backend Implementation Example (Node.js + Socket.IO)

```javascript
const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

// Track rider connections
const riders = {};

io.on('connection', (socket) => {
  const { token } = socket.handshake.auth;
  const riderId = authenticateToken(token); // Your auth logic
  
  riders[riderId] = socket.id;

  // Listen for order acceptance
  socket.on('orderAccepted', ({ orderId }) => {
    console.log('Order accepted:', orderId);
    // Update database, assign order to rider, etc.
    io.emit('orderAssigned', { orderId, riderId });
  });

  // Listen for order decline
  socket.on('orderDeclined', ({ orderId }) => {
    console.log('Order declined:', orderId);
    // Offer order to another rider
    io.emit('orderAvailable', { orderId });
  });

  socket.on('disconnect', () => {
    delete riders[riderId];
  });
});

// When admin assigns a new order to a rider
function assignOrderToRider(riderId, order) {
  const socketId = riders[riderId];
  if (socketId) {
    io.to(socketId).emit('newOrder', order);
  }
}
```

### 4. Test the Popup
You can manually trigger the popup during development by modifying the index.jsx:

```javascript
// Add this after socket setup to test:
setTimeout(() => {
  handleNewOrder({
    id: 'test-order-123',
    pickupLocation: { name: 'Test Restaurant', address: '123 Main St' },
    deliveryLocation: { name: 'Test Address', address: '456 Test Ave' },
    distance: '2.5 km',
    earnings: 150,
    estimatedTime: '15'
  });
}, 3000);
```

## Components

### NewOrderPopup Component
Located in `components/mycomponents/NewOrderPopup.jsx`

**Props:**
- `visible` (boolean) - Whether popup should be shown
- `order` (object) - Order data to display
- `onAccept` (function) - Called when accept button is pressed
- `onDecline` (function) - Called when decline button is pressed

**Features:**
- Animated slide-up entrance
- Backdrop blur effect
- Order details with location pins
- Earnings and time estimates
- Accept/Decline buttons with different styles
- Auto-dismiss after 30 seconds

### Socket Helper Functions
Located in `lib/socket.js`

- `initSocket(callback)` - Initialize socket connection, callback fires when new order arrives
- `acceptOrder(orderId)` - Emit order acceptance
- `declineOrder(orderId)` - Emit order decline
- `getSocket()` - Get current socket instance
- `disconnectSocket()` - Cleanup and disconnect

## Popup Styling
The popup uses the app's luxury gray + golden yellow theme:
- Background: `#111113` with golden accent highlights
- Action buttons: Yellow accept button, red decline button
- Icons: MaterialCommunityIcons, Feather

## Auto-Dismiss Logic
Orders automatically disappear after 30 seconds if not accepted. This timer is set when:
1. `newOrder` event is received from socket
2. Popup is displayed
3. A `setTimeout` with 30-second duration closes the popup

You can adjust this timing in the `handleNewOrder` function in `app/(tabs)/index.jsx`.

## Troubleshooting

### Popup not appearing?
1. Check socket connection in console: `initSocket` should log "Socket connected"
2. Verify backend URL is correct in `lib/socket.js`
3. Check that backend is emitting `newOrder` events properly
4. Ensure authentication token is valid

### Socket connection fails?
1. Check CORS settings on backend
2. Verify token in socket auth header
3. Check network connectivity
4. Review socket.io version compatibility

### Orders not persisting after acceptance?
- Implement order persistence in your backend
- Update ORDERS array in index.jsx with API call
- Consider using Redux or Zustand for state management

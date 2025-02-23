// src/services/pushNotification.ts
import { onMessage } from 'firebase/messaging';

const handleForegroundNotifications = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // Customize the notification or show a UI alert to the user
    alert(`New message: ${payload.notification?.title}`);
  });
};

handleForegroundNotifications();

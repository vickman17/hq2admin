// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendPushNotification = functions.firestore
  .document('chatRooms/{roomId}/messages/{messageId}')
  .onCreate((snapshot, context) => {
    const newMessage = snapshot.data();
    const roomId = context.params.roomId;
    const serviceProviderId = newMessage.senderId; // Assuming the service provider is the sender
    const adminId = "adminId"; // Use actual adminId

    // Get the recipient FCM token
    const userToken = "user-device-token"; // Get this from your database or local storage

    const message = {
      notification: {
        title: 'New Message',
        body: newMessage.message,
      },
      token: userToken,
    };

    // Send the message to the device
    return admin.messaging().send(message);
  });

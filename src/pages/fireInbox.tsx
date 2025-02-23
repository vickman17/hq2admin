import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  IonPage,
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonText,
  IonHeader,
} from "@ionic/react";

// Define the type for a chat room object
interface ChatRoom {
  roomId: string;
  jobId: string;
  userId: string;
}

const FireInbox: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]); // Use proper typing

  const adminId = sessionStorage.getItem("adminId"); // Replace with actual admin ID

  const handleRoomClick = (roomId: string, jobId: string) => {
    console.log("Navigating to Room ID:", roomId, "and Job ID:", jobId); // Log the IDs being navigated to
    // Navigate by changing the window location
    window.location.href = `/firechat/${roomId}/${jobId}`; // Direct navigation
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const chatRoomsRef = collection(db, 'chatRooms');
        const q = query(chatRoomsRef, where('adminId', '==', adminId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const rooms: ChatRoom[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Fetched Data for Room:", data); // Debugging to check fetched data
            return {
              roomId: doc.id,
              jobId: data.jobId, // Ensure jobId is correctly assigned
              userId: data.userId, // Ensure userId is correctly assigned
            };
          });

          setChatRooms(rooms);

          // Log all roomIds and jobIds
          rooms.forEach((room) => {
            console.log("Room ID:", room.roomId, "Job ID:", room.jobId);
          });
        } else {
          console.log("No chat rooms found for adminId:", adminId);
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, [adminId]);

  return (
    <IonPage>
      <IonHeader>Inbox</IonHeader>
      <IonContent>
        <IonList>
          {chatRooms.map((chatRoom) => {
            console.log("Rendering Room ID:", chatRoom.roomId, "Job ID:", chatRoom.jobId); // Log each roomId and jobId during rendering
            return (
              <IonItem
                key={chatRoom.roomId}
                onClick={() => handleRoomClick(chatRoom.roomId, chatRoom.jobId)}
              >
                <IonLabel>
                  <h2>Job ID: {chatRoom.jobId}</h2>
                  <IonText>
                    <p>Room ID: {chatRoom.roomId}</p>
                    <p>Receiver: {chatRoom.userId}</p>
                  </IonText>
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FireInbox;

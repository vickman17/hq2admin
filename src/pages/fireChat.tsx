import React, { useEffect, useState } from 'react';
import {IonPage} from "@ionic/react";
import { db } from '../firebase/firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

interface Message {
  senderId: string;
  message: string;
  timestamp: string;
}

const fireChat: React.FC = () => {
  const { roomId, jobId } = useParams<{ roomId: string; jobId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const sspId = sessionStorage.getItem("adminId");

  useEffect(() => {
    if (!roomId || !jobId) return;

    setLoading(true);

    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      snapshot.forEach((doc) => {
        newMessages.push(doc.data() as Message);
      });
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId, jobId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !roomId) return;

    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    await addDoc(messagesRef, {
      senderId: "2", // Replace with the actual sender ID
      message: newMessage,
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  if (!roomId || !jobId || loading) {
    return <div>Loading chat room...</div>;
  }

  return (
    <IonPage>
      <div style={{overflowY: "auto"}}>
        <h2>Chat Room: {roomId}</h2>
        <h3>Job ID: {jobId}</h3>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.adminId}</strong>: {msg.message}
              <br />
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </IonPage>
);
};

export default fireChat;

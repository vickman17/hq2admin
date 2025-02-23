import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonText,
  IonFooter,
  IonToast,
} from '@ionic/react';
import axios from 'axios';

const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost/hq2sspapi/admin/messages.php');
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      } else {
        console.error('Invalid response structure:', response.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      await axios.delete(`http://localhost/hq2sspapi/admin/messages.php/${id}`);
      setToastMessage('Message deleted successfully!');
      fetchMessages(); // Refresh message list
    } catch (error) {
      console.error('Error deleting message:', error);
      setToastMessage('Failed to delete message!');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Inbox</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {messages.length > 0 ? (
            messages.map((message) => (
              <IonItem key={message.id}>
                <IonLabel>
                  <h2>{message.subject}</h2>
                  <p>From: {message.sender}</p>
                  <p>{message.preview}</p>
                </IonLabel>
                <IonButton color="primary" onClick={() => handleViewMessage(message)}>
                  View
                </IonButton>
                <IonButton color="danger" onClick={() => handleDeleteMessage(message.id)}>
                  Delete
                </IonButton>
              </IonItem>
            ))
          ) : (
            <p>No messages available.</p>
          )}
        </IonList>
      </IonContent>

      {/* Modal to View Message Details */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Message Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {selectedMessage && (
            <>
              <IonText>
                <h3>Subject: {selectedMessage.subject}</h3>
              </IonText>
              <IonText>
                <p>From: {selectedMessage.sender}</p>
              </IonText>
              <IonText>
                <p>{selectedMessage.content}</p>
              </IonText>
            </>
          )}
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButton expand="block" onClick={() => setShowModal(false)}>
              Close
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonModal>

      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => setToastMessage('')}
      />
    </IonPage>
  );
};

export default AdminInbox;

import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonIcon,
  IonHeader,
  IonModal,
  IonText,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { addCircleOutline, sendOutline } from 'ionicons/icons';
import { useParams, useLocation } from 'react-router-dom';



const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isJobPushed, setIsJobPushed] = useState<boolean>(false);  // New state to track if the job has been pushed
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const locationState = location.state as {
    chatName?: string;
    senderId?: string;
    jobId?: string;
    chatId?: string;
    senderName?: string;
    subChatName?: string;
  } | null;

  const chatName = locationState?.chatName || 'Chat';
  const senderId = locationState?.senderId || '';
  const jobId = locationState?.jobId || '';
  const chatId = locationState?.chatId || '';
  const senderName = locationState?.senderName || '';
  const subChatName = locationState?.subChatName || '';
  const [sent, setSent] = useState('');
  const adminId = sessionStorage.getItem('adminId');

  // Fetch messages based on chat_id and user_id
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost/hq2sspapi/admin/getMessage.php?chat_id=${chatId}&user_id=${adminId}`
        );
        const data = await response.json();
        setMessages(data);
        console.log(jobId)
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (chatId && adminId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Fetch every 10 seconds
      return () => clearInterval(interval);
    }
  }, [chatId, adminId]);

  // Scroll to the latest message on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch job details when the jobId is available
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response = await fetch(`http://localhost/hq2sspapi/admin/fetchJobDetails.php?jobId=${jobId}`);
          const data = await response.json();
          setJobDetails(data);
          
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Check if the job has been pushed (from localStorage)
  useEffect(() => {
    const pushedJob = localStorage.getItem(`job-${jobId}`);
    if (pushedJob) {
      setIsJobPushed(true);
    }
  }, [jobId]);

  // Handle message input field changes
  const handleInput = (event: React.FormEvent) => {
    const inputText = (event.target as HTMLTextAreaElement).value;
    setNewMessage(inputText);
    if (!isTyping && inputText.length > 0) {
      setIsTyping(true);
      setTypingUser(adminId);
    } else if (isTyping && inputText.length === 0) {
      setIsTyping(false);
      setTypingUser(null);
    }

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    }
  };

  // Send message to the server
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSent('Sending...');
    setNewMessage('');

    const messageData = {
      chat_id: chatId,
      sender_id: adminId,
      senderName: adminId,
      chatWithID: senderId,
      message: newMessage,
      chatName: chatName,
      subChatName: subChatName || "",
      jobId: jobId,
    };

    try {
      const response = await fetch('http://localhost/api/sendMessage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setMessages((prev) => [...prev, messageData]);
        setSent('Sent');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSent('Error occurred');
    } finally {
      setSent('');
    }
  };

  // Handle opening of job details modal
  const openJobDetailsModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing of job details modal
  const closeJobDetailsModal = () => {
    setIsModalOpen(false);
  };

  const pushJob = async () => {
    if (!jobDetails || isJobPushed) return;

    // Push job to service providers
    try {
      const response = await fetch('http://localhost/hq2sspapi/admin/pushJob.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId
        }),
      });

      if (response.ok) {
        console.log('Job pushed successfully');
        setIsJobPushed(true);
        localStorage.setItem(`job-${jobId}`, 'pushed');  // Store job as pushed
      } else {
        console.error('Failed to push job');
      }
    } catch (error) {
      console.error('Error pushing job:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <div>{subChatName} - {senderName}</div>
        <p>{sent}</p>

        <IonButton onClick={pushJob} disabled={isJobPushed}>Push Jobs</IonButton>
        <IonButton onClick={openJobDetailsModal}>JOB Details</IonButton>
      </IonHeader>
      <IonContent style={{ height: '50vh', overflowY: 'auto' }}>
        <IonList lines="none">
          {messages.map((msg, index) => (
            <IonItem key={index}>
              <div
                style={{
                  padding: '6px',
                  borderRadius: '.4rem',
                  fontSize: '19px',
                  textAlign: 'left',
                  background: msg.sender_id === adminId ? '#134d37' : 'grey',
                  margin: msg.sender_id === adminId ? '7px auto 0' : '7px auto 0 0',
                }}
              >
                {msg.message}
                <p
                  style={{
                    fontSize: '10px',
                    width: 'fit-content',
                    marginLeft: 'auto',
                    marginTop: '22px',
                  }}
                >
                  {msg.timestamp}
                </p>
              </div>
            </IonItem>
          ))}
          <div ref={messagesEndRef}></div>
        </IonList>
        {isTyping && typingUser !== adminId && (
          <div style={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>
            Typing...
          </div>
        )}
      </IonContent>
      <div>
        <textarea
          ref={textareaRef}
          value={newMessage}
          onInput={handleInput}
          placeholder="Type your message here..."
          style={{
            width: '100%',
            overflow: 'hidden',
            resize: 'none',
            boxSizing: 'border-box',
            outline: 'none',
            border: 'none',
            minHeight: '5px',
            maxHeight: '400px',
            background: 'transparent',
          }}
        ></textarea>
        {newMessage.trim().length > 0 ? (
          <IonIcon onClick={sendMessage} icon={sendOutline} />
        ) : (
          <IonIcon icon={addCircleOutline} />
        )}
      </div>

      {/* Job Details Modal */}
      <IonModal isOpen={isModalOpen} onDidDismiss={closeJobDetailsModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Job Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {jobDetails ? (
            <div>
              <IonText color="primary">
                <h2>Job Description</h2>
                <p>{jobDetails.job_description}</p>
              </IonText>
              <IonText>
                <h3>Service needed: {jobDetails.skill}</h3>
                <h3>House / Street Address: {jobDetails.address}</h3>
                <h3>Local Government: {jobDetails.local_government}</h3>
                <h3>State: {jobDetails.state}</h3>
                <h3>Status: {jobDetails.status}</h3>
                <h3>Created on: {jobDetails.created_at}</h3>
                <h3>Additional Details: {jobDetails.additional_details}</h3>
              </IonText>
            </div>
          ) : (
            <p>Loading job details...</p>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default ChatPage;

// src/components/ServiceProviderList.tsx
import React from 'react';
import { createChatRoom } from '../services/ChatServices';

const SSPList: React.FC = () => {



  const handleCreateChat = async (jobId: string, adminId: string, userId: string) => {
    const chatRoomId = await createChatRoom(jobId, adminId, userId);
    console.log(`Created chat room with ID: ${chatRoomId}`);
    // Redirect to the chat room
    // You can use React Router to navigate to the new chat room
  };

  return (
    <div>
      <h2>Service Providers</h2>
      <button onClick={() => handleCreateChat('33', '2', 'testedtester')}>Start Chat</button>
    </div>
  );
};


export default SSPList;

import { IonContent, IonModal } from '@ionic/react';
import React, { useEffect, useState } from 'react';

interface User {
  ssp_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone1: string | null;
  phone2: string | null;
  category_id: string | null;
  qualification: string | null;
  profile_picture: string | null;
}

const SspPush: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState(''); // New state for the title
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    // Fetch users from the backend
    fetch('http://localhost/hq2sspapi/admin/getSsp.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error('Unexpected response structure:', data);
        }
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.ssp_id));
    }
  };

  const handleSendNotification = () => {
    const notificationData = {
      userIds: selectedUsers.length === users.length ? 'all' : selectedUsers,
      title, // Include title in the notification data
      message,
    };

    fetch('http://localhost/hq2sspapi/admin/sendPushSsp.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Notification sent successfully!');
          setTitle(''); // Reset title after sending
          setMessage('');
          setSelectedUsers([]);
        } else {
          alert('Failed to send notification.');
        }
      })
      .catch((error) => console.error('Error sending notification:', error));
  };

  const handleViewMore = (user: User) => {
    setModalUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setModalUser(null);
    setOpenModal(false);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.toLowerCase();
    const email = user?.email?.toLowerCase() ?? '';
    const phone1 = user?.phone1?.toLowerCase() ?? '';
    const phone2 = user?.phone2?.toLowerCase() ?? '';
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      phone1.includes(searchQuery.toLowerCase()) ||
      phone2.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="ssp-push-container">
      <h2>Send Push Notification</h2>
      <input
        type="text"
        placeholder="Enter notification title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />
      <textarea
        className="message-input"
        placeholder="Enter your notification message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="user-list-container">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <div className="user-list">
          <div className="user-item select-all">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length}
              onChange={handleSelectAll}
            />
            <label>Select All</label>
          </div>
          {filteredUsers.map((user) => (
            <div className="user-item" key={user.ssp_id}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.ssp_id)}
                onChange={() => handleUserSelect(user.ssp_id)}
              />
              <label>
                {user.first_name} {user.last_name} ({user.email ?? 'N/A'}) - {user.phone1 ?? 'N/A'}
              </label>
              <button className="view-more-button" onClick={() => handleViewMore(user)}>
                View More
              </button>
            </div>
          ))}
        </div>
      </div>
      <button className="send-button" onClick={handleSendNotification} disabled={!message || !title}>
        Send Notification
      </button>

      {/* Modal */}
      {modalUser && (
        <IonModal isOpen={openModal} className="modal">
          <IonContent className="modal-content">
            <h3>User Details</h3>
            <p><strong>First Name:</strong> {modalUser.first_name}</p>
            <p><strong>Last Name:</strong> {modalUser.last_name}</p>
            <p><strong>Email:</strong> {modalUser.email}</p>
            <p><strong>Phone 1:</strong> {modalUser.phone1}</p>
            <p><strong>Phone 2:</strong> {modalUser.phone2}</p>
            <p><strong>Category ID:</strong> {modalUser.category_id}</p>
            <p><strong>Qualification:</strong> {modalUser.qualification}</p>
            {modalUser.profile_picture && (
              <div>
                <strong>Profile Picture:</strong>
                <img src={modalUser.profile_picture} alt="Profile" className="profile-picture" />
              </div>
            )}
            <button className="close-button" onClick={handleCloseModal}>
              Close
            </button>
          </IonContent>
        </IonModal>
      )}
    </div>
  );
};

export default SspPush;

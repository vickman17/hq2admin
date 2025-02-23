import React, { useEffect, useState } from 'react';
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonFooter,
  IonToast,
  IonAlert,
} from '@ionic/react';
import axios from 'axios';

const ManageAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]); // Added state for roles
  const [selectedRole, setSelectedRole] = useState<string>(''); // Ensure it's initialized as a string
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const userRole = sessionStorage.getItem("userRole");


  useEffect(() => {
    fetchAccounts();
    fetchCategories();
    fetchRoles(); // Fetch roles
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost/hq2sspapi/admin/accounts.php', {
        headers: { userRole },
      });
      if (response.data && response.data.accounts) {
        setAccounts(response.data.accounts);
      } else {
        console.error('Invalid response structure:', response.data);
        setAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccounts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost/hq2sspapi/admin/category.php', {
        headers: { userRole },
      });
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      } else {
        console.error('Invalid response structure:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost/hq2sspapi/admin/fetch_roles.php', {
        headers: { userRole },
      });
      if (response.data && Array.isArray(response.data.roles)) {
        setRoles(response.data.roles);
      } else {
        console.error('Invalid response structure:', response.data);
        setRoles([]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  const handleEdit = (account: any) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        'http://localhost/hq2sspapi/admin/accounts.php',
        selectedAccount,
        { headers: { userRole } }
      );
      setToastMessage('Account updated successfully!');
      fetchAccounts();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating account:', error);
      setToastMessage('Failed to update account!');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost/hq2sspapi/admin/accounts.php?id=${id}`, {
        headers: { userRole },
      });
      setToastMessage('Account deleted successfully!');
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      setToastMessage('Failed to delete account!');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSelectedAccount({ ...selectedAccount, [field]: value });
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Manage Accounts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <IonItem key={account.id}>
                <IonLabel>
                  <h2>{account.username}</h2>
                  <p>Role: {account.role}</p>
                  {account.role === 'supervisor' && (
                    <>
                      <p>Profession: {account.profession}</p>
                      <p>Category: {account.category}</p>
                    </>
                  )}
                </IonLabel>
                <IonButton color="primary" onClick={() => handleEdit(account)}>
                  Edit
                </IonButton>
                <IonButton
                  color="danger"
                  onClick={() => {
                    setSelectedAccount(account);
                    setShowAlert(true);
                  }}
                >
                  Delete
                </IonButton>
              </IonItem>
            ))
          ) : (
            <p>Loading accounts...</p>
          )}
        </IonList>
      </IonContent>

      {/* Modal for Editing Account */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {selectedAccount && (
            <>
              <IonItem>
                <IonLabel position="stacked">First Name</IonLabel>
                <IonInput
                  value={selectedAccount.first_name}
                  onIonChange={(e) => handleInputChange('firstName', e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Last Name</IonLabel>
                <IonInput
                  value={selectedAccount.last_name}
                  onIonChange={(e) => handleInputChange('lastName', e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput
                  value={selectedAccount.username}
                  onIonChange={(e) => handleInputChange('username', e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Role</IonLabel>
                <IonSelect
                  value={selectedRole} // Bind to selectedRole
                  onIonChange={(e) => {
                    setSelectedRole(e.detail.value!); // Update selectedRole
                    handleInputChange('role', e.detail.value!); // Also update the selected account's role
                  }}
                >
                  {roles.map((role) => (
                    <IonSelectOption key={role.id} value={role.role_name}>
                      {role.role_name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              {selectedAccount.role === 'supervisor' && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Profession</IonLabel>
                    <IonSelect
                      value={selectedAccount.profession || categories[0]?.category_name}
                      onIonChange={(e) => handleInputChange('profession', e.detail.value!)}
                    >
                      {categories.map((category) => (
                        <IonSelectOption key={category.id} value={category.category_name}>
                          {category.category_name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Category</IonLabel>
                    <IonInput
                      value={selectedAccount.category}
                      onIonChange={(e) => handleInputChange('category', e.detail.value!)}
                    />
                  </IonItem>
                </>
              )}
              <IonItem>
                <IonLabel position="stacked">Password (Optional)</IonLabel>
                <IonInput
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  onIonChange={(e) => handleInputChange('password', e.detail.value!)}
                />
              </IonItem>
            </>
          )}
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButton expand="block" color="primary" onClick={handleSave}>
              Save Changes
            </IonButton>
            <IonButton expand="block" color="light" onClick={() => setShowModal(false)}>
              Cancel
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonModal>

      {/* Alert for Confirming Delete */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Confirm Delete"
        message={`Are you sure you want to delete ${selectedAccount?.username}?`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => handleDelete(selectedAccount?.id),
          },
        ]}
      />

      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => setToastMessage('')}
      />
    </IonPage>
  );
};

export default ManageAccounts;

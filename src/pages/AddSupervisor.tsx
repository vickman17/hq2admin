import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonItem, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const AddSupervisor: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const history = useHistory();

  const handleAddSupervisor = async () => {
    try {
      const response = await fetch('http://localhost/hq2sspapi/admin/add_supervisor.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        history.push('/dashboard'); // Redirect to supervisor list after adding
      } else {
        setError('Failed to add supervisor');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div style={{ padding: '20px' }}>
          <IonLabel>Add Supervisor</IonLabel>
          {error && <IonText color="danger"><p>{error}</p></IonText>}
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput value={username} onIonChange={(e) => setUsername(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
          </IonItem>
          <IonButton expand="full" onClick={handleAddSupervisor}>Add Supervisor</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddSupervisor;

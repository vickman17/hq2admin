import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonItem, IonText } from '@ionic/react';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost/hq2sspapi/admin/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Save session or token here
        window.location.href = '/dashboard';  // Redirect to dashboard
        sessionStorage.setItem("userRole", result.role)
        sessionStorage.setItem("adminId", result.id)
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div style={{ padding: '20px' }}>
          <IonLabel>Login</IonLabel>
          {error && <IonText color="danger"><p>{error}</p></IonText>}
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput value={username} onIonChange={(e) => setUsername(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
          </IonItem>
          <IonButton expand="full" onClick={handleLogin}>Login</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

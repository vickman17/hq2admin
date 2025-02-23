import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonList, IonItem, IonLabel, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const history = useHistory();

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch('http://localhost/hq2sspapi/admin/supervisors.php', {
          method: 'GET',
          headers: {
            'Role': 'super_admin', // Add role in the request header to differentiate admin and supervisors
          },
        });

        const data = await response.json();
        console.log(data);
        setSupervisors(data);
      } catch (error) {
        setError('An error occurred while fetching supervisors.');
      }
    };

    fetchSupervisors();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div style={{ padding: '20px' }}>
          <IonLabel>Dashboard</IonLabel>
          {error && <IonText color="danger"><p>{error}</p></IonText>}
          <IonButton expand="full" onClick={() => history.push('/add-supervisor')}>Add Supervisor</IonButton>
          <IonButton expand="full" onClick={() => history.push('/manageaccount')}>Manage Account</IonButton>
          <IonButton routerLink="/inbox">Go to Inbox</IonButton>

          <IonList>
            {supervisors.length === 0 ? (
              <IonText>No supervisors found</IonText>
            ) : (
              supervisors.map((supervisor, index) => (
                <IonItem key={index}>
                  <IonLabel>{supervisor.username}</IonLabel>
                </IonItem>
              ))
            )}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

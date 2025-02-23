import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonText } from '@ionic/react';

const SupervisorsList: React.FC = () => {
  const [supervisors, setSupervisors] = useState<any[]>([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch('http://localhost/hq2sspapi/admin/supervisors.php');
        const data = await response.json();
        setSupervisors(data);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
      }
    };

    fetchSupervisors();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div style={{ padding: '20px' }}>
          <IonLabel>Supervisors List</IonLabel>
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

export default SupervisorsList;

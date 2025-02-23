import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import AddSupervisor from './pages/AddSupervisor';
import SupervisorsList from './pages/SupervisorsList';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import ManageAccounts from './pages/ManageAccounts';
import AdminInbox from './pages/AdminInbox';
import Inbox from "./pages/Inbox";
import AddRoles from './pages/AddRoles';
import ChatPage from './pages/ChatPage';
import SspPush from './pages/SspPush';
import fireChat from './pages/fireChat';
import SSPList from './pages/SSPList';
import fireInbox from './pages/fireInbox';
import { messaging, getToken } from './firebase/firebaseConfig';

setupIonicReact();

const App: React.FC = () => {
 
  const requestPushNotificationPermission = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY // Get this key from Firebase Console > Cloud Messaging > Web Push certificates
      });
  
      if (currentToken) {
        console.log("FCM Token:", currentToken); // Send this token to your server for sending notifications
        // Save the token in the database or local storage
      } else {
        console.log("No registration token available.");
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };
  
  // Call this function when the component mounts
  requestPushNotificationPermission();


 
return(
   <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
      <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/supervisors" component={SupervisorsList} />
        <Route path="/add-supervisor" component={AddSupervisor} />
        <Route path="/manageaccount" component={ManageAccounts} />
        <Route path="/inbox" component={Inbox} />
        <Route path='/chatpage' component={ChatPage} />
        <Route path='/addroles' component={AddRoles} />
        <Route path='/ssppush' component={SspPush} />
        <Route path="/ssplist" component={SSPList} />
        <Route path="/firechat/:roomId/:jobId" component={fireChat} />
        <Route path="/fireInbox" component={fireInbox} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
};

export default App;

import './App.css';

import { auth, db } from './config/firebase';
import { createContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LoginForm from './components/LoginForm';
import NavMenu from './components/NavMenu';
import Settings from './components/settings/Settings';
import { ToastProvider } from 'react-toast-notifications';

export const AuthContext = createContext({
  currentUser: null,
  userSnapshot: null
});

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userSnapshot, setUserSnapshot] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        setUserSnapshot(null);
        setCurrentUser(null);
        return;
      }

      db.collection('users').where('email', '==', user.email).get().then(querySnapshot => {
        if (querySnapshot.size === 1) {
          querySnapshot.forEach(doc => {
            const data = doc.data();
            if (['editor', 'admin', 'superadmin'].includes(data.role)) {
              setUserSnapshot(doc);
              setCurrentUser(user);
            }
          });
        }
      });
    });
  }, []);

  return currentUser && userSnapshot ? (
    <AuthContext.Provider value={{ currentUser, userSnapshot }}>
    <Router>
    <ToastProvider
      autoDismiss={true}
      placement="bottom-center"
    >
      <NavMenu
        currentUser={currentUser}
        userSnapshot={userSnapshot}
      />
      <div className="page-content">
        <Switch>
          <Route path="/news">
            {/* <News /> */}
          </Route>
          <Route path="/pages">
            {/* <Pages /> */}
          </Route>
          <Route path="/categories">
            {/* <Categories /> */}
          </Route>
          <Route path="/users">
            {/* <Users /> */}
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
        </Switch>
      </div>
    </ToastProvider>
    </Router>
    </AuthContext.Provider>
  ) : (
    <LoginForm />
  );
}
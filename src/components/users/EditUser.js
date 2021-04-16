import {
  Link,
  useHistory,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { config } from '../../config/app';
import { db } from '../../config/firebase';
import { useToasts } from 'react-toast-notifications';

export default function ChangePassword() {
  const [userData, setUserData] = useState(null);
  const [locations, setLocations] = useState(null);
  const history = useHistory();
  const { addToast } = useToasts();
  const { id } = useParams();

  useEffect(() => {
    db.collection('locations').get().then(querySnapshot => {
      const docs = [];
      querySnapshot.forEach(doc => {
        docs.push(doc);
      });
      setLocations(docs);
    });
  }, []);

  useEffect(() => {
    db.collection('users').doc(id).get().then(doc => {
      const userData = doc.data();
      if (!userData) {
        addToast('User not found', {
          appearance: 'error'
        });
        history.push('/users');
      } else {
        setUserData(doc.data());
      }
    }).catch(error => {
      addToast(error.message, {
        appearance: 'error'
      });
      history.push('/users');
    });
  }, [addToast, history, id]);

  const handleSubmit = e => {
    e.stopPropagation();
    e.preventDefault();

    db.collection('users').doc(id).update(userData).then(() => {
      addToast('User saved', {
        appearance: 'success'
      });
      history.push('/users');
    }).catch(error => {
      addToast(error.message, {
        appearance: 'error'
      });
    });
  };

  return (
    <>
      <h1>Edit User</h1>
      <div className="page-actions">
        <Link to="/users">Go back</Link>
      </div>
      {!userData ? <p>Loading data...</p> : <>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <label htmlFor="firstName">First name:</label>
            <input
              id="firstName"
              onChange={e => setUserData(userData => ({ ...userData, firstName: e.target.value }))}
              value={userData.firstName}
            />
          </div>
          <div className="input-row">
            <label htmlFor="lastName">Last name:</label>
            <input
              id="lastName"
              onChange={e => setUserData(userData => ({ ...userData, lastName: e.target.value }))}
              value={userData.lastName}
            />
          </div>
          <div className="input-row">
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              onChange={e => setUserData(userData => ({ ...userData, language: e.target.value }))}
              value={userData.language}
            >
              {config.languages.map(lang => <option
                key={lang}
                value={lang}>{config.languageNames[lang]}</option>)}
            </select>
          </div>
          <div className="input-row">
            <label htmlFor="deviceId">Device ID:</label>
            <input
              id="deviceId"
              onChange={e => setUserData(userData => ({ ...userData, deviceId: e.target.value }))}
              value={userData.deviceId}
            />
          </div>
          <div className="input-row">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              onChange={e => setUserData(userData => ({ ...userData, role: e.target.value }))}
              value={userData.role}
            >
              {config.roles.map(role => <option
                key={role}
                value={role}>{role}</option>)}
            </select>
          </div>
          <div className="input-row">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              onChange={e => setUserData(userData => ({ ...userData, status: e.target.value }))}
              value={userData.status}
            >
              {config.statuses.map(status => <option
                key={status}
                value={status}>{status}</option>)}
            </select>
          </div>
          {
            locations && 
            <div className="input-row">
              <label htmlFor="locations">Locations:</label>
              <select
                id="status"
                multiple
                onChange={e => setUserData(userData => ({ ...userData,
                  locations: Array.from(e.target.options).filter(item => item.selected).map(item => item.value)
                }))}
                size="6"
                value={userData.locations}
              >
                {locations.map(doc => <option
                  key={doc.id}
                  value={doc.id}>{doc.data().title}</option>)}
              </select>
            </div>
          }
          <div className="input-submit">
            <button type="submit">Save</button>
          </div>
        </form>
      </>}
    </>
  );
}

/* eslint jsx-a11y/anchor-is-valid: 0 */

import {
  Link,
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
import { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import ChangePassword from './ChangePassword';
import { config } from '../../config/app';
import { useToasts } from 'react-toast-notifications';

export default function Settings() {
  const { userSnapshot } = useContext(AuthContext);
  const userData = (userSnapshot && userSnapshot.data()) || {};
  const match = useRouteMatch();
  const { addToast } = useToasts();

  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [language, setLanguage] = useState(userData.language);

  const handleSubmit = e => {
    e.stopPropagation();
    e.preventDefault();

    userSnapshot.ref.update({
      firstName, lastName, language
    }).then(() => {
      addToast('Settings saved', {
        appearance: 'success'
      });
    }).catch(error => {
      addToast(error.message, {
        appearance: 'error'
      });
    });
  };

  return (
    <Switch>
      <Route path={`/settings/change-password`}>
        <ChangePassword />
      </Route>
      <Route path={match.path}>
        <h1>Settings</h1>
        <div className="page-actions">
          <Link to="/settings/change-password">Change password</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <label>Email:</label>
            {userData.email}
          </div>
          <div className="input-row">
            <label>Role:</label>
            {userData.role}
          </div>
          <div className="input-row">
            <label>Locations:</label>
            {userData.locations.join(', ')}
          </div>
          <div className="input-row">
            <label htmlFor="firstName">First name:</label>
            <input
              id="firstName"
              onChange={e => setFirstName(e.target.value)}
              type="text"
              value={firstName}
            />
          </div>
          <div className="input-row">
            <label htmlFor="lastName">Last name:</label>
            <input
              id="lastName"
              onChange={e => setLastName(e.target.value)}
              type="text"
              value={lastName}
            />
          </div>
          <div className="input-row">
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              onChange={e => setLanguage(e.target.value)}
              value={language}
            >
              {config.languages.map(lang => <option
                key={lang}
                value={lang}>{config.languageNames[lang]}</option>)}
            </select>
          </div>
          <div className="input-submit">
            <button type="submit">Save</button>
          </div>
        </form>
      </Route>
    </Switch>
  );
}

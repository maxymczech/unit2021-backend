/* eslint jsx-a11y/anchor-is-valid: 0 */

import {
  Link,
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
import { AuthContext } from '../../App';
import ChangePassword from './ChangePassword';
import { auth } from '../../config/firebase';
import { useContext } from 'react';

export default function Settings() {
  const { currentUser, userSnapshot } = useContext(AuthContext);
  const userData = (userSnapshot && userSnapshot.data()) || {};
  const match = useRouteMatch();

  const handleSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Switch>
      <Route path={`${match.path}/change-password`}>
        <ChangePassword />
      </Route>
      <Route path={match.path}>
        <h1>Settings</h1>
        <div className="page-actions">
          <Link to={`${match.path}/change-password`}>Change password</Link>
        </div>
        <form onSubmit={handleSubmit}>
        </form>
      </Route>
    </Switch>
  );
}

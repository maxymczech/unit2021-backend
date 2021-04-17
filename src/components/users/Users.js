/* eslint jsx-a11y/anchor-is-valid: 0 */

import {
  Link,
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
import { auth, db } from '../../config/firebase';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import ChangePassword from './ChangePassword';
import EditUser from './EditUser';
import { useToasts } from 'react-toast-notifications';

export default function Users() {
  const { userSnapshot } = useContext(AuthContext);
  const userData = (userSnapshot && userSnapshot.data()) || {};
  const [users, setUsers] = useState([]);
  const match = useRouteMatch();
  const { addToast } = useToasts();

  const isSuperadmin = ['superadmin'].includes(userData.role);
  const isAdmin = ['admin'].includes(userData.role);

  const sendResetPasswordEmail = email => {
    if (email && window.confirm(`Do you really want to send password reset email to ${email}?`)) {
      auth.sendPasswordResetEmail(email).then(() => {
        addToast('Email with password reset link sent', {
          appearance: 'success'
        });
      }).catch(error => {
        addToast(error.message, {
          appearance: 'error'
        });
      });
    }
  }

  useEffect(() => {
    let query = db.collection('users');
    if (isAdmin) {
      query = query.where('locations', 'array-contains-any', userData.locations);
    }
    if (isAdmin || isSuperadmin) {
      query.onSnapshot(querySnapshot => {
        const docs = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (!isSuperadmin && data.role === 'superadmin') {
            return;
          }
          docs.push(doc);
        });
        setUsers(docs)
      });
    }
  }, [isSuperadmin, isAdmin, setUsers]);

  return (isAdmin || isSuperadmin) ? (
    <Switch>
      <Route path="/users/change-password/:id">
        <ChangePassword />
      </Route>
      <Route path="/users/edit/:id">
        <EditUser />
      </Route>
      <Route path={match.path}>
        <h1>User Management</h1>
        {!users.length ? <p>Loading data...</p> : <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Location</th>
              <th>Status</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => <tr key={user.id}>
              <td>{`${user.data().firstName} ${user.data().lastName}`}</td>
              <td>{user.data().email}</td>
              <td>{user.data().role}</td>
              <td>{user.data().locations.join(', ')}</td>
              <td>{user.data().status}</td>
              <td className="table-actions">
                <Link to={`/users/edit/${user.id}`}>Edit</Link>
                {/*
                {' '}
                <Link to={`/users/change-password/${user.id}`}>Change password</Link>
                */}
                {' '}
                <a href="#" onClick={() => sendResetPasswordEmail(user.data().email)}>Reset password</a>
              </td>
            </tr>)}
          </tbody>
        </table>}
      </Route>
    </Switch>
  ) : <>
    <h1>Access error</h1>
  </>;
}

/* eslint jsx-a11y/anchor-is-valid: 0 */

import {
  Link,
  useHistory
} from 'react-router-dom';
import { AuthContext } from '../App';
import { auth } from '../config/firebase';
import { useContext } from 'react';

export default function NavMenu() {
  const { userSnapshot } = useContext(AuthContext);
  const userData = (userSnapshot && userSnapshot.data()) || {};
  const history = useHistory();

  return (
    <ul className="nav-menu">
      <li><Link to="/news">News</Link></li>
      <li><Link to="/pages">Pages</Link></li>
      {/* ['admin', 'superadmin'].includes(userData.role) && <li><Link to="/categories">Categories</Link></li> */}
      {['admin', 'superadmin'].includes(userData.role) && <li><Link to="/users">User management</Link></li>}
      <li><Link to="/settings">Settings</Link></li>
      <li><a href="#" onClick={e => { e.preventDefault(); auth.signOut(); history.push('/'); }}>Sign out</a></li>
    </ul>
  );
}

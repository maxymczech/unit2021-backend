/* eslint jsx-a11y/anchor-is-valid: 0 */

import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { useContext } from 'react';

export default function NavMenu() {
  const { userSnapshot } = useContext(AuthContext);
  const userData = (userSnapshot && userSnapshot.data()) || {};
  return (
    <ul className="nav-menu">
      <li><Link to="/news">News</Link></li>
      <li><Link to="/pages">Pages</Link></li>
      {['admin', 'superadmin'].includes(userData.role) && <li><Link to="/categories">Categories</Link></li>}
      {['admin', 'superadmin'].includes(userData.role) && <li><Link to="/users">User management</Link></li>}
      <li><Link to="/settings">Settings</Link></li>
      <li><a href="#" onClick={e => { e.preventDefault(); auth.signOut() }}>Sign out</a></li>
    </ul>
  );
}

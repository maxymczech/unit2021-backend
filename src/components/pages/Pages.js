/* eslint jsx-a11y/anchor-is-valid: 0 */

import {
  Link,
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import NewPage from './NewPage';
import EditPage from './EditPage';
import { db } from '../../config/firebase';
import { useToasts } from 'react-toast-notifications';

export default function Users() {
  const { userSnapshot } = useContext(AuthContext);
  const userData = (userSnapshot && userSnapshot.data()) || {};
  const userId = (userSnapshot && userSnapshot.id) || '';
  const [pages, setPages] = useState([]);
  const match = useRouteMatch();
  const { addToast } = useToasts();

  const isSuperadmin = ['superadmin'].includes(userData.role);
  const isEditor = ['editor'].includes(userData.role);

  useEffect(() => {
    let query = db.collection('pages');
    if (!isSuperadmin) {
      query = query.where('locations', 'array-contains-any', userData.locations);
    }
    if (isEditor) {
      query = query.where('author', '==', userId);
    }
    query.onSnapshot(querySnapshot => {
      const docs = [];
      querySnapshot.forEach(doc => {
        const docData = doc.data();
        if (!isSuperadmin && !docData.locations.every(loc => userData.locations.includes(loc))) {
          return;
        }
        docs.push(doc);
      });
      setPages(docs)
    });
  }, [isSuperadmin, isEditor, userId]);

  const deletePage = id => {
    if (window.confirm('Do you really want to delete this page?')) {
      db.collection('pages').doc(id).delete().then(() => {
        addToast('Page was deleted', {
          appearance: 'success'
        });
      }).catch(error => {
        addToast(error.message, {
          appearance: 'error'
        });
      });
    }
  }

  return (
    <Switch>
      <Route path="/pages/new">
        <NewPage />
      </Route>
      <Route path="/pages/edit/:id">
        <EditPage />
      </Route>
      <Route path={match.path}>
        <h1>Pages</h1>
        <div className="page-actions">
          <Link to="/pages/new">Create page</Link>
        </div>
        {!pages.length ? <p></p> : <table className="data-table">
          <thead>
            <tr>
              {/* <th>Icon</th> */}
              <th>Title</th>
              <th>Location</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => <tr key={page.id}>
              {/* <td>{page.data().icon && <img src={page.data().icon} className="icon" alt="icon" />}</td> */}
              <td>{page.data().title_en || page.data().title_cs}</td>
              <td>{(page.data().locations || []).join(', ')}</td>
              <td className="table-actions">
                <Link to={`/pages/edit/${page.id}`}>Edit</Link>
                {' '}
                <a href="#" onClick={() => { deletePage(page.id) }}>Delete</a>
              </td>
            </tr>)}
          </tbody>
        </table>}
      </Route>
    </Switch>
  );
}

/* eslint jsx-a11y/anchor-is-valid: 0 */

import {
  Link,
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import NewNews from './NewNews';
import EditNews from './EditNews';
import { config } from '../../config/app';
import { db } from '../../config/firebase';
import formatDate from '../../utils/format-date';
import { useToasts } from 'react-toast-notifications';

export default function Users() {
  const { userSnapshot } = useContext(AuthContext);
  const userData = (userSnapshot && userSnapshot.data()) || {};
  const userId = (userSnapshot && userSnapshot.id) || '';
  const [news, setNews] = useState([]);
  const match = useRouteMatch();
  const { addToast } = useToasts();

  const isSuperadmin = ['superadmin'].includes(userData.role);
  const isEditor = ['editor'].includes(userData.role);

  useEffect(() => {
    let query = db.collection('news');
    if (!isSuperadmin) {
      query = query.where('locations', 'array-contains-any', userData.locations);
    }
    if (isEditor) {
      query = query.where('author', '==', userId);
    }
    query.orderBy('itemDate', 'desc').onSnapshot(querySnapshot => {
      const docs = [];
      querySnapshot.forEach(doc => {
        docs.push(doc);
      });
      setNews(docs)
    });
  }, [isSuperadmin, isEditor, userId]);

  const deleteNews = id => {
    if (window.confirm('Do you really want to delete this news item?')) {
      db.collection('news').doc(id).delete().then(() => {
        addToast('News item was deleted', {
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
      <Route path="/news/new">
        <NewNews />
      </Route>
      <Route path="/news/edit/:id">
        <EditNews />
      </Route>
      <Route path={match.path}>
        <h1>News</h1>
        <div className="page-actions">
          <Link to="/news/new">Create news item</Link>
        </div>
        {!news.length ? <p></p> : <table className="data-table">
          <thead>
            <tr>
              {/* <th>Icon</th> */}
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Location</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => <tr key={item.id}>
              <td>{item.data().title_en || item.data().title_cs}</td>
              <td>{config.typeNames[item.data().type]}</td>
              <td>{formatDate(item.data().itemDate.toDate())}</td>
              <td>{(item.data().locations || []).join(', ')}</td>
              <td className="table-actions">
                <Link to={`/news/edit/${item.id}`}>Edit</Link>
                {' '}
                <a href="#" onClick={() => { deleteNews(item.id) }}>Delete</a>
              </td>
            </tr>)}
          </tbody>
        </table>}
      </Route>
    </Switch>
  );
}

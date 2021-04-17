import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {
  Link,
  useHistory,
  useParams
} from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { config } from '../../config/app';
import { db } from '../../config/firebase';
import { useToasts } from 'react-toast-notifications';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

export default function ChangePassword() {
  const { userSnapshot } = useContext(AuthContext);
  const [pageData, setPageData] = useState(null);
  const [locations, setLocations] = useState(null);
  const history = useHistory();
  const { addToast } = useToasts();
  const { id } = useParams();
  const userData = (userSnapshot && userSnapshot.data()) || {};
  const isSuperadmin = ['superadmin'].includes(userData.role);

  const [editorState_cs, setEditorState_cs] = useState(EditorState.createEmpty());
  const [editorState_en, setEditorState_en] = useState(EditorState.createEmpty());

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
    db.collection('pages').doc(id).get().then(doc => {
      const pageData = doc.data();
      if (!pageData) {
        addToast('Page not found', {
          appearance: 'error'
        });
        history.push('/pages');
      } else {
        const pageData = doc.data();
        setPageData(pageData);
        setEditorState_cs(EditorState.createWithContent(stateFromHTML(pageData.content_cs)));
        setEditorState_en(EditorState.createWithContent(stateFromHTML(pageData.content_en)));
      }
    }).catch(error => {
      addToast(error.message, {
        appearance: 'error'
      });
      history.push('/pages');
    });
  }, [addToast, history, id]);

  const handleSubmit = e => {
    e.stopPropagation();
    e.preventDefault();

    db.collection('pages').doc(id).update({
      ...pageData,
      content_cs: stateToHTML(editorState_cs.getCurrentContent()),
      content_en: stateToHTML(editorState_en.getCurrentContent())
    }).then(() => {
      addToast('Page saved', {
        appearance: 'success'
      });
      history.push('/pages');
    }).catch(error => {
      addToast(error.message, {
        appearance: 'error'
      });
    });
  };

  return (
    <>
      <h1>Edit Page</h1>
      <div className="page-actions">
        <Link to="/pages">Go back</Link>
      </div>
      {!pageData ? <p>Loading data...</p> : <>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <label htmlFor="title_cs">Title (cs):</label>
            <input
              id="title_cs"
              onChange={e => setPageData(pageData => ({ ...pageData, title_cs: e.target.value }))}
              type="text"
              value={pageData.title_cs}
            />
          </div>
          <div className="input-row">
            <label htmlFor="title_en">Title (en):</label>
            <input
              id="title_en"
              onChange={e => setPageData(pageData => ({ ...pageData, title_en: e.target.value }))}
              type="text"
              value={pageData.title_en}
            />
          </div>
          {/*
          <div className="input-row">
            <label htmlFor="icon">Icon:</label>
            <input
              id="icon"
              onChange={e => setPageData(pageData => ({ ...pageData, icon: e.target.value }))}
              value={pageData.icon}
            />
          </div>
          */}
          {
            locations && 
            <div className="input-row">
              <label htmlFor="locations">Locations:</label>
              <select
                id="locations"
                multiple
                onChange={e => setPageData(pageData => ({ ...pageData,
                  locations: Array.from(e.target.options).filter(item => item.selected).map(item => item.value)
                }))}
                size="6"
                value={pageData.locations}
              >
                {locations.filter(doc => {
                  if (isSuperadmin) return true;
                  return userData.locations.includes(doc.id)
                }).map(doc => <option
                  key={doc.id}
                  value={doc.id}>{doc.data().title}</option>)}
              </select>
            </div>
          }
          <div className="input-row">
            <label htmlFor="preview_cs">Preview (cs):</label>
            <input
              id="preview_cs"
              onChange={e => setPageData(pageData => ({ ...pageData, preview_cs: e.target.value }))}
              type="text"
              value={pageData.preview_cs}
            />
          </div>
          <div className="input-row">
            <label htmlFor="preview_en">Preview (en):</label>
            <input
              id="preview_en"
              onChange={e => setPageData(pageData => ({ ...pageData, preview_en: e.target.value }))}
              type="text"
              value={pageData.preview_en}
            />
          </div>
          <div className="wysiwyg-row">
            <label>Page content (cs)</label>
            <Editor
              editorState={editorState_cs}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={editorState => setEditorState_cs(editorState)}
              toolbar={{
                options: config.editorOptions
              }}
            />
          </div>
          <div className="wysiwyg-row">
            <label>Page content (en)</label>
            <Editor
              editorState={editorState_en}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={editorState => setEditorState_en(editorState)}
              toolbar={{
                options: config.editorOptions
              }}
            />
          </div>
          <div className="input-submit">
            <button type="submit">Save</button>
          </div>
        </form>
      </>}
    </>
  );
}

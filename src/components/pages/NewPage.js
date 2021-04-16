import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {
  Link,
  useHistory,
} from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { config } from '../../config/app';
import { db } from '../../config/firebase';
import { useToasts } from 'react-toast-notifications';
import { stateToHTML } from 'draft-js-export-html';

export default function ChangePassword() {
  const { userSnapshot } = useContext(AuthContext);
  const userId = (userSnapshot && userSnapshot.id) || '';
  const [pageData, setPageData] = useState({
    author: userId,
    content_cs: '',
    content_en: '',
    // icon: '',
    locations: [],
    title_cs: '',
    title_en: ''
  });
  const [locations, setLocations] = useState(null);
  const history = useHistory();
  const { addToast } = useToasts();

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

  const handleSubmit = e => {
    e.stopPropagation();
    e.preventDefault();

    db.collection('pages').doc().set({
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
      <h1>Create Page</h1>
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
              value={pageData.title_cs}
            />
          </div>
          <div className="input-row">
            <label htmlFor="title_en">Title (en):</label>
            <input
              id="title_en"
              onChange={e => setPageData(pageData => ({ ...pageData, title_en: e.target.value }))}
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
                {locations.map(doc => <option
                  key={doc.id}
                  value={doc.id}>{doc.data().title}</option>)}
              </select>
            </div>
          }
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

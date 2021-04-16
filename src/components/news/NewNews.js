import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {
  Link,
  useHistory,
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { config } from '../../config/app';
import { db } from '../../config/firebase';
import { useToasts } from 'react-toast-notifications';
import { stateToHTML } from 'draft-js-export-html';

export default function ChangePassword() {
  const [newsData, setNewsData] = useState({
    content_cs: '',
    content_en: '',
    itemDate: new Date(),
    locations: [],
    title_cs: '',
    title_en: '',
    type: 'news'
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

    db.collection('news').doc().set({
      ...newsData,
      content_cs: stateToHTML(editorState_cs.getCurrentContent()),
      content_en: stateToHTML(editorState_en.getCurrentContent())
    }).then(() => {
      addToast('News item saved', {
        appearance: 'success'
      });
      history.push('/news');
    }).catch(error => {
      addToast(error.message, {
        appearance: 'error'
      });
    });
  };

  return (
    <>
      <h1>Create News Item</h1>
      <div className="page-actions">
        <Link to="/news">Go back</Link>
      </div>
      {!newsData ? <p>Loading data...</p> : <>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <label htmlFor="title_cs">Title (cs):</label>
            <input
              id="title_cs"
              onChange={e => setNewsData(newsData => ({ ...newsData, title_cs: e.target.value }))}
              value={newsData.title_cs}
            />
          </div>
          <div className="input-row">
            <label htmlFor="title_en">Title (en):</label>
            <input
              id="title_en"
              onChange={e => setNewsData(newsData => ({ ...newsData, title_en: e.target.value }))}
              value={newsData.title_en}
            />
          </div>
          <div className="input-row">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              onChange={e => setNewsData(newsData => ({ ...newsData, type: e.target.value }))}
              value={newsData.status}
            >
              {config.types.map(type => <option
                key={type}
                value={type}>{config.typeNames[type]}</option>)}
            </select>
          </div>
          <div className="input-row">
            <label htmlFor="itemDate">Date:</label>
            <input
              id="itemDate"
              onChange={e => setNewsData(newsData => ({ ...newsData, itemDate: new Date(e.target.value) }))}
              type="datetime-local"
              value={((isNaN(newsData.itemDate.getTime()) ? new Date() : newsData.itemDate) || new Date()).toISOString().slice(0,16)}
            />
          </div>
          {
            locations && 
            <div className="input-row">
              <label htmlFor="locations">Locations:</label>
              <select
                id="locations"
                multiple
                onChange={e => setNewsData(newsData => ({ ...newsData,
                  locations: Array.from(e.target.options).filter(item => item.selected).map(item => item.value)
                }))}
                size="6"
                value={newsData.locations}
              >
                {locations.map(doc => <option
                  key={doc.id}
                  value={doc.id}>{doc.data().title}</option>)}
              </select>
            </div>
          }
          <div className="wysiwyg-row">
            <label>News item content (cs)</label>
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
            <label>News item content (en)</label>
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

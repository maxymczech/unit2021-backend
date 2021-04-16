import { Link, useHistory } from "react-router-dom";
import { useState } from 'react';
import { useToasts } from 'react-toast-notifications';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const history = useHistory();
  const { addToast } = useToasts();

  const handleSubmit = e => {
    e.stopPropagation();
    e.preventDefault();

    if (password !== password2) {
      addToast('Password do not match', {
        appearance: 'error'
      });
    } else {
      // TODO: use http cloud function
      addToast('Password was changed', {
        appearance: 'success'
      });
      history.push('/users');
    }
  };

  return (
    <>
      <h1>Change Password</h1>
      <div className="page-actions">
        <Link to="/users">Go back</Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-row">
          <input
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
        </div>
        <div className="input-row">
          <input
            onChange={e => setPassword2(e.target.value)}
            placeholder="Repeat Password"
            type="password"
            value={password2}
          />
        </div>
        <div className="input-submit">
          <button type="submit">Change password</button>
        </div>
      </form>
    </>
  );
}

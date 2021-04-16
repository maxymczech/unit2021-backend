import { Link, useHistory } from "react-router-dom";
import { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import { useToasts } from 'react-toast-notifications';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const { addToast } = useToasts();

  const handleSubmit = e => {
    e.stopPropagation();
    e.preventDefault();

    if (password !== password2) {
      setError('Password do not match')
    } else {
      currentUser.updatePassword(password).then(() => {
        addToast('Password was changed', {
          appearance: 'success'
        });
        history.push('/settings');
      }).catch(error => {
        setError(error.message);
      });
    }
  };

  return (
    <>
      <h1>Change Password</h1>
      <div className="page-actions">
        <Link to="/settings">Go back</Link>
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
        {error ? <div className="error">{error}</div> : null}
        <div className="input-submit">
          <button type="submit">Change password</button>
        </div>
      </form>
    </>
  );
}

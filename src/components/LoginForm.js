import { auth } from '../config/firebase';
import { useState } from 'react';
import { useToasts } from 'react-toast-notifications';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { addToast } = useToasts();

  const handleSubmit = e => {
    e.stopPropagation();
    e.preventDefault();

    if (email && password) {
      auth.signInWithEmailAndPassword(email, password).then(userCredential => {
      }).catch(error => {
        addToast(error.message, {
          appearance: 'error'
        });
      });
    }
  }

  return (
    <div className="page-content">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo">
          <img src={process.env.PUBLIC_URL + '/logo.svg'} width="140" alt="Valeo" />
        </div>
        <div className="input-row">
          <input
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            value={email}
          />
        </div>
        <div className="input-row">
          <input
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
        </div>
        <div className="input-submit">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

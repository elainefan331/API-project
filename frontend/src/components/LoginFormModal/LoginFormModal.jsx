import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  
  const handleDemoLogin = (e) => {
    e.preventDefault();
    const demoCredential = 'Demo-lition';
    const demoPassword = 'password'
    setErrors({});
    return dispatch(sessionActions.login({ credential: demoCredential, password: demoPassword }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const isDisabled = credential.length < 4 || password.length < 6

  return (
    <div className='login-modal-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className='login-form-container'>
        <label>
          Username or Email
          </label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        <label>
          Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.credential && <p style={{color:'red'}}>{errors.credential}</p>}
        <button 
          type="submit" 
          disabled={isDisabled}
          className={isDisabled? 'disable-login-button' : 'login-button'}
        >
          Log In
        </button>
      </form>
      <div>
        <button type='button' className='demo-user-button' onClick={handleDemoLogin}>Demo User</button>
      </div>
    </div>
  );
}

export default LoginFormModal;

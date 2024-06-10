import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('TEACHER');
  const [errorMsg, setErrorMsg] = useState('');

  const history = useHistory();

  // Context API
  const [auth, setAuth] = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        type,
      });

      const loggedInUser = response.data;
      delete loggedInUser.msg;

      setAuth({ user: loggedInUser.user, isLoggedIn: true });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem(
        'auth',
        JSON.stringify({ user: loggedInUser.user, isLoggedIn: true })
      );

      history.push('/');

      if (type === 'TEACHER') {
        history.push('/teachers/ann');
      } else if (type === 'STUDENT') {
        history.push('/students/ann');
      }
    } catch (error) {
      setErrorMsg('Unable to Login. Check credentials');
      console.log('Something went wrong', error);
    }
  };

  return (
    <div className='container'>
      <h1 className='mt-3 mb-4'>Login</h1>

      <form onSubmit={handleSubmit}>
        <div class='mb-3'>
          <label class='form-label'>Email address</label>
          <input
            type='text'
            class='form-control'
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class='mb-3'>
          <label class='form-label'>Password</label>
          <input
            type='password'
            class='form-control'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div class='mb-3'>
          <label class='form-label'>Type</label>
          <select class='form-select' onChange={(e) => setType(e.target.value)}>
            <option value='TEACHER'>Teacher</option>
            <option value='STUDENT'>Student</option>
          </select>
        </div>

        {errorMsg && (
          <div className='alert alert-danger' role='alert'>
            {errorMsg}
          </div>
        )}

        <button type='submit' class='btn btn-primary'>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

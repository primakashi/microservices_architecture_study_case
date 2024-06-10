import React, { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { Link, useHistory } from 'react-router-dom';

const Navbar = () => {
  const [auth, setAuth] = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth');

    history.push('/login');
    setAuth({ user: null, isLoggedIn: false });
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <div className='container'>
        <span className='navbar-brand mb-0 h1'>My Classroom</span>

        <div className='d-flex' id='navbarNav'>
          <ul className='navbar-nav'>
            {auth.isLoggedIn ? (
              <>
                <li className='nav-item nav-link'>Hello {auth.user.name}</li>

                <li className='nav-item'>
                  <Link
                    className='nav-link active'
                    to={`/${
                      auth.user.type === 'TEACHER' ? 'teachers' : 'students'
                    }/ann`}
                  >
                    Announcements
                  </Link>
                </li>

                <li className='nav-item'>
                  <Link
                    className='nav-link active'
                    onClick={handleLogout}
                    to='#'
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link className='nav-link active' to='/login'>
                    Login
                  </Link>
                </li>

                <li className='nav-item'>
                  <Link className='nav-link active' to='/register'>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

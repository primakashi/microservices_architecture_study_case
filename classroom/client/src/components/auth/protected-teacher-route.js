import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

const ProtectedTeacherRoute = ({ children, ...rest }) => {
  const [auth, setAuth] = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isLoggedIn && auth.user.type === 'TEACHER' ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedTeacherRoute;

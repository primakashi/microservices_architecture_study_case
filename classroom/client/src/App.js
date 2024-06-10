import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import TeachersAnn from './pages/teachers/ann';
import Comments from './pages/teachers/comments';
import StudentAnn from './pages/students/ann';
import StudentComments from './pages/students/comments';
import Navbar from './components/navbar';

import AuthContextProvider from './context/auth-context';
import ProtectedTeacherRoute from './components/auth/protected-teacher-route';
import ProtectedStudentRoute from './components/auth/protected-student-route';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />

        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/register'>
            <Register />
          </Route>

          {/* Route protected teacher routes */}
          <ProtectedTeacherRoute path='/teachers/ann'>
            <TeachersAnn />
          </ProtectedTeacherRoute>
          <ProtectedTeacherRoute path='/teachers/comments/:annId'>
            <Comments />
          </ProtectedTeacherRoute>

          {/* Route Protected student routes */}
          <ProtectedStudentRoute path='/students/ann'>
            <StudentAnn />
          </ProtectedStudentRoute>
          <ProtectedStudentRoute path='/students/comments/:annId'>
            <StudentComments />
          </ProtectedStudentRoute>
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;

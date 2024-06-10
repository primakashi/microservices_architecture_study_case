import React, { useContext } from 'react';
import { AuthContext } from '../context/auth-context';

const SingleStudentComment = ({ comment }) => {
  const [auth, setAuth] = useContext(AuthContext);

  return (
    <div className='single-comment pt-2 px-3'>
      <h4 className='text-primary'>
        {auth.user.user_id === comment.student_id ? 'Me' : comment.student_name}
      </h4>
      <p>{comment.comment}</p>
    </div>
  );
};

export default SingleStudentComment;

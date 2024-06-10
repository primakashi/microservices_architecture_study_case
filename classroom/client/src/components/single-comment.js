import React from 'react';

const SingleComment = ({ comment, deleteComment }) => {
  return (
    <>
      <i
        class='fas fa-window-close float-end fs-2 mx-2 mt-2 text-danger close-button'
        onClick={() => deleteComment(comment.comment_id)}
      ></i>
      <div className='single-comment pt-2 px-3'>
        <h4 className='text-primary'>{comment.student_name}</h4>
        <p>{comment.comment}</p>
      </div>
    </>
  );
};

export default SingleComment;

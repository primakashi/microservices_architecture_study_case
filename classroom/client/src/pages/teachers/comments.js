import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SingleComment from '../../components/single-comment';

const Comments = () => {
  const { annId } = useParams();
  const [commentsList, setCommentsList] = useState([]);

  async function deleteComment(commentId) {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    await axios.delete(`/api/teachers/comment/del/${commentId}`, config);

    setCommentsList(
      commentsList.filter((comm) => comm.comment_id !== commentId)
    );
  }

  useEffect(() => {
    async function fetchData() {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const response = await axios.get(
        `/api/teachers/comments/${annId}`,
        config
      );

      setCommentsList(response.data);
    }
    fetchData();
  }, []);

  return (
    <div className='container'>
      <h1 className='mt-2 mb-4'>Comments for annoncement: {annId}</h1>

      {commentsList.length > 0 ? (
        <div className='comments-list'>
          {commentsList.map((comment) => {
            return (
              <SingleComment comment={comment} deleteComment={deleteComment} />
            );
          })}
        </div>
      ) : (
        <div class='alert alert-warning' role='alert'>
          No Comments to display
        </div>
      )}
    </div>
  );
};

export default Comments;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SingleStudentComment from '../../components/single-student-comment';

const StudentComments = () => {
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState('');

  const { annId } = useParams();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const response = await axios.post(
      '/api/students/comment/new',
      {
        annId,
        comment: newComment,
      },
      config
    );

    setCommentsList([...commentsList, response.data]);
    setNewComment('');
  };

  useEffect(() => {
    async function fetchData() {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const response = await axios.get(
        `/api/students/comments/${annId}`,
        config
      );

      setCommentsList(response.data);
    }
    fetchData();
  }, []);

  return (
    <div className='container'>
      <h1 className='mt-3 mb-4'>Comments for annoncement: {annId}</h1>

      {commentsList.length > 0 ? (
        <div className='comments-list'>
          {commentsList.map((comment) => {
            return <SingleStudentComment comment={comment} />;
          })}
        </div>
      ) : (
        <div class='alert alert-warning' role='alert'>
          No comments to diplay
        </div>
      )}

      <h3 className='mt-4 mb-3'>Create new Comment</h3>
      <form onSubmit={handleCommentSubmit}>
        <div class='mb-3'>
          <label class='form-label'>Comment</label>
          <input
            type='text'
            class='form-control'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>

        <button type='submit' class='btn btn-primary'>
          Create Comment
        </button>
      </form>
    </div>
  );
};

export default StudentComments;

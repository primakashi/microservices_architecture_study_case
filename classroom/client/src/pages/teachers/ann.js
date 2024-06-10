import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TeachersAnn = () => {
  const [annsList, setAnnsList] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    async function fetchData() {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const response = await axios.get('/api/teachers/ann', config);
      console.log(response.data);
      setAnnsList(response.data);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(title, desc);

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const response = await axios.post(
      '/api/teachers/ann/new',
      { title, desc },
      config
    );

    setAnnsList([...annsList, response.data]);
    setTitle('');
    setDesc('');
  };

  return (
    <div className='container'>
      <h1 className='mt-3 mb-4'>My Annoucements</h1>

      {annsList.length > 0 ? (
        <div className='list-group'>
          {annsList.map((ann) => {
            return (
              <Link
                to={`/teachers/comments/${ann.ann_id}`}
                className='list-group-item list-group-item-action '
              >
                <div className='d-flex w-100 justify-content-between'>
                  <h5 className='mb-3'>{ann.title}</h5>
                  <small>{ann.created_at.slice(0, 10)}</small>
                </div>
                <p className='mb-2'>{ann.desc}</p>
                <small className='fw-light'>Click to view Comments</small>
              </Link>
            );
          })}
        </div>
      ) : (
        <div class='alert alert-warning' role='alert'>
          No announcements to diplay
        </div>
      )}

      <h3 className='mt-4 mb-3'>Create Announcement</h3>
      <form onSubmit={handleSubmit}>
        <div class='mb-3'>
          <label class='form-label'>Title</label>
          <input
            type='text'
            class='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div class='mb-3'>
          <label class='form-label'>Description</label>
          <textarea
            className='form-control'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>

        <button type='submit' class='btn btn-primary mb-5'>
          Create Announcement
        </button>
      </form>
    </div>
  );
};

export default TeachersAnn;

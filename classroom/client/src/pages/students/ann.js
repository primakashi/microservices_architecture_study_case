import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StudentAnn = () => {
  const [annsList, setAnnsList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const response = await axios.get('/api/students/ann', config);

      console.log(response.data);
      setAnnsList(response.data);
    }
    fetchData();
  }, []);

  return (
    <div className='container'>
      <h1 className='mt-3 mb-4'>Student Announcements </h1>

      {annsList.length > 0 ? (
        <div className='list-group'>
          {annsList.map((ann) => {
            return (
              <Link
                to={`/students/comments/${ann.ann_id}`}
                className='list-group-item list-group-item-action '
                key={ann.ann_id}
              >
                <div className='d-flex w-100 justify-content-between'>
                  <h5 className=''>{ann.title}</h5>
                  <small>{ann.created_at.slice(0, 10)}</small>
                </div>

                <p className='text-success fw-bold mb-1'>
                  By: {ann.teacher_name}
                </p>
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
    </div>
  );
};

export default StudentAnn;

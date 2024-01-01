import React from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../imgs/409.jpg';

const ConflictPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        marginLeft: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <p
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: '30px',
        }}
      >
        409 User already exists
      </p>
      <img
        src={img}
        alt="cats"
        style={{
          marginLeft: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <button
        style={{
          margin: '50px',
          marginLeft: '50%',
          transform: 'translateX(-50%)',
          padding: '10px',
          cursor: 'pointer',
        }}
        type="button"
        onClick={() => navigate('/', { replace: false })}
      >
        Return to MAIN
      </button>
    </div>
  );
};
export default ConflictPage;

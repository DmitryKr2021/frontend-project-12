import React from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../imgs/search.webp';

const ErrorPage = () => {
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
        404 Page Not Found
      </p>
      <img
        alt="search"
        src={img}
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
export default ErrorPage;

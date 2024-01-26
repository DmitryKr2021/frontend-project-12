import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import img from '../imgs/409.jpg';

const ConflictPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <p
        style={{
          textAlign: 'center',
          fontSize: '20px',
        }}
      >
        {t('errors.userExists')}
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

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const MainPage = () => (
  <>
    <ToastContainer />
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </div>
  </>
);

export default MainPage;

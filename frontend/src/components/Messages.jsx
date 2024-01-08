import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import SvgSend from './svg/SvgSend.jsx';
import { UserContext } from './contexts/index.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { renderChannels } from '../slices/channels';
import { renderMessages } from '../slices/messages';

const Messages = () => {
  const dispatch = useDispatch();
  const { socket } = useContext(UserContext);
  const newSocket = socket.socket;
  const { t } = useTranslation();
  const enterMessage = t('main.enterMessage');
  const send = t('main.send');
  const dataNotLoaded = t('toasts.dataNotLoaded');
  const selectorActiveUser = useSelector((state) => state.usersSlice.activeUser);
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const selectorMessages = useSelector((state) => state.messagesSlice.messages);
  const selectorActiveChannel = useSelector(
    (state) => state.channelsSlice.activeChannel,
  );

  useEffect(() => {
    const requestData = async () => {
      if (window.localStorage.length > 0) {
        const user = localStorage.key(0);
        const userToken = JSON.parse(localStorage[user]).token;
        await axios
          .get('/api/v1/data', {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((response) => {
            dispatch(renderMessages(response.data));
            dispatch(renderChannels(response.data));
          })
          .catch(() => {
            const notify = () => toast.error(dataNotLoaded);
            notify();
          });
      }
    };
    requestData();
  }, [dispatch, dataNotLoaded]);

  const getActiveChannel = () => (selectorChannels.length > 0
    && selectorChannels.filter(
      (channel) => channel.id === selectorActiveChannel,
    )[0])
      || 1;

  const activeChannel = getActiveChannel();
  const channelMessages = selectorMessages.filter(
    (item) => item.channelId === selectorActiveChannel,
  );

  const inpMessage = useRef();
  useEffect(() => {
    inpMessage?.current?.select();
  }, [activeChannel]);

  const messagesLength = channelMessages.length;
  const countMessages = t('messages.msg', { count: messagesLength });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{`# ${activeChannel.name}`}</b>
          </p>
          <span className="text-muted">{countMessages}</span>
        </div>
        <div id="messages-box" className="chat-messages px-5">
          <ul className="nav flex-column nav-pills nav-fill mb-2 h-100 overflow-auto d-block">
            {selectorMessages.map(
              (item) => item.channelId === selectorActiveChannel
                && (
                  <li key={item.id} id={item.id}>
                    <span>
                      <b>{item.username}</b>
                      &#58;&nbsp;
                    </span>
                    {item.body}
                  </li>
                ),
            )}
          </ul>
        </div>
        <div className="mt-auto px-5 py-3">
          <Formik
            initialValues={{ message: '' }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              const newMessage = {
                body: filter.clean(values.message),
                channelId: selectorActiveChannel,
                username: selectorActiveUser,
              };
              newSocket.emit('newMessage', newMessage, (response) => {
                const { status } = response;
                if (status !== 'ok') {
                  const notify = () => toast.error(dataNotLoaded);
                  notify();
                }
              });
              setSubmitting(false);
              resetForm('');
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form
                noValidate=""
                onSubmit={handleSubmit}
                className="py-1 border rounded-2"
              >
                <div className="input-group has-validation">
                  <Form.Control
                    name="message"
                    aria-label="Новое сообщение"
                    placeholder={enterMessage}
                    className="border-0 p-0 ps-2 form-control"
                    onChange={handleChange}
                    value={values.message}
                    ref={inpMessage}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-group-vertical"
                  >
                    <SvgSend />
                    <span className="visually-hidden">{send}</span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Messages;

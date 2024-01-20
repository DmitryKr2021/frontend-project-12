import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import SvgSend from './svg/SvgSend.jsx';
import AuthContext from './contexts/index.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { loadChannels } from '../slices/channels';
import { loadMessages } from '../slices/messages';
import * as routes from '../routes';
import useAuth from '../hooks/index.jsx';

const Messages = () => {
  const auth = useAuth();
  const { activeUser, token } = auth;
  const dispatch = useDispatch();
  const { socket } = useContext(AuthContext).socket;
  const newSocket = socket;
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channelsSlice.channels);
  const messages = useSelector((state) => state.messagesSlice.messages);
  const thisActiveChannel = useSelector(
    (state) => state.channelsSlice.activeChannel,
  );

  useEffect(() => {
    const requestData = async () => {
      if (activeUser) {
        await axios
          .get(routes.apiDataPath(), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            dispatch(loadMessages(response.data));
            dispatch(loadChannels(response.data));
          })
          .catch(() => {
            const notify = () => toast.error(t('toasts.dataNotLoaded'));
            notify();
          });
      }
    };
    requestData();
  }, [dispatch, t, activeUser, auth, token]);

  const getActiveChannel = () => (channels.length > 0
    && channels.find((channel) => channel.id === thisActiveChannel))
    || 1;

  const activeChannel = getActiveChannel();
  const channelMessages = messages.filter(
    (item) => item.channelId === thisActiveChannel,
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
        <div id="messages-box" className="chat-messages px-5 overflow-auto">
          {messages.map(
            (item) => item.channelId === thisActiveChannel && (
              <div key={item.id} id={item.id} className="text-break mb-2">
                <span>
                  <b>{item.username}</b>
                  &#58;&nbsp;
                </span>
                {item.body}
              </div>
            ),
          )}
        </div>
        <div className="mt-auto px-5 py-3">
          <Formik
            initialValues={{ message: '' }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const newMessage = {
                body: filter.clean(values.message),
                channelId: thisActiveChannel,
                username: activeUser,
              };
              try {
                await newSocket.emit('newMessage', newMessage, (response) => {
                  const { status } = response;
                  if (status === 'ok') {
                    setSubmitting(false);
                    resetForm('');
                  }
                });
              } catch (error) {
                console.error(error.response.status);
                const notify = () => toast.error(t('toasts.dataNotLoaded'));
                notify();
              }
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <Form
                noValidate=""
                onSubmit={handleSubmit}
                className="py-1 border rounded-2"
              >
                <div className="input-group has-validation">
                  <Form.Control
                    name="message"
                    aria-label="Новое сообщение"
                    placeholder={t('main.enterMessage')}
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
                    <span className="visually-hidden">{t('main.send')}</span>
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

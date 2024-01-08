import React, {
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Form,
  Modal,
} from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import store from '../../slices/index';
import { UserContext } from '../contexts/index.jsx';

const AddChannel = (params) => {
  const { setModalNull, setNotify } = params;
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const { socket } = useContext(UserContext).socket;
  const newSocket = socket;
  const { t } = useTranslation();
  const channelLength = t('errors.channelLength');
  const uniqName = t('errors.uniqName');
  const addChannel = t('add.addChannel');
  const cancel = t('add.cancel');
  const send = t('add.send');
  const [show, setShow] = useState(true);
  const close = () => {
    setShow(false);
    setModalNull();
  };
  const channelAdded = t('toasts.channelAdded');
  const channelNotAdded = t('rename.channelNotAdded');

  const Schema = Yup.object().shape({
    name: Yup.string()
      .min(3, channelLength)
      .max(20, channelLength)
      .notOneOf(
        selectorChannels.map((channel) => channel.name),
        uniqName,
      ),
  });

  const inpChannel = useRef();
  useEffect(() => {
    inpChannel.current?.select();
  }, []);
  const thisUser = store.getState().usersSlice.activeUser;
  return (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>{addChannel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Schema}
            initialValues={{ name: '' }}
            onSubmit={(values, { setSubmitting }) => {
              const newChannel = {
                name: filter.clean(values.name),
                user: thisUser,
              };
              newSocket.emit('newChannel', newChannel, (response) => {
                const { status } = response;
                if (status === 'ok') {
                  setNotify(channelAdded, 'success');
                } else {
                  setNotify(channelNotAdded, 'error');
                }
              });
              close();
              setSubmitting(false);
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              touched,
              errors,
            }) => (
              <Form noValidate="" onSubmit={handleSubmit}>
                <div className="input-group has-validation">
                  <Form.Label className="visually-hidden" htmlFor="name">
                    Имя канала
                  </Form.Label>
                  <Form.Control
                    name="name"
                    id="name"
                    aria-label="Имя канала"
                    onChange={handleChange}
                    value={values.channel}
                    ref={inpChannel}
                    isInvalid={touched.name && errors.name}
                    required
                    title={addChannel}
                    className="rounded"
                  />
                  <ErrorMessage name="name">
                    {(msg) => <div className=" invalid-tooltip">{msg}</div>}
                  </ErrorMessage>
                </div>
                <div className="d-flex justify-content-end">
                  <ButtonGroup className="w-50 mt-3">
                    <Button
                      variant="secondary"
                      type="button"
                      className="me-2 rounded"
                      onClick={close}
                    >
                      {cancel}
                    </Button>
                    <Button variant="primary" type="submit" className="rounded">
                      {send}
                    </Button>
                  </ButtonGroup>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddChannel;

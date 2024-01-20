import React, {
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
import { useTranslation } from 'react-i18next';
import store from '../../slices/index';
import { closeModal } from '../../slices/modals';
import AuthContext from '../contexts/index.jsx';

const RenameChannel = (params) => {
  const { dispatch } = store;
  const { channelNumber, setNotify } = params;
  const channels = useSelector((state) => state.channelsSlice.channels);
  const { socket } = useContext(AuthContext).socket;
  const newSocket = socket;
  const { t } = useTranslation();
  const channelLength = t('errors.channelLength');
  const uniqName = t('errors.uniqName');
  const rename = t('rename.rename');
  const cancel = t('rename.cancel');
  const send = t('rename.send');

  const close = () => {
    dispatch(closeModal());
  };

  const channelRenamed = t('toasts.channelRenamed');
  const channelNotRenamed = t('rename.channelNotRenamed');

  const [renamingChannel] = channels.filter(
    (channel) => channel.id === +channelNumber,
  );

  const Schema = Yup.object().shape({
    channel: Yup.string()
      .min(3, channelLength)
      .max(20, channelLength)
      .notOneOf(
        channels.map((channel) => channel.name),
        uniqName,
      ),
  });

  const inpChannel = useRef();
  useEffect(() => {
    inpChannel.current?.select();
  }, []);

  return (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={true} onHide={close} centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>{rename}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Schema}
            initialValues={{
              channel: renamingChannel.name,
              id: channelNumber,
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const targetChannel = {
                name: values.channel,
                id: values.id,
              };
              try {
                await newSocket.emit('renameChannel', targetChannel, (response) => {
                  const { status } = response;
                  if (status === 'ok') {
                    setNotify(channelRenamed, 'success');
                  }
                });
              } catch (error) {
                setNotify(channelNotRenamed, 'error');
              }
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
                    name="channel"
                    id="name"
                    aria-label={rename}
                    title={rename}
                    onChange={handleChange}
                    value={values.channel}
                    ref={inpChannel}
                    isInvalid={touched.channel && errors.channel}
                    required
                    className="rounded"
                  />
                  <ErrorMessage name="channel">
                    {(msg) => <div className=" invalid-tooltip">{msg}</div>}
                  </ErrorMessage>
                </div>
                <div className="d-flex justify-content-end ">
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

export default RenameChannel;

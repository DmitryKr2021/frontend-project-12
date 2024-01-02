import React, { 
  useState, 
  useContext, 
  useEffect, 
  useRef 
} from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { 
  Button, 
  ButtonGroup, 
  Form, 
  Modal 
} from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import userContext from '../../index.js';

const RenameChannel = (params) => {
  const { channelNumber, setModalNull, setNotify } = params;
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const { socket } = useContext(userContext).socket;
  const newSocket = socket;
  const { t } = useTranslation();
  const channelLength = t('errors.channelLength');
  const uniqName = t('errors.uniqName');
  const rename = t('rename.rename');
  const cancel = t('rename.cancel');
  const send = t('rename.send');
  const [show, setShow] = useState(true);
  const close = () => {
    setShow(false);
    setModalNull();
  };

  const channelRenamed = t('toasts.channelRenamed');
  const channelNotRenamed = t('rename.channelNotRenamed');

  const [renamingChannel] = selectorChannels.filter(
    (channel) => channel.id === +channelNumber,
  );

  const Schema = Yup.object().shape({
    channel: Yup.string()
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

  return (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={show} onHide={close} centered>
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
            onSubmit={(values, { setSubmitting }) => {
              const targetChannel = {
                name: values.channel,
                id: values.id,
              };
              newSocket.emit('renameChannel', targetChannel, (response) => {
                const { status } = response;
                if (status === 'ok') {
                  setNotify(channelRenamed, 'success');
                } else {
                  setNotify(channelNotRenamed, 'error');
                }
              });
              close();
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => (
              <Form noValidate="" onSubmit={handleSubmit}>
                <div className="input-group has-validation">
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
                  />
                  <label className="visually-hidden" htmlFor="name">
                    Имя канала
                  </label>
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

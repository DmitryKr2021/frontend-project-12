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
import { ApiContext } from '../contexts/index.jsx';

const RenameChannel = (params) => {
  const { dispatch } = store;
  const { channelNumber } = params;
  const channels = useSelector((state) => state.channelsSlice.channels);
  const { withEmit } = useContext(ApiContext);
  const { emitRenameChannel } = withEmit;
  const { t } = useTranslation();

  const close = () => {
    dispatch(closeModal());
  };

  const [renamingChannel] = channels.filter(
    (channel) => channel.id === +channelNumber,
  );

  const Schema = Yup.object().shape({
    channel: Yup.string()
      .min(3, t('errors.channelLength'))
      .max(20, t('errors.channelLength'))
      .notOneOf(
        channels.map((channel) => channel.name),
        t('errors.uniqName'),
      ),
  });

  const inpChannel = useRef();
  useEffect(() => {
    inpChannel.current?.select();
  }, []);

  return (
    <div className="fade modal show" tabIndex="-1">
      <Modal show onHide={close} centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>{t('rename.rename')}</Modal.Title>
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
              emitRenameChannel('renameChannel', targetChannel, t('toasts.channelRenamed'), t('toasts.channelNotRenamed'));
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
                    aria-label={t('rename.rename')}
                    title={t('rename.rename')}
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
                      {t('rename.cancel')}
                    </Button>
                    <Button variant="primary" type="submit" className="rounded">
                      {t('rename.send')}
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

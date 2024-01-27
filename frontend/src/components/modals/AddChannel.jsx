import React, {
  useContext,
  useEffect,
  useRef,
} from 'react';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
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
import { closeModal } from '../../slices/modals';
import { ApiContext } from '../contexts/index.jsx';
import useAuth from '../../hooks/index.jsx';

const AddChannel = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { showModal } = store.getState().modalsSlice;
  const channels = useSelector((state) => state.channelsSlice.channels);
  const { emitChannel } = useContext(ApiContext);
  const { t } = useTranslation();

  const close = () => {
    dispatch(closeModal());
  };

  const Schema = Yup.object().shape({
    name: Yup.string()
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

  const setNotify = (text, result) => {
    const notify = () => toast[result](text);
    notify();
  };

  const { activeUser } = auth;

  return (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={showModal} onHide={close} centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>{t('add.addChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Schema}
            initialValues={{ name: '' }}
            onSubmit={async (values, { setSubmitting }) => {
              const newChannel = {
                name: filter.clean(values.name),
                user: activeUser,
              };
              try {
                await emitChannel('newChannel', newChannel);
                setNotify(t('toasts.channelAdded'), 'success');
              } catch (err) {
                setNotify(t('toasts.channelNotAdded'), 'error');
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
                    name="name"
                    id="name"
                    aria-label="Имя канала"
                    onChange={handleChange}
                    value={values.channel}
                    ref={inpChannel}
                    isInvalid={touched.name && errors.name}
                    required
                    title={t('add.addChannel')}
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
                      {t('add.cancel')}
                    </Button>
                    <Button variant="primary" type="submit" className="rounded">
                      {t('add.send')}
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

import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Button,
  ButtonGroup,
  Form,
  Modal,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import store from '../../slices/index';
import { closeModal } from '../../slices/modals';
import { ApiContext } from '../contexts/index.jsx';

const RemoveChannel = (params) => {
  const dispatch = useDispatch();
  const { channelNumber } = params;
  const { showModal } = store.getState().modalsSlice;
  const { emitChannel } = useContext(ApiContext);
  const { t } = useTranslation();

  const close = () => {
    dispatch(closeModal());
  };

  const setNotify = (text, result) => {
    const notify = () => toast[result](text);
    notify();
  };

  return (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={showModal} onHide={close} centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>{t('remove.removeChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              id: channelNumber,
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await emitChannel('removeChannel', { id: values.id });
                setNotify(t('toasts.channelRemoved'), 'success');
              } catch (err) {
                setNotify(t('toasts.channelNotRemoved'), 'error');
              }
              close();
              setSubmitting(false);
            }}
          >
            {({ handleSubmit }) => (
              <Form noValidate="" onSubmit={handleSubmit}>
                <div className="d-flex justify-content-end ">
                  <p className="lead w-75 text-start">{t('remove.sure')}</p>
                  <ButtonGroup className="w-50 mt-5">
                    <Button
                      type="button"
                      className="me-2 rounded btn btn-secondary"
                      onClick={close}
                    >
                      {t('remove.cancel')}
                    </Button>
                    <Button type="submit" className="rounded btn btn-danger">
                      {t('remove.remove')}
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

export default RemoveChannel;

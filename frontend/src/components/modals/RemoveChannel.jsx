import React, { useContext } from 'react';
import {
  Button,
  ButtonGroup,
  Form,
  Modal,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import store from '../../slices/index';
import { closeModal } from '../../slices/modals';
import { ApiContext } from '../contexts/index.jsx';

const RemoveChannel = (params) => {
  const { dispatch } = store;
  const { channelNumber } = params;
  const { withEmit } = useContext(ApiContext);
  const { emitRemoveChannel } = withEmit;
  const { t } = useTranslation();

  const close = () => {
    dispatch(closeModal());
  };

  const handleRemove = async () => {
    emitRemoveChannel('removeChannel', { id: channelNumber }, t('toasts.channelRemoved'), t('toasts.channelNotRemoved'));
    close();
  };

  return (
    <div className="fade modal show" tabIndex="-1">
      <Modal show onHide={close} centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>{t('remove.removeChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate="" onSubmit={handleRemove}>
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RemoveChannel;

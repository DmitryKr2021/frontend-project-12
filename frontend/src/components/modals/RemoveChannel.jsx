import React, { useState, useContext } from 'react';
import {
  Button,
  ButtonGroup,
  Form,
  Modal,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts/index.jsx';

const RemoveChannel = (params) => {
  const { channelNumber, setModalNull, setNotify } = params;
  const { socket } = useContext(UserContext).socket;
  const newSocket = socket;
  const { t } = useTranslation();
  const removeChannel = t('remove.removeChannel');
  const remove = t('remove.remove');
  const sure = t('remove.sure');
  const cancel = t('remove.cancel');

  const [show, setShow] = useState(true);
  const close = () => {
    setShow(false);
    setModalNull();
  };

  const channelRemoved = t('toasts.channelRemoved');
  const channelNotRemoved = t('rename.channelNotRemoved');

  const handleRemove = () => {
    newSocket.emit('removeChannel', { id: channelNumber }, (response) => {
      const { status } = response;
      if (status === 'ok') {
        setNotify(channelRemoved, 'success');
      } else {
        setNotify(channelNotRemoved, 'error');
      }
    });
    close();
  };

  return (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton onClick={close}>
          <Modal.Title>{removeChannel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate="" onSubmit={handleRemove}>
            <div className="d-flex justify-content-end ">
              <p className="lead w-75 text-start">{sure}</p>
              <ButtonGroup className="w-50 mt-5">
                <Button
                  type="button"
                  className="me-2 rounded btn btn-secondary"
                  onClick={close}
                >
                  {cancel}
                </Button>
                <Button type="submit" className="rounded btn btn-danger">
                  {remove}
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

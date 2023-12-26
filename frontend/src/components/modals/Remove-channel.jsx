import React, { useState, useContext } from "react";
import { Button, ButtonGroup, Form, Alert, Modal } from "react-bootstrap";
import { userContext } from "../../index.js";
import { useTranslation } from "react-i18next";

const RemoveChannel = (params) => {
  const { channelNumber, setModalNull } = params;
  const [showAlert, setShowAlert] = useState(false);
  const { socket } = useContext(userContext).socket;
  const newSocket = socket;
  const { t } = useTranslation();
  const removeChannel = t("remove.removeChannel");
  const remove = t("remove.remove");
  const sure = t("remove.sure");
  const cancel = t("remove.cancel");
  const channel = t("remove.channel");
  const notRemoved = t("remove.notRemoved");

  const [show, setShow] = useState(true);
  const close = () => {
    setShow(false);
    setModalNull();
  };

  const handleRemove = () => {
    newSocket.emit("removeChannel", {id: channelNumber}, (response) => {
        const { status } = response;
        setShowAlert(status === "ok" ? false : true);
        console.log(
          status === "ok"
            ? `Канал удален`
            : `Канал не удален`
        );
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
          {showAlert ? (
            <Alert
              key="danger"
              variant="danger"
              className="border-2 p-2 ps-2 mt-1"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              <Alert.Heading className="h5">{channel}</Alert.Heading>
              {notRemoved}
            </Alert>
          ) : null}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RemoveChannel;

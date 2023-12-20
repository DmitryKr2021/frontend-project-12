import React, { useState, useContext } from "react";
import { Button, ButtonGroup, Form, Alert, Modal } from "react-bootstrap";
import { userContext } from "../../index.js";

const RemoveChannel = (showRemove, closeRemove, removingChannelNumber) => {
  const [showAlert, setShowAlert] = useState(false);
  const { socket } = useContext(userContext).socket;
  const newSocket = socket;

  const handleRemove = () => {
    newSocket.emit("removeChannel", {id: removingChannelNumber}, (response) => {
        const { status } = response;
        setShowAlert(status === "ok" ? false : true);
        console.log(
          status === "ok"
            ? `Канал удален`
            : `Канал не удален`
        );
      });
    closeRemove();
  };

  return showRemove ? (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={showRemove} onHide={closeRemove} centered>
        <Modal.Header closeButton onClick={closeRemove}>
          <Modal.Title>Удалить канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate="" onSubmit={handleRemove}>
            <div className="d-flex justify-content-end ">
              <p className="lead w-75 text-start">Уверены?</p>
              <ButtonGroup className="w-50 mt-5">
                <Button
                  type="button"
                  className="me-2 rounded btn btn-secondary"
                  onClick={closeRemove}
                >
                  Отменить
                </Button>
                <Button type="submit" className="rounded btn btn-danger">
                  Удалить
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
              <Alert.Heading className="h5">Канал XXX</Alert.Heading>
              не удален
            </Alert>
          ) : null}
        </Modal.Body>
      </Modal>
    </div>
  ) : null;
};

export default RemoveChannel;

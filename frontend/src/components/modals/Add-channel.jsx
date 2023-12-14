import React, { useState, useContext } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Button, ButtonGroup, Form, Alert, Modal } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import { userContext } from "../../index.js";

const AddChannel = (show, close) => {
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const [showAlertChannel, setShowAlertChannel] = useState(false);
  const { socket } = useContext(userContext);
  const newSocket = socket.socket;

  const Schema = Yup.object().shape({
    channel: Yup.string().notOneOf(
      selectorChannels.name,
      "Такой канал уже существует"
    ),
  });

  return show ? (
    <div
      className="fade modal show"
      style={{ display: "block" }}
      tabIndex="-1"
    >
      <Modal.Dialog className="modal-dialog-centered">     
          <Modal.Header closeButton onClick={close}>
            <Modal.Title>Добавить канал</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={Schema}
              initialValues={{ channel: "" }}
              onSubmit={(values, { setSubmitting }) => {
                const channelNumber = selectorChannels.name.length + 1;
                const newChannel = {
                  name: values.channel,
                  channelNumber,
                };
                newSocket.emit("newChannel", newChannel, (response) => {
                  const { status } = response;
                  const { name } = newChannel;
                  setShowAlertChannel(status === "ok" ? false : true);
                  console.log(
                    status === "ok"
                      ? `Канал ${name} добавлен`
                      : `Канал ${name} не добавлен`
                  );
                });
                close();
                setSubmitting(false);
              }}
            >
              {({
                values,
                handleChange,
                handleSubmit,
                resetForm,
                touched,
                errors,
              }) => (
                <>
                  <Form noValidate="" onSubmit={handleSubmit}>
                    <div className="input-group has-validation">
                      <Form.Control
                        name="channel"
                        aria-label="Новый канал"
                        onChange={handleChange}
                        value={values.channel}
                        isInvalid={touched.channel && errors.channel}
                        autoFocus
                        required
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
                          Отменить
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          className="rounded"
                          onClick={() =>
                            setTimeout(
                              () => resetForm(""),
                              ErrorMessage ? 3000 : 300
                            )
                          }
                        >
                          Отправить
                        </Button>
                      </ButtonGroup>
                    </div>
                  </Form>
                  {showAlertChannel ? (
                    <Alert
                      key="danger"
                      variant="danger"
                      className="border-2 p-2 ps-2 mt-1"
                      onClose={() => setShowAlertChannel(false)}
                      dismissible
                    >
                      <Alert.Heading className="h5">
                        Канал {values.channel}
                      </Alert.Heading>
                      не добавлен
                    </Alert>
                  ) : null}
                </>
              )}
            </Formik>
          </Modal.Body>        
      </Modal.Dialog>
    </div>
  ) : null;
};

export default AddChannel;

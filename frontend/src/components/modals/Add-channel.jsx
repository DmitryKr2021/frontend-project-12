import React, { useState, useContext, useEffect } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  Button,
  ButtonGroup,
  Form,
  Alert,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import { userContext } from "../../index.js";

const AddChannel = (showAdd, closeAdd) => {
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirm, setShowConfirm] = useState(true);
  const [countOfProgress, setCountOfProgress] = useState(100);
  const { socket } = useContext(userContext);
  const newSocket = socket.socket;
  const [n, setN] = useState(0);

  const Bar = () => {
    useEffect(() => {
      const inter = setInterval(() => {
        setN(n + 1);
        setCountOfProgress(100 - n);
        console.log("countOfProgress==", countOfProgress, "n=", n);
      }, 30);
      return () => clearInterval(inter);
    }, [n, showConfirm]);
    if (n > 99) {
      setShowConfirm(false);
      return;
    }
    return <ProgressBar now={countOfProgress} variant="success" />;
  };

  const Schema = Yup.object().shape({
    channel: Yup.string()
      .min(3, "От 3 до 15 символов")
      .max(15, "От 3 до 15 символов")
      .notOneOf(selectorChannels.name, "Такой канал уже существует"),
  });

  return showAdd ? (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={showAdd} onHide={closeAdd} centered>
        <Modal.Header closeButton onClick={closeAdd}>
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
                if (status === "ok") {
                  setShowConfirm("krakozyabra");
                  console.log("confirm", showConfirm);
                }
                setShowAlert(status === "ok" ? false : true);
                console.log(
                  status === "ok"
                    ? `Канал ${name} добавлен`
                    : `Канал ${name} не добавлен`
                );
              });
              closeAdd();
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => (
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
                        onClick={closeAdd}
                      >
                        Отменить
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        className="rounded"
                      >
                        Отправить
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
      </Modal>
    </div>
  ) : (
    <Modal show={showConfirm} centered>
      <Modal.Header closeButton onClick={() => setShowConfirm(false)}>
        <svg viewBox="0 0 24 24" width="8%" height="8%" fill="green">
          <path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path>
        </svg>
        <Modal.Title className="ps-5">Канал создан</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Bar />
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;

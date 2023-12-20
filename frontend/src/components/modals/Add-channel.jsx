import React, { useState, useContext } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  Button,
  ButtonGroup,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import { userContext } from "../../index.js";

// const AddChannel = (showAdd, closeAdd, showConfirm, closeConfirm) => {
const AddChannel = (showAdd, closeAdd) => {
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const [showAlert, setShowAlert] = useState(false);
  const { socket } = useContext(userContext);
  const newSocket = socket.socket;
  
  
  /*const [countOfProgress, setCountOfProgress] = useState(100);
  const [n, setN] = useState(0);

  const Bar = () => {
    useEffect(() => {
      const inter = setInterval(() => {
        setN(x => x + 1);
        setCountOfProgress(100 - n);
      }, 30);
      if (countOfProgress <= 0) {
        clearInterval(inter);
        closeConfirm();
        return;
      }
      return () => clearInterval(inter);
  }, []);
    return <ProgressBar now={countOfProgress} variant="success" />;
  };*/
  
  /*const reducer = (state, action) => {
    const { count, step } = state;
    if (action.type === "tick") {
      return { count: count - step, step };
    } else {
      throw new Error();
    }
  };

  const initialState = {
    count: 101,
    step: 1,
  };

  const Bar = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { count, step } = state;
    useEffect(() => {
      const inter = setInterval(() => {
        dispatch({ type: "tick" });
      }, 30);
      return () => clearInterval(inter);
    }, [dispatch]);
    console.log("count=", count, "step=", step);
    if (count < 0) {
      setShowConfirm(false);
      return;
    }
    return <ProgressBar now={count} variant="success" />;
  };*/
  
  const Schema = Yup.object().shape({
    channel: Yup.string()
      .min(3, "От 3 до 15 символов")
      .max(15, "От 3 до 15 символов")
      .notOneOf(selectorChannels.map(channel => channel.name), "Такой канал уже существует"),
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
              const newChannel = {
                name: values.channel,
              };
              newSocket.emit("newChannel", newChannel, (response) => {
                const { status } = response;
                const { name } = newChannel;
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
  ) : null
};

export default AddChannel;

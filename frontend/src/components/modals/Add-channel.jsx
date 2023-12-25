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
import { useTranslation } from "react-i18next";

// const AddChannel = (showAdd, closeAdd, showConfirm, closeConfirm) => {
const AddChannel = (showAdd, closeAdd) => {
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const [showAlert, setShowAlert] = useState(false);
  const { socket } = useContext(userContext).socket;
  const newSocket = socket;
  const { t } = useTranslation();
  const channelLength = t("errors.channelLength");
  const uniqName = t("errors.uniqName");
  const addChannel = t("add.addChannel");
  const cancel = t("add.cancel");
  const send = t("add.send");
  const channel = t("add.channel");
  const notAdded = t("add.notAdded");
  
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
      .min(3, channelLength)
      .max(20, channelLength)
      .notOneOf(selectorChannels.map(channel => channel.name), uniqName),
  });

  return showAdd ? (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={showAdd} onHide={closeAdd} centered>
        <Modal.Header closeButton onClick={closeAdd}>
          <Modal.Title>{addChannel}</Modal.Title>
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
                      title={addChannel}
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
                        {cancel}
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        className="rounded"
                      >
                        {send}
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
                      {channel} {values.channel}
                    </Alert.Heading>
                    {notAdded}
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

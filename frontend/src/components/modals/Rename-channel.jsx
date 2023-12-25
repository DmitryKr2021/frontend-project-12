import React, { useState, useContext, useEffect, useRef } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Button, ButtonGroup, Form, Alert, Modal } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import { userContext } from "../../index.js";
import { useTranslation } from "react-i18next";

const RenameChannel = (showRename, closeRename, renamingChannelNumber) => {
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const [showAlert, setShowAlert] = useState(false);
  const { socket } = useContext(userContext).socket;
  const newSocket = socket;
  const { t } = useTranslation();
  const channelLength = t("errors.channelLength");
  const uniqName = t("errors.uniqName");
  const rename = t("rename.rename");
  const cancel = t("rename.cancel");
  const send = t("rename.send");
  const channel = t("rename.channel");
  const notRenamed = t("rename.notRenamed");

  const [renamingChannel] = selectorChannels.filter(
    (channel) => channel.id === +renamingChannelNumber
  );

  const Schema = Yup.object().shape({
    channel: Yup.string()
      .min(3, channelLength)
      .max(20, channelLength)
      .notOneOf(
        selectorChannels.map((channel) => channel.name),
        uniqName
      ),
  });

  const inpChannel = useRef();
  useEffect(() => {
    inpChannel.current?.select();
  }, []);

  return showRename ? (
    <div className="fade modal show" tabIndex="-1">
      <Modal show={showRename} onHide={closeRename} centered>
        <Modal.Header closeButton onClick={closeRename}>
          <Modal.Title>{rename}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Schema}
            initialValues={{
              channel: renamingChannel.name,
              id: renamingChannelNumber,
            }}
            onSubmit={(values, { setSubmitting }) => {
              const renamingChannel = {
                name: values.channel,
                id: values.id,
              };
              newSocket.emit("renameChannel", renamingChannel, (response) => {
                const { status } = response;
                setShowAlert(status === "ok" ? false : true);
                console.log(
                  status === "ok"
                    ? `Канал переименован`
                    : `Канал не переименован`
                );
              });
              closeRename();
              setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => (
              <>
                <Form noValidate="" onSubmit={handleSubmit}>
                  <div className="input-group has-validation">
                    <Form.Control
                      name="channel"
                      aria-label={rename}
                      title={rename}
                      onChange={handleChange}
                      value={values.channel}
                      ref={inpChannel}
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
                        onClick={closeRename}
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
                    {notRenamed}
                  </Alert>
                ) : null}
              </>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  ) : null;
};

export default RenameChannel;

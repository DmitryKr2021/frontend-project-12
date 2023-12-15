import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { renderChannels, setActiveChannel } from "../slices/channels.js";
import { renderMessages } from "../slices/messages.js";
import { Button, Form, ButtonGroup, Alert } from "react-bootstrap";
import { Formik } from "formik";
import cn from "classnames";
import { useTranslation, I18nextProvider } from "react-i18next";
import { i18n, userContext } from "../index.js";
import getModal from "./modals/index.js";
import PropTypes from "prop-types";

export const MainPage = () => {
  const { socket } = useContext(userContext);
  const newSocket = socket.socket;
  const btnClass = cn("w-100", "rounded-0", "text-start");
  const btnClass2 = cn(
    "flex-grow-0",
    "dropdown-toggle",
    "dropdown-toggle-split",
    "btn"
  );
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const selectorMessages = useSelector((state) => state.messagesSlice.messages);
  const selectorActiveChannel = useSelector(
    (state) => state.channelsSlice.activeChannel
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [typeModal, setTypeModal] = useState("null");
  const addOneChannel = () => {
    setShowAdd(true);
    setTypeModal("adding");
  };

  const closeAdd = () => {
    setShowAdd(false);
  };

  /* 
  //const removeModal = (task) => {
  const removeModal = () => {
    setTypeModal('removing');
    //setShowRemove(true);
    //setShowModal(false);
    //setTaskToRemove(task);
  };
console.log(removeModal)*/

  const RenderModal = (props) => {
    const { value } = props;
    const getModalValue = getModal(value);
    switch (value) {
      case "adding":
        return getModalValue(showAdd, closeAdd);
      /*case 'renaming': return (getModalValue(showRename, closeRenameModal, taskToRename, renameTask));*/
      //case 'removing': return (getModalValue(showRemove, closeRemoveModal, removeTask));
      default:
        return null;
    }
  };

  RenderModal.propTypes = {
    value: PropTypes.node.isRequired,
  };

  const getMes = (value) => {
    let mes;
    switch (value) {
      case 0:
        mes = "mes_zero";
        break;
      case 1:
        mes = "mes_one";
        break;
      case 2:
        mes = "mes_two";
        break;
      case 3:
        mes = "mes_three";
        break;
      case 4:
        mes = "mes_four";
        break;
      default:
        mes = "mes_few";
        break;
    }
    return mes;
  };

  const handleClick = (index) => {
    dispatch(setActiveChannel(index + 1));
  };

  useEffect(() => {
    const requestData = async () => {
      if (window.localStorage.length > 0) {
        const user = window.localStorage.getItem("user");
        const userToken = JSON.parse(user).token;
        axios
          .get("/api/v1/data", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((response) => {
            console.log("response.data=", response.data);
            dispatch(renderMessages(response.data));
            dispatch(renderChannels(response.data));
          });
      }
    };
    requestData();
  }, []);

  const Channels = () => {
    const { name, id, removable } = selectorChannels;
    return (
      <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <b>Каналы</b>
          <Button
            type="button"
            variant="light"
            className="p-0 text-primary btn btn-group-vertical"
            onClick={addOneChannel}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
            </svg>
            <span className="visually-hidden">+</span>
          </Button>
        </div>
        <ul
          id="channels-box"
          className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        >
          {name.map((item, index) => (
            <li className="nav-item w-100" key={id[index]} id={item}>
              <ButtonGroup className="d-flex">
                <Button
                  type="button"
                  id={id[index]}
                  data-type="button"
                  onClick={() => handleClick(index)}
                  className={
                    index + 1 === selectorActiveChannel
                      ? btnClass + " btn-secondary"
                      : btnClass + " btn-light"
                  }
                >
                  <span className="me-1">#</span>
                  {item}
                </Button>
                {removable[index] ? (
                  <Button
                    type="button"
                    aria-expanded="false"
                    className={
                      index + 1 === selectorActiveChannel
                        ? btnClass2 + " btn-secondary"
                        : btnClass2 + " visually-hidden"
                    }
                  >
                    <span className="visually-hidden">Управление каналом</span>
                  </Button>
                ) : null}
              </ButtonGroup>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const Chats = () => {
    const activeChannelName = selectorChannels.name[selectorActiveChannel - 1];
    const channelMessages = selectorMessages.filter(
      (item) => item.channelId === selectorActiveChannel
    );
    const messagesLength = channelMessages.length;
    const countMessages = t(getMes(messagesLength), { count: messagesLength });

    return (
      <div className="col p-0 h-100">
        <div className="d-flex flex-column h-100">
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="m-0">
              <b>{`# ${activeChannelName}`}</b>
            </p>
            <span className="text-muted">{countMessages}</span>
          </div>
          <div id="messages-box" className="chat-messages px-5">
            <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 h-100 overflow-auto d-block">
              {selectorMessages.map((item) =>
                item.channelId === selectorActiveChannel ? (
                  <li key={item.id} id={item.id}>
                    <span className="me-1">
                      <b>{item.username}</b>:
                    </span>
                    {item.body}
                  </li>
                ) : null
              )}
            </ul>
          </div>
          <div className="mt-auto px-5 py-3">
            <Formik
              initialValues={{ message: "" }}
              onSubmit={(values, { setSubmitting }) => {
                const newMessage = {
                  body: values.message,
                  channelId: selectorActiveChannel,
                  username: "admin",
                };
                newSocket.emit("newMessage", newMessage, (response) => {
                  const { status } = response;
                  const { body } = newMessage;
                  setShowAlert(status === "ok" ? false : true);
                  console.log(
                    status === "ok"
                      ? `Сообщение ${body} доставлено`
                      : `Сообщение ${body} не доставлено`
                  );
                });
                setSubmitting(false);
              }}
            >
              {({
                values,
                handleChange,
                handleSubmit,
                isSubmitting,
                resetForm,
              }) => (
                <>
                  <Form
                    noValidate=""
                    onSubmit={handleSubmit}
                    className="py-1 border rounded-2"
                  >
                    <div className="input-group has-validation">
                      <Form.Control
                        name="message"
                        aria-label="Новое сообщение"
                        placeholder="Введите сообщение..."
                        className="border-0 p-0 ps-2 form-control"
                        onChange={handleChange}
                        value={values.message}
                        autoFocus
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={() => setTimeout(() => resetForm(""), 300)}
                        className="btn btn-group-vertical"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          width="20"
                          height="20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                          ></path>
                        </svg>
                        <span className="visually-hidden">Отправить</span>
                      </Button>
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
                        Сообщение {values.message}
                      </Alert.Heading>
                      не доставлено
                    </Alert>
                  ) : null}
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <I18nextProvider i18n={i18n} defaultNS={"translation"}>
            <Channels />
            <Chats />
            <RenderModal value={typeModal} />
          </I18nextProvider>
        </div>
      </div>
    </>
  );
};

/*<AddChannelModal />*/

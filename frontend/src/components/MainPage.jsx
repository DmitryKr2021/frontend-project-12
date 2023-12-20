import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { renderChannels, setActiveChannel } from "../slices/channels.js";
import { renderMessages } from "../slices/messages.js";
import { Button, Form, ButtonGroup, Alert, Dropdown } from "react-bootstrap";
import { Formik } from "formik";
import cn from "classnames";
import { useTranslation, I18nextProvider } from "react-i18next";
import { i18n, userContext } from "../index.js";
import getModal from "./modals/index.js";
import PropTypes from "prop-types";
import SvgPlus from "./svg/Svg-plus.jsx";
import SvgSend from "./svg/Svg-send.jsx";

export const MainPage = () => {
  const { socket } = useContext(userContext);
  const newSocket = socket.socket;
  const btnClass = cn("w-100", "rounded-0", "text-start");

  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const selectorMessages = useSelector((state) => state.messagesSlice.messages);
  const selectorActiveChannel = useSelector(
    (state) => state.channelsSlice.activeChannel
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [removingChannelNumber, setRemovingChannelNumber] = useState(null);
  const [typeModal, setTypeModal] = useState("null");

  const addOneChannel = () => {
    setShowAdd(true);
    setTypeModal("adding");
  };

  const closeAdd = () => {
    setShowAdd(false);
  };

  const removeOneChannel = (e) => {
    e.preventDefault();
    setShowRemove(true);
    setTypeModal("removing");
    setRemovingChannelNumber(e.target.getAttribute('data-index'))
  };

  const closeRemove = () => {
    setShowRemove(false);
  };

  const RenderModal = (props) => {
    const { value } = props;
    const getModalValue = getModal(value);
    switch (value) {
      case "adding":
        //return getModalValue(showAdd, closeAdd, showConfirm, closeConfirm);
        return getModalValue(showAdd, closeAdd);
      /*case 'renaming': return (getModalValue(showRename, closeRenameModal, taskToRename, renameTask));*/
      case 'removing': return (getModalValue(showRemove, closeRemove, removingChannelNumber));
      default:
        return null;
    }
  };

  RenderModal.propTypes = {
    value: PropTypes.node.isRequired,
  };

  const handleClick = (id) => {
    dispatch(setActiveChannel(id));
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
  }, [dispatch]);

  const dropDownClass = cn("square", "border", "border-0");

  const Channels = () => {
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
           <SvgPlus/>
            <span className="visually-hidden">+</span>
          </Button>
        </div>
        <ul
          id="channels-box"
          className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        >
          {selectorChannels.map((item) => (
            <li
              className="nav-item w-100 position-relative"
              key={item.id}
              id={item.id}
            >
              <ButtonGroup className="d-flex">
                <Button
                  type="button"
                  data-type="button"
                  onClick={() => handleClick(item.id)}
                  className={
                    item.id === selectorActiveChannel
                      ? btnClass + " btn-secondary"
                      : btnClass + " btn-light"
                  }
                >
                  <span className="me-1">#</span>
                  {item.name}
                </Button>
                {item.removable ? (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      aria-labelledby={item.id}
                      className={
                        item.id === selectorActiveChannel
                          ? dropDownClass + " btn-secondary"
                          : dropDownClass + " btn-light"
                      }
                      id="dropdown-basic"
                    >
                      <span className="visually-hidden">
                        Управление каналом
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item type="button" href="#/action-1" data-index={item.id} onClick={removeOneChannel}>Удалить</Dropdown.Item>
                      <Dropdown.Item type="button" href="#/action-2">
                        Переименовать
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : null}
              </ButtonGroup>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const Chats = () => {
   //const [activeChannel] = selectorChannels.filter(channel => channel.id === selectorActiveChannel);
   
   console.log('selectorChannels=', selectorChannels);
   //console.log('selectorActiveChannel=', selectorActiveChannel);
   console.log('filter=', selectorChannels.filter(channel => channel.id === selectorActiveChannel)[0])
   //const activeChannelName = selectorChannels.filter(channel => channel.id === selectorActiveChannel)[0].name;

    const activeChannelName = 'qwerty';

    const channelMessages = selectorMessages.filter(
      (item) => item.channelId === selectorActiveChannel
    );
    const messagesLength = channelMessages.length;
    const countMessages = t("mes", { count: messagesLength });

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
                        <SvgSend />
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


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addChannels } from "./slices/channels";
import { Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import cn from "classnames";

export const MainPage = () => {
  const [chatTitle, setChatTitle] = useState("# general");
  const dispatch = useDispatch();
  const btnClass = cn("w-100", "rounded-0", "text-start", "btn");
  const selector = useSelector((state) => state.channels.value);

  const handleClick = (e) => {
    const btnList = document.querySelectorAll("[data-type]");
    btnList.forEach(
      (item) =>
        (item.classList =
          item === e.target
            ? btnClass + " btn-secondary"
            : btnClass + " btn-light")
    );
    console.log(e.target)
    setChatTitle("# " + e.target.innerText.slice(1));
  };

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
        const { channels } = response.data;
        console.log("response.data=", response.data);
        console.log("selector=", selector);
        channels.forEach((channel) => {
          console.log('channel=', channel)
          //dispatch(addChannels(channel.name));
          dispatch(addChannels(channel));
        });
      });
    }

  useEffect(() => {
    const btnList = document.querySelectorAll("[data-type]");
    btnList.forEach(
      (item, index) =>
        (item.classList =
          index === 0 ? btnClass + " btn-secondary" : btnClass + " btn-light")
    );
  });

  const Channels = () => {
    return (
      <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <b>Каналы</b>
          <Button
            type="button"
            variant="light"
            className="p-0 text-primary btn btn-group-vertical"
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
          {selector.map((item) => (
            <li className="nav-item w-100" key={item.id}>
              <Button
                type="button"
                data-type="button"
                onClick={(e) => handleClick(e)}
              >
                <span className="me-1">#</span>
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const Chats = () => {
    return (
      <div className="col p-0 h-100">
        <div className="d-flex flex-column h-100">
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="m-0">
              <b>{chatTitle}</b>
            </p>
            <span className="text-muted">0 сообщений</span>
          </div>
          <div
            id="messages-box"
            className="chat-messages overflow-auto px-5 "
          ></div>
          <div className="mt-auto px-5 py-3">
            <Formik
              initialValues={{ message: "" }}
              onSubmit={(values) => console.log(values)}
            >
              {({ values, handleChange, handleSubmit }) => (
                <Form
                  noValidate=""
                  onSubmit={handleSubmit}
                  className="py-1 border rounded-2"
                >
                  <div className="input-group has-validation">
                    <Form.Control
                      name="body"
                      aria-label="Новое сообщение"
                      placeholder="Введите сообщение..."
                      className="border-0 p-0 ps-2 form-control"
                      onChange={handleChange}
                      value={values.message}
                    />
                    <Button
                      type="submit"
                      disabled=""
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
          <Channels />
          <Chats />
        </div>
      </div>
    </>
  );
};


/*{selector.map((item) => (
  <li className="nav-item w-100" key={item}>
    <Button
      type="button"
      data-type="button"
      onClick={(e) => handleClick(e)}
    >
      <span className="me-1">#</span>
      {item}
    </Button>
  </li>
))}*/
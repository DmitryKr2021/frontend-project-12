import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import SvgPlus from './svg/SvgPlus.jsx';
import {
  setActiveChannel,
  chooseModal,
} from '../slices/channels';
import getModal from './modals/index';

const Channels = () => {
  const [modal, setModal] = useState(null);
  const [channelNumber, setChannelNumber] = useState(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = t('main.channels');
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const selectorActiveChannel = useSelector(
    (state) => state.channelsSlice.activeChannel,
  );
  const btnClassLight = cn('w-100', 'rounded-0', 'text-start', 'text-truncate', 'btn', 'btn-light');
  const btnClassSecondary = cn('w-100', 'rounded-0', 'text-start', 'text-truncate', 'btn', 'btn-secondary');
  const dropDownClassLight = cn('square', 'border', 'border-0', 'btn-light');
  const dropDownClassSecondary = cn('square', 'border', 'border-0', 'btn-secondary');

  const manageChannel = (modalType) => (e) => {
    e.preventDefault();
    dispatch(chooseModal(modalType));
    setModal(modalType);
    setChannelNumber(e.target.getAttribute('data-index'));
  };

  const setModalNull = () => {
    setModal(null);
  };

  const setNotify = (text, result) => {
    const notify = () => toast[result](text);
    notify();
  };

  const RenderModal = ({ value }) => {
    if (value) {
      const getModalValue = getModal(value);
      const params = {
        channelNumber,
        setModalNull,
        setNotify,
      };
      return getModalValue(params);
    }
    return null;
  };

  RenderModal.propTypes = {
    value: PropTypes.node.isRequired,
  };

  const handleClick = (id) => {
    dispatch(setActiveChannel(id));
  };

  return (
    <>
      <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <b>{channels}</b>
          <Button
            type="button"
            variant="light"
            className="p-0 text-primary btn btn-group-vertical"
            onClick={manageChannel('adding')}
          >
            <SvgPlus />
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
                <button
                  type="button"
                  onClick={() => handleClick(item.id)}
                  className={
                    item.id === selectorActiveChannel
                      ? btnClassSecondary
                      : btnClassLight
                  }
                >
                  <span className="me-1">#</span>
                  {item.name}
                </button>
                {item.removable ? (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      className={
                        item.id === selectorActiveChannel
                          ? dropDownClassSecondary
                          : dropDownClassLight
                      }
                      id="dropdown-basic"
                    >
                      <span className="visually-hidden">{t('main.channelManage')}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        type="button"
                        href="#/action-1"
                        data-index={item.id}
                        onClick={manageChannel('removing')}
                      >
                        {t('main.remove')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="button"
                        href="#/action-2"
                        data-index={item.id}
                        onClick={manageChannel('renaming')}
                      >
                        {t('main.rename')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : null}
              </ButtonGroup>
            </li>
          ))}
        </ul>
      </div>
      {modal ? <RenderModal value={modal} /> : null}
    </>
  );
};

export default Channels;

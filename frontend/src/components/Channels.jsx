import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import SvgPlus from './svg/SvgPlus.jsx';
import { setActiveChannel } from '../slices/channels.js';
import getModal from './modals/index.js';

const Channels = () => {
  const [typeModal, setTypeModal] = useState(null);
  const [channelNumber, setChannelNumber] = useState(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = t('main.channels');
  const selectorChannels = useSelector((state) => state.channelsSlice.channels);
  const selectorActiveChannel = useSelector(
    (state) => state.channelsSlice.activeChannel,
  );
  const btnClassLight = cn('w-100', 'rounded-0', 'text-start', 'btn-light');
  const btnClassSecondary = cn('w-100', 'rounded-0', 'text-start', 'btn-secondary');
  const dropDownClassLight = cn('square', 'border', 'border-0', 'btn-light');
  const dropDownClassSecondary = cn('square', 'border', 'border-0', 'btn-secondary');
  const channelManage = t('main.channelManage');
  const remove = t('main.remove');
  const rename = t('main.rename');

  const manageChannel = (manageType) => (e) => {
    e.preventDefault();
    setTypeModal(manageType);
    setChannelNumber(e.target.getAttribute('data-index'));
  };

  const setModalNull = () => {
    setTypeModal(null);
  };

  const setNotify = (text, result) => {
    const notify = () => toast[result](text);
    notify();
  };

  const RenderModal = (props) => {
    const { value } = props;
    if (value) {
      const getModalValue = getModal(value);
      const params = {
        channelNumber,
        setModalNull,
        setNotify,
      };
      return getModalValue(params) || null;
    }
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
                <Button
                  type="button"
                  data-type="button"
                  onClick={() => handleClick(item.id)}
                  className={
                    item.id === selectorActiveChannel
                      ? btnClassSecondary
                      : btnClassLight
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
                          ? dropDownClassSecondary
                          : dropDownClassLight
                      }
                      id="dropdown-basic"
                    >
                      <span className="visually-hidden">{channelManage}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        type="button"
                        href="#/action-1"
                        data-index={item.id}
                        onClick={manageChannel('removing')}
                      >
                        {remove}
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="button"
                        href="#/action-2"
                        data-index={item.id}
                        onClick={manageChannel('renaming')}
                      >
                        {rename}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : null}
              </ButtonGroup>
            </li>
          ))}
        </ul>
      </div>
      {typeModal ? <RenderModal value={typeModal} /> : null}
    </>
  );
};

export default Channels;

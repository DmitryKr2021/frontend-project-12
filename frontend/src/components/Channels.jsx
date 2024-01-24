import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import SvgPlus from './svg/SvgPlus.jsx';
import { setActiveChannel } from '../slices/channels';
import { chooseModal } from '../slices/modals';
import getModal from './modals/index';

const Channels = () => {
  const [channelNumber, setChannelNumber] = useState(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tChannels = t('main.channels');
  const channels = useSelector((state) => state.channelsSlice.channels);
  const activeChannel = useSelector(
    (state) => state.channelsSlice.activeChannel,
  );
  const typeModal = useSelector((state) => state.modalsSlice.typeModal);
  const btnClassLight = cn('w-100', 'rounded-0', 'text-start', 'text-truncate', 'btn', 'btn-light');
  const btnClassSecondary = cn('w-100', 'rounded-0', 'text-start', 'text-truncate', 'btn', 'btn-secondary');
  const dropDownClassLight = cn('square', 'border', 'border-0', 'btn-light');
  const dropDownClassSecondary = cn('square', 'border', 'border-0', 'btn-secondary');

  const manageChannel = (modalType) => (e) => {
    e.preventDefault();
    dispatch(chooseModal(modalType));
    setChannelNumber(e.target.getAttribute('data-index'));
  };

  const RenderModal = ({ value }) => {
    if (value) {
      const getModalValue = getModal(value);
      const params = {
        channelNumber,
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
          <b>{tChannels}</b>
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
          {channels.map((item) => (
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
                    item.id === activeChannel
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
                        item.id === activeChannel
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
      {typeModal ? <RenderModal value={typeModal} /> : null}
    </>
  );
};

export default Channels;

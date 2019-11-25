import React from 'react';
import Modal from './Modal';
import { FormattedMessage } from 'react-intl';

const DeleteModal = props => {
  const {
    onCancel,
    onConfirm,
    onToggle,
    message,
    title,
    children,
  } = props;
  return (
    <Modal
      title={title !== '' ? title : Warning}
      toggleModal={onToggle}
    >
      <div className="warning">
        <i className="la la-exclamation-triangle" />

        <p>{message}</p>
        <p>{children}</p>
      </div>
      <div className="warning-footer text-center">
        <span className="col-4">
          <a
            className="fieldsight-btn rejected-btn"
            onClick={onCancel}
          >
            <FormattedMessage
              id="app.cancel"
              defaultMessage="Cancel"
            />
          </a>
        </span>

        <span className="col-4">
          <a className="fieldsight-btn" onClick={onConfirm}>
            <FormattedMessage
              id="app.confirm"
              defaultMessage="Confirm"
            />
          </a>
        </span>
      </div>
    </Modal>
  );
};

export default DeleteModal;

import React from 'react';
import { FormattedMessage } from 'react-intl';

const RightContentCard = ({
  title,
  addButton,
  // hideButton,
  toggleModal,
  children,
}) => (
  <div className="card">
    <div className="card-header main-card-header">
      <h5>
        <FormattedMessage id={title} defaultMessage={title} />
      </h5>
      {addButton && (
        <div className="add-btn">
          <a onClick={toggleModal}>
            <span>
              <i className="la la-plus" />
            </span>
          </a>
        </div>
      )}
    </div>

    <div className="card-body">{children}</div>
  </div>
);

export default RightContentCard;

import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
/* eslint-disable react/prop-types  */

class InviteTab extends PureComponent {
  render() {
    return (
      <>
        <span
          className="popup-close"
          tabIndex="0"
          role="button"
          onKeyDown={e => {
            this.props.invitationOpen(e, 'role');
          }}
          onClick={e => {
            this.props.invitationOpen(e, 'role');
          }}
        >
          <i className="la la-close" />
        </span>
        <div className="card">
          <div className="card-header main-card-header sub-card-header">
            <h5>
              <FormattedMessage
                id="app.invitation"
                defaultMessage="Invitation"
              />
            </h5>
            <div className="dash-btn ">
              <a
                className="popup-close"
                tabIndex="0"
                role="button"
                onKeyDown={() => {
                  this.props.acceptAll();
                }}
                onClick={() => {
                  this.props.acceptAll();
                }}
                // className="fieldsight-btn left-icon"
              >
                <i className="la la-check" />
                <FormattedMessage
                  id="app.acceptAll"
                  defaultMessage="Accept all"
                />
              </a>
            </div>
          </div>
          <div className="card-body">
            <div className="invitation-title">
              <span>
                <FormattedMessage
                  id="app.invitationTitle"
                  defaultMessage=" You have been invited to join FieldSight. You may Accept or
                            Decline each invitations or Accept all the invitations as per
                            required."
                />
              </span>
            </div>
            <div className="normal-list">
              <ul>
                {this.props.invitation.map(item => (
                  <li key={item.id}>
                    <p>
                      <a href="#">{item.by_user}</a>
                      <FormattedMessage
                        id="app.acceptAll"
                        defaultMessage=" has
                            invited you to join FieldSight as"
                      />
                      <span>{`${item.group}.`}</span>
                    </p>
                    <div className="invite-btn">
                      <a
                        href="#"
                        className="accept-btn"
                        tabIndex="0"
                        role="button"
                        onKeyDown={() => {
                          this.props.acceptHandler(
                            item.id,
                            item.current_user,
                          );
                        }}
                        onClick={() => {
                          this.props.acceptHandler(
                            item.id,
                            item.current_user,
                          );
                        }}
                      >
                        <i className="la la-check" />
                        <FormattedMessage
                          id="app.accept"
                          defaultMessage="Accept"
                        />
                      </a>
                      <a
                        className="reject-btn"
                        tabIndex="0"
                        role="button"
                        onKeyDown={() => {
                          this.props.rejectHandler(item.id);
                        }}
                        onClick={() => {
                          this.props.rejectHandler(item.id);
                        }}
                      >
                        <i className="la la-close" />

                        <FormattedMessage
                          id="app.reject"
                          defaultMessage="Reject"
                        />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default InviteTab;

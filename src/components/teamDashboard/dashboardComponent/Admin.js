import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AvatarContentLoader } from '../../common/Loader';
/* eslint-disable react/prop-types */

const AdminListItem = ({ admin }) => {
  return (
    <li>
      <figure>
        <img src={admin.profile} alt="user avatar" />
      </figure>
      <div className="content">
        <h6>
          <a href={`/users/profile/${admin.id}/`} target=" _blank">
            {admin.full_name}
          </a>
        </h6>
        <span>{admin.email}</span>
      </div>
    </li>
  );
};

class Admin extends PureComponent {
  render() {
    const { admin, showContentLoader } = this.props;

    return (
      <div className="card-body">
        <div
          className="thumb-list mr-0 "
          style={{ position: 'relative', height: '296px' }}
        >
          <>
            {showContentLoader ? (
              <AvatarContentLoader
                number={6}
                width="100%"
                size="40"
              />
            ) : (
              <PerfectScrollbar>
                <ul>
                  {admin.length > 0 ? (
                    admin.map(each => (
                      <AdminListItem
                        admin={each}
                        key={`admin_${each.id}`}
                      />
                    ))
                  ) : (
                    <p>
                      <FormattedMessage
                        id="app.noDataAvailable"
                        defaultMessage="No Data Available"
                      />
                    </p>
                  )}
                </ul>
              </PerfectScrollbar>
            )}
          </>
        </div>
      </div>
    );
  }
}
export default Admin;

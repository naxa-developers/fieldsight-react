import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import uuid from 'uuid/v4';
import { AvatarContentLoader } from '../../common/Loader';
/* eslint-disable react/prop-types  */

const UsersListItem = ({ user }) => {
  return (
    <li>
      <figure>
        <img src={user.profile_picture} alt="user avatar" />
      </figure>
      <div className="content">
        <a href={`/users/profile/${user.user}`}>
          <h6>{user.full_name}</h6>
        </a>
        <span>{user.email}</span>
      </div>
    </li>
  );
};

const UsersList = ({ users, showContentLoader }) => (
  <>
    {showContentLoader ? (
      <AvatarContentLoader number={6} width="100%" size="40" />
    ) : (
      <PerfectScrollbar>
        <ul>
          {users.length > 0 ? (
            users.map((user, i) => (
              <UsersListItem user={user} key={uuid()} />
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
);
export default UsersList;

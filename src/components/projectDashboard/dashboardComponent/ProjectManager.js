import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import { AvatarContentLoader } from '../../common/Loader';
/* eslint-disable react/prop-types  */

const ManagersListItem = ({ manager }) => (
  <li>
    <figure>
      <img src={manager.profile_picture} alt="user avatar" />
    </figure>
    <div className="content">
      <h6>
        <a href={`/users/profile/${manager.id}/`} target=" _blank">
          {manager.full_name}
        </a>
      </h6>
      <span>{manager.email}</span>
    </div>
  </li>
);

class ProjectManager extends React.PureComponent {
  render() {
    const { projectManagers, showContentLoader } = this.props;
    return (
      <>
        {showContentLoader ? (
          <AvatarContentLoader number={6} width="100%" size="40" />
        ) : (
          <PerfectScrollbar>
            <ul>
              {projectManagers.length > 0 ? (
                projectManagers.map(manager => (
                  <ManagersListItem
                    manager={manager}
                    key={`manager_${manager.id}`}
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
    );
  }
}
export default ProjectManager;

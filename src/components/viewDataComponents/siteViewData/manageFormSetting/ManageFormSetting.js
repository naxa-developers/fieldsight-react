import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
/* eslint-disable camelcase */

const sideNavRoutes = [
  {
    key: 0,
    to: '/general',
    path: '/general',
    title: 'General Forms',
    id: 'app.generate-forms',
  },
  {
    key: 1,
    to: '/scheduled',
    path: '/scheduled',
    title: 'Scheduled Forms',
    id: 'app.scheduled-form',
  },
  {
    key: 2,
    to: '/stage',
    path: '/stage',
    title: 'Stage Form',
    id: 'app.staged-form',
  },
];

const viewByStatus = [
  {
    key: 0,
    to: '/rejected',
    path: '/rejected',
    title: 'Rejected Submission',
    id: 'app.rejected-submissions',
  },
  {
    key: 1,
    to: '/flagged',
    path: '/flagged',
    title: 'Flagged Submission',
    id: 'app.flagged-submissions',
  },
  {
    key: 2,
    to: '/pending',
    path: '/pending',
    title: 'Pending Submission',
    id: 'app.pending-submissions',
  },
  {
    key: 3,
    to: '/approved',
    path: '/approved',
    title: 'Approved Submission',
    id: 'app.approved-submissions',
  },
];

class ManageFormSetting extends PureComponent {
  render() {
    const {
      location: { pathname },
      match: {
        params: { id },
      },
      show_submission,
    } = this.props;

    return (
      <>
        {!show_submission && (
          <ul className="nav nav-tabs flex-column border-tabs">
            {sideNavRoutes.map(route => (
              <li className="nav-item" key={route.key}>
                <Link
                  to={`/site-responses/${id}${route.to}`}
                  className={
                    pathname === `/site-responses/${id}${route.path}`
                      ? 'nav-link active'
                      : 'nav-link'
                  }
                >
                  {/*route.title*/}
                  <FormattedMessage
                    id={route.id}
                    defaultMessage={route.title}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
        {show_submission && (
          <ul className="nav nav-tabs flex-column border-tabs">
            {viewByStatus.map(route => (
              <li className="nav-item" key={route.key}>
                <Link
                  to={`/site-responses/${id}${route.to}`}
                  className={
                    pathname === `/site-responses/${id}${route.path}`
                      ? 'nav-link active'
                      : 'nav-link'
                  }
                >
                  {/*route.title*/}
                  <FormattedMessage
                    id={route.id}
                    defaultMessage={route.title}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

ManageFormSetting.propTypes = {
  location: PropTypes.objectOf.isRequired,
  match: PropTypes.objectOf.isRequired,
  show_submission: PropTypes.bool.isRequired,
};

export default withRouter(ManageFormSetting);

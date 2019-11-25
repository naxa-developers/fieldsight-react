import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
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
    title: 'Staged Forms',
    id: 'app.staged-form',
  },
];
const site_specific_forms = [
  {
    key: 0,
    to: '/general-survey',
    path: '/general-survey',
    title: 'General Forms',
    id: 'app.generate-forms',
  },
];

const viewByStatus = [
  {
    key: 0,
    to: '/rejected',
    path: '/rejected',
    title: 'Rejected Submissions',
    id: 'app.rejected-submissions',
  },
  {
    key: 1,
    to: '/flagged',
    path: '/flagged',
    title: 'Flagged Submissions',
    id: 'app.flagged-submissions',
  },
  {
    key: 2,
    to: '/pending',
    path: '/pending',
    title: 'Pending Submissions',
    id: 'app.pending-submissions',
  },
  {
    key: 3,
    to: '/approved',
    path: '/approved',
    title: 'Approved Submissions',
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
          <>
            <div className="manage_group">
              {/* <h5>Site Specific Forms</h5>*/}
              <h5>
                <FormattedMessage
                  id="app.site-specific-forms"
                  defaultMessage="Site Specific Forms"
                />
              </h5>
              <ul className="nav nav-tabs flex-column border-tabs">
                {sideNavRoutes.map(route => (
                  <li className="nav-item" key={route.key}>
                    <Link
                      to={`/project-responses/${id}${route.to}`}
                      className={
                        pathname ===
                        `/project-responses/${id}${route.path}`
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
            </div>
            <div className="manage_group mrt-15">
              {/*<h5>Project-Wide Forms</h5>*/}
              <h5>
                <FormattedMessage
                  id="app.project-wide-forms"
                  defaultMessage="Project-Wide Forms"
                />
              </h5>
              <ul className="nav nav-tabs flex-column border-tabs">
                {site_specific_forms.map(route => (
                  <li className="nav-item" key={route.key}>
                    <Link
                      to={`/project-responses/${id}${route.to}`}
                      className={
                        pathname ===
                        `/project-responses/${id}${route.path}`
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
            </div>
          </>
        )}
        {!!show_submission && (
          <ul className="nav nav-tabs flex-column border-tabs">
            {viewByStatus.map(route => (
              <li className="nav-item" key={route.key}>
                <Link
                  to={`/project-responses/${id}${route.to}`}
                  className={
                    pathname ===
                    `/project-responses/${id}${route.path}`
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
                <h5>{route.heading}</h5>
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

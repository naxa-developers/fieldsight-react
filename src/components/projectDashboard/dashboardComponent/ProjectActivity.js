import React from 'react';
import { FormattedMessage } from 'react-intl';
/* eslint-disable react/prop-types  */

const getIcon = submission => {
  let icon = '';
  if (submission === 'approved') {
    icon = 'la-copy';
  } else if (submission === 'flagged') {
    icon = 'la-users';
  } else if (submission === 'marker') {
    icon = 'la-map-marker';
  }
  return icon;
};

const ShowAcitivity = props => (
  <div className="col-xl-4 col-md-6">
    <div className="count-card">
      <div className={`count-icon ${props.type}`}>
        <i className={`la ${getIcon(props.type)}`}> </i>
      </div>
      <div className="count-content">
        <h4>{props.value}</h4>
        {/*<h6>{props.name}</h6>*/}
        <h6>
          <FormattedMessage
            id={props.id}
            defaultMessage={props.name}
          />
        </h6>
      </div>
    </div>
  </div>
);

class ProjectActivity extends React.PureComponent {
  render() {
    const { projectActivity } = this.props;
    return (
      <div className="dashboard-counter mrt-30 bg-counter">
        <div className="card">
          <div className="card-header main-card-header sub-card-header">
            {/* <h5>Project activity</h5>*/}
            <h5>
              <FormattedMessage
                id="app.project-activity"
                defaultMessage="Progress table"
              />
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <ShowAcitivity
                type="approved"
                name="Submissions In Last 7 Days"
                value={projectActivity.submissions_in_last_7_days}
                id="app.submission-in-last-7-days"
              />
              <ShowAcitivity
                type="flagged"
                name="Active Supervisors In Last 7 Days"
                value={
                  projectActivity.active_supervisors_in_last_7_days
                }
                id="app.active-supervisor-in-last-7-days"
              />
              <ShowAcitivity
                type="marker"
                name="Site Visits In Last 7 Days"
                value={projectActivity.site_visits_in_last_7_days}
                id="app.site-visit-in-last-7-days"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ProjectActivity;

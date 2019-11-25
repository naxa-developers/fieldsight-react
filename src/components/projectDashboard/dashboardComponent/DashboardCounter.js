import React from 'react';
import { Link } from 'react-router-dom';
import CountCard from '../../common/CountCard';
/* eslint-disable react/prop-types  */

const getIcon = submission => {
  let icon = '';
  if (submission === 'rejected') {
    icon = 'la-close';
  }
  if (submission === 'approved') {
    icon = 'la-thumbs-up';
  }
  if (submission === 'flagged') {
    icon = 'la-flag';
  }
  if (submission === 'pending') {
    icon = 'la-hourglass-2';
  }
  return icon;
};

const ShowCount = props => (
  <div className="col-xl-3 col-md-6">
    <Link to={props.link}>
      <CountCard
        countName={props.name}
        countNumber={props.count}
        className={props.name}
        icon={getIcon(props.name)}
        id={props.id}
      />
    </Link>
  </div>
);

class DashboardCounter extends React.PureComponent {
  render() {
    const { projectActivity, id } = this.props;

    return (
      <div className="dashboard-counter mrt-30">
        <div className="row">
          <ShowCount
            name="pending"
            count={projectActivity.pending_submissions}
            link={`/project-responses/${id}/pending`}
            id="app.pending"
          />
          <ShowCount
            name="approved"
            count={projectActivity.approved_submissions}
            link={`/project-responses/${id}/approved`}
            id="app.approved"
          />
          <ShowCount
            name="flagged"
            count={projectActivity.flagged_submissions}
            link={`/project-responses/${id}/flagged`}
            id="app.flagged"
          />
          <ShowCount
            name="rejected"
            count={projectActivity.rejected_submissions}
            link={`/project-responses/${id}/rejected`}
            id="app.pending"
          />
        </div>
      </div>
    );
  }
}
export default DashboardCounter;

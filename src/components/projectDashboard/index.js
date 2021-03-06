import React from 'react';
import { connect } from 'react-redux';
import DashboardHeader from './DashboardHeader';
import ProjectDashboardComponent from './dashboardComponent';

import { getProjectDashboard } from '../../actions/projectDashboardActions';
/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */

const INITIAL_STATE = {
  // activeTab: 'home',
  showHeaderModal: false,
  showSubmissionModal: false,
  showCropper: false,
  showSubsites: false,
  showGallery: false,
  // projectId: '',
};

class ProjectDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentWillMount() {
    const {
      match: {
        params: {
          id: projectId,
          // projectId: id,
        },
      },
    } = this.props;
    this.props.getProjectDashboard(projectId);
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    if (nextProps.match.params.id !== props.match.params.id) {
      const { id: projectId } = props.match.params;

      this.setState(
        {
          ...INITIAL_STATE,
        },
        () => {
          props.getProjectDashboard(projectId);
        },
      );
    }
  }

  closeModal = type => {
    // if (type) {
    return (
      type &&
      this.setState({
        [`show${type}`]: false,
      })
    );
    // }
  };

  openModal = type => {
    // if (type) {
    return (
      type &&
      this.setState({
        [`show${type}`]: true,
      })
    );
    // }
  };

  render() {
    const {
      projectDashboard: {
        name,
        address,
        public_desc,
        logo,
        project_activity,
        total_sites,
        total_users,
        terms_and_labels,
        breadcrumbs,
        projectDashboardLoader,
        is_project_manager,
        surveyData,
        identifier,
      },

      match: {
        params: { id: projectId },
        url,
      },
    } = this.props;

    const { showCropper, showGallery } = this.state;
    // console.log('url-', this.props);
    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          {Object.keys(breadcrumbs).length > 0 && (
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href={breadcrumbs.organization_url}>
                  {breadcrumbs.organization}
                </a>
              </li>
              <li className="breadcrumb-item">{breadcrumbs.name}</li>

              {/* <li className="breadcrumb-item active" aria-current="page">
                {breadcrumbs.site}
              </li> */}
            </ol>
          )}
        </nav>
        <div className="row">
          <div className="col-xl-12">
            <DashboardHeader
              name={name}
              address={address}
              logo={logo}
              public_desc={public_desc}
              totalUsers={total_users}
              totalSites={total_sites}
              totalSubmissions={project_activity.total_submissions}
              id={projectId}
              showContentLoader={projectDashboardLoader}
              closeModal={this.closeModal}
              openModal={this.openModal}
              showCropper={showCropper}
              termsAndLabels={terms_and_labels}
              showGallery={showGallery}
              isProjectManager={is_project_manager}
              surveyData={surveyData}
              path={url}
              identifier={identifier}
            />
            <ProjectDashboardComponent projectId={projectId} />
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = ({ projectDashboard }) => ({
  projectDashboard,
});
export default connect(mapStateToProps, {
  getProjectDashboard,
})(ProjectDashboard);

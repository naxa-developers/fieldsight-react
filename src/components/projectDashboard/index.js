import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import withPagination from '../../hoc/WithPagination';

import DashboardHeader from './dashboardComponent/DashboardHeader';
import SiteMap from '../common/SiteMap';
import RegionsTable from './dashboardComponent/RegionsTable';
import DashboardCounter from './dashboardComponent/DashboardCounter';
import ProjectActivity from './dashboardComponent/ProjectActivity';
import ProgressTable from './dashboardComponent/ProgressTable';
import SubmissionChart from '../siteDashboard/dashboardComponent/SubmissionChart';
import ProgressChart from './dashboardComponent/ProgressChart';
import About from './dashboardComponent/About';
import ProjectManager from './dashboardComponent/ProjectManager';
import Logs from '../common/Logs';
import SiteListTable from './dashboardComponent/SiteListTable';
import {
  getProjectDashboard,
  getRegionData,
  getProgressTableData,
  getSurveyForm,
} from '../../actions/projectDashboardActions';
/* eslint-disable camelcase */
/* eslint-disable react/prop-types  */

const INITIAL_STATE = {
  activeTab: 'site',
  showHeaderModal: false,
  showSubmissionModal: false,
  showCropper: false,
  showSubsites: false,
  showGallery: false,
  projectId: '',
};
const user_id = window.user_id ? window.user_id : 1;

class ProjectDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentWillMount() {
    const {
      params: {
        match: { id: projectId },
      },
      // getProgressTableData,
      // getProjectDashboard,
      // getSurveyForm,
      paginationHandler,
    } = this.props;
    getProjectDashboard(projectId);
    getProgressTableData(projectId);
    getSurveyForm(projectId);
    this.setState({ projectId });
    paginationHandler(1, null, {
      type: 'projectSiteList',
      projectId,
    });
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
          props.getProgressTableData(projectId);

          this.setState({ projectId });
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

  toggleTab = formType => {
    const {
      state: { projectId, activeTab },
      props: { paginationHandler },
    } = this;
    this.setState(
      {
        activeTab: formType,
      },
      () => {
        if (activeTab === 'region') {
          getRegionData(projectId);
        } else if (activeTab === 'site') {
          paginationHandler(1, null, {
            type: 'projectSiteList',
            projectId,
          });
        }
      },
    );
  };

  onChangeHandler = e => {
    const searchValue = e.target.value;
    const { projectId } = this.state;
    this.props.searchHandler(
      searchValue,
      `/fv3/api/project-site-list/?page=1&project=${projectId}&q=${searchValue}`,
      {
        type: 'projectSiteList',
        projectId,
      },
    );
  };

  render() {
    const {
      projectDashboard: {
        id,
        name,
        address,
        public_desc,
        logo,
        contacts,
        project_activity,
        total_sites,
        total_users,
        project_managers,
        has_region,
        logs,
        form_submissions_chart_data,
        site_progress_chart_data,
        map,
        terms_and_labels,
        breadcrumbs,
        projectDashboardLoader,
        regionData,
        projectRegionDataLoader,
        progressTableData,
        progressLoader,
        is_project_manager,
        surveyData,
      },
      siteList,
      dLoader,
      match: {
        params: { id: projectId },
      },
      fromData,
      toData,
      totalCount,
      pageNum,
      paginationHandler,
      renderPageNumbers,
    } = this.props;

    const { activeTab, showCropper, showGallery } = this.state;

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
        <div className="right-content no-bg new-dashboard">
          <DashboardHeader
            name={name}
            address={address}
            logo={logo}
            public_desc={public_desc}
            totalUsers={total_users}
            totalSites={total_sites}
            totalSubmissions={project_activity.total_submissions}
            id={id}
            showContentLoader={projectDashboardLoader}
            activeTab={activeTab}
            closeModal={this.closeModal}
            openModal={this.openModal}
            showCropper={showCropper}
            termsAndLabels={terms_and_labels}
            showGallery={showGallery}
            isProjectManager={is_project_manager}
            surveyData={surveyData}
          />
          <div className="row">
            <div className="col-lg-6">
              <div className="card map">
                <div className="card-header main-card-header sub-card-header">
                  <h5>
                    {terms_and_labels && terms_and_labels.site}
                    Map
                  </h5>
                  <div className="dash-btn">
                    <a
                      href={`/fieldsight/proj-map/${id}/`}
                      className="fieldsight-btn left-icon"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="la la-map" /> {/*Full map*/}
                      <FormattedMessage
                        id="app.full-map"
                        defaultMessage="Full Map"
                      />
                    </a>
                  </div>
                </div>
                <div className="card-body">
                  <SiteMap
                    map={map}
                    showContentLoader={projectDashboardLoader}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card region-table">
                <div className="card-header main-card-header sub-card-header">
                  {/* <div className="form-group"> */}
                  <ul className="nav nav-tabs ">
                    <li className="nav-item">
                      <a
                        tabIndex="0"
                        role="button"
                        onKeyDown={() => {
                          this.toggleTab('site');
                        }}
                        className={
                          activeTab === 'site'
                            ? 'nav-link active'
                            : 'nav-link'
                        }
                        onClick={() => {
                          this.toggleTab('site');
                        }}
                      >
                        {/* Sites*/}
                        <FormattedMessage
                          id="app.sites"
                          defaultMessage="Sites"
                        />
                      </a>
                    </li>
                    {!!has_region && (
                      <li className="nav-item">
                        <a
                          tabIndex="0"
                          role="button"
                          onKeyDown={() => {
                            this.toggleTab('region');
                          }}
                          className={
                            activeTab === 'region'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          onClick={() => {
                            this.toggleTab('region');
                          }}
                        >
                          {/*Regions*/}
                          <FormattedMessage
                            id="app.regions"
                            defaultMessage="Regions"
                          />
                        </a>
                      </li>
                    )}
                  </ul>
                  {/* </div> */}
                  {activeTab === 'site' && (
                    <div className="dash-btn">
                      <form
                        className="floating-form"
                        onSubmit={e => {
                          e.preventDefault();
                        }}
                      >
                        <div className="form-group mr-0">
                          <input
                            type="search"
                            className="form-control"
                            placeholder={this.props.intl.formatMessage(
                              {
                                id: 'app.teams-search',
                                defaultMessage: 'Search',
                              },
                            )}
                            onChange={this.onChangeHandler}
                          />
                          {/* <label htmlFor="input">Search</label> */}
                          <i className="la la-search" />
                        </div>
                      </form>
                      {is_project_manager && (
                        <a
                          href={`/fieldsight/application/#/create-site/${projectId}/`}
                          target="_blank"
                          className="fieldsight-btn"
                          rel="noopener noreferrer"
                        >
                          <i className="la la-plus" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {activeTab === 'site' && (
                  <>
                    <SiteListTable
                      id={projectId}
                      data={siteList}
                      loader={dLoader}
                      terms={terms_and_labels}
                    />

                    {siteList.length > 0 && (
                      <div className="card-body">
                        <div className="table-footer">
                          <div className="showing-rows">
                            <p>
                              Showing
                              <span>{fromData}</span>
                              to
                              <span>
                                {toData > totalCount
                                  ? totalCount
                                  : toData}
                              </span>
                              of
                              <span>{totalCount}</span>
                              entries.
                            </p>
                          </div>
                          {toData < totalCount ? (
                            <div className="table-pagination">
                              <ul>
                                <li className="page-item">
                                  <a
                                    tabIndex="0"
                                    role="button"
                                    onKeyDown={() => {
                                      paginationHandler(
                                        pageNum - 1,
                                        null,
                                        {
                                          type: 'projectSiteList',
                                          projectId,
                                        },
                                      );
                                    }}
                                    onClick={() => {
                                      paginationHandler(
                                        pageNum - 1,
                                        null,
                                        {
                                          type: 'projectSiteList',
                                          projectId,
                                        },
                                      );
                                    }}
                                  >
                                    <i className="la la-long-arrow-left" />
                                  </a>
                                </li>

                                {renderPageNumbers({
                                  type: 'projectSiteList',
                                  projectId,
                                })}

                                <li className="page-item ">
                                  <a
                                    tabIndex="0"
                                    role="button"
                                    onKeyDown={() => {
                                      paginationHandler(
                                        pageNum + 1,
                                        null,
                                        {
                                          type: 'projectSiteList',
                                          projectId,
                                        },
                                      );
                                    }}
                                    onClick={() => {
                                      paginationHandler(
                                        pageNum + 1,
                                        null,
                                        {
                                          type: 'projectSiteList',
                                          projectId,
                                        },
                                      );
                                    }}
                                  >
                                    <i className="la la-long-arrow-right" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'region' && (
                  <RegionsTable
                    id={projectId}
                    loader={projectRegionDataLoader}
                    data={regionData}
                    terms={terms_and_labels}
                  />
                )}
              </div>
            </div>
          </div>
          <ProjectActivity projectActivity={project_activity} />
          <DashboardCounter
            projectActivity={project_activity}
            id={this.state.projectId}
          />
          <div className="progress-table mrb-30">
            <div className="card">
              <div className="card-header main-card-header sub-card-header">
                {/*<h5>Progress table</h5>*/}
                <h5>
                  <FormattedMessage
                    id="app.progress-table"
                    defaultMessage="Progress table"
                  />
                </h5>
              </div>

              <ProgressTable
                data={progressTableData}
                loader={progressLoader}
                id={projectId}
              />
            </div>
          </div>
          <div className="chart mrb-30">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header main-card-header sub-card-header">
                    {/* <h5>Form submissions</h5>*/}
                    <h5>
                      <FormattedMessage
                        id="app.form-submission"
                        defaultMessage="Form Submissions"
                      />
                    </h5>
                  </div>
                  <div className="card-body">
                    <SubmissionChart
                      submissionData={form_submissions_chart_data}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header main-card-header sub-card-header">
                    {/*<h5>Site progress</h5>*/}
                    <h5>
                      <FormattedMessage
                        id="app.site-progress"
                        defaultMessage="Site Progress"
                      />
                    </h5>
                  </div>
                  <div className="card-body">
                    <ProgressChart
                      progressData={site_progress_chart_data}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="about-section ">
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <div className="card ">
                  <About contacts={contacts} desc={public_desc} />
                </div>
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="card mangager-list">
                  <div className="card-header main-card-header sub-card-header">
                    {/* <h5>Project managers</h5>*/}
                    <h5>
                      <FormattedMessage
                        id="app.project-managers"
                        defaultMessage="Progress Managers"
                      />
                    </h5>
                    {/* <div className="dash-btn">
                        <form className="floating-form">
                          <div className="form-group mr-0">
                            <input
                              type="search"
                              className="form-control"
                              required
                            />
                            <label htmlFor="input">Search</label>
                            <i className="la la-search" />
                          </div>
                        </form>
                        <a href="#" className="fieldsight-btn">
                          <i className="la la-plus" />
                        </a>
                      </div> */}
                  </div>
                  <div className="card-body">
                    <div
                      className="thumb-list mr-0 "
                      style={{
                        position: 'relative',
                        height: '327px',
                      }}
                    >
                      <ProjectManager
                        projectManagers={project_managers}
                        showContentLoader={projectDashboardLoader}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Logs
                siteLogs={logs}
                showContentLoader={projectDashboardLoader}
                siteId={id}
                type="project"
                user_id={user_id}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = ({ projectDashboard }) => ({
  projectDashboard,
});
export default compose(
  connect(mapStateToProps, {
    getProjectDashboard,
    getRegionData,
    getProgressTableData,
    getSurveyForm,
  }),
  withPagination,
)(injectIntl(ProjectDashboard));

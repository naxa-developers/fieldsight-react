import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { FormattedMessage } from "react-intl";
import withPagination from "../../hoc/WithPagination";

import DashboardHeader from "./dashboardComponent/DashboardHeader";
import SiteMap from "../common/SiteMap";
import RegionsTable from "./dashboardComponent/RegionsTable";
import DashboardCounter from "./dashboardComponent/DashboardCounter";
import ProjectActivity from "./dashboardComponent/ProjectActivity";
import ProgressTable from "./dashboardComponent/ProgressTable";
import SubmissionChart from "../siteDashboard/dashboardComponent/SubmissionChart";
import ProgressChart from "./dashboardComponent/ProgressChart";
import About from "./dashboardComponent/About";
import ProjectManager from "./dashboardComponent/ProjectManager";
import Logs from "../common/Logs";
import SiteListTable from "./dashboardComponent/SiteListTable";
import {
  getProjectDashboard,
  getRegionData,
  getProgressTableData,
  getSurveyForm
} from "../../actions/projectDashboardActions";
import { LanguageContext } from "../../languageContext";

const INITIAL_STATE = {
  activeTab: "site",
  showHeaderModal: false,
  showSubmissionModal: false,
  showCropper: false,
  showSubsites: false,
  showGallery: false,
  projectId: ""
};
const user_id = window.user_id ? window.user_id : 1;

class ProjectDashboard extends React.Component {
  state = INITIAL_STATE;

  closeModal = type => {
    // const { id: projectId } = this.props.match.params;

    if (type) {
      return this.setState({
        [`show${type}`]: false
      });
    }
  };

  openModal = type => {
    // const { id: projectId } = this.props.match.params;

    if (type) {
      return this.setState({
        [`show${type}`]: true
      });
    }
  };

  toggleTab = formType => {
    const { projectId } = this.state;
    this.setState(
      {
        activeTab: formType
      },
      () => {
        if (this.state.activeTab == "region") {
          this.props.getRegionData(projectId);
        } else if (this.state.activeTab == "site") {
          this.props.paginationHandler(1, null, {
            type: "projectSiteList",
            projectId: projectId
          });
        }
      }
    );
  };

  componentWillMount() {
    const { id: projectId } = this.props.match.params;
    this.props.getProjectDashboard(projectId);
    this.props.getProgressTableData(projectId);
    this.props.getSurveyForm(projectId);
    this.setState({ projectId: projectId });
    this.props.paginationHandler(1, null, {
      type: "projectSiteList",
      projectId: projectId
    });
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.projectDashboard != this.props.projectDashboard) {
    //   const { projectId, activeTab } = this.state;
    //   if (!!nextProps.projectDashboard.has_region && activeTab === "") {
    //     this.setState(
    //       {
    //         activeTab: "region"
    //       },
    //       this.props.getRegionData(projectId)
    //     );
    //   } else if (!nextProps.projectDashboard.has_region && activeTab === "") {
    //     this.setState(
    //       {
    //         activeTab: "site"
    //       },
    //       () => {
    //         this.props.paginationHandler(1, null, {
    //           type: "projectSiteList",
    //           projectId: projectId
    //         });
    //       }
    //     );
    //   }
    // }
    if (nextProps.match.params.id !== this.props.match.params.id) {
      const { id: projectId } = this.props.match.params;

      this.setState(
        {
          ...INITIAL_STATE
        },
        () => {
          this.props.getProjectDashboard(projectId);
          this.props.getProgressTableData(projectId);

          this.setState({ projectId: projectId });
        }
      );
    }
  }
  onChangeHandler = e => {
    const searchValue = e.target.value;
    const { projectId } = this.state;
    this.props.searchHandler(
      searchValue,
      `/fv3/api/project-site-list/?page=1&project=${projectId}&q=${searchValue}`,
      {
        type: "projectSiteList",
        projectId
      }
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
        surveyData
      },
      siteList,
      dLoader,
      match: {
        params: { id: projectId }
      }
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
                  <h5>{terms_and_labels && terms_and_labels.site} Map</h5>
                  <div className="dash-btn">
                    <a
                      href={`/fieldsight/proj-map/${id}/`}
                      className="fieldsight-btn left-icon"
                      target="_blank"
                    >
                      <i className="la la-map" /> Full map
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
                        className={
                          activeTab === "site" ? "nav-link active" : "nav-link"
                        }
                        onClick={() => this.toggleTab("site")}
                      >
                        Sites
                      </a>
                    </li>{" "}
                    {!!has_region && (
                      <li className="nav-item">
                        <a
                          className={
                            activeTab === "region"
                              ? "nav-link active"
                              : "nav-link"
                          }
                          onClick={() => this.toggleTab("region")}
                        >
                          Regions
                        </a>
                      </li>
                    )}
                  </ul>
                  {/* </div> */}
                  {activeTab === "site" && (
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
                            placeholder="Search"
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
                        >
                          <i className="la la-plus" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {activeTab === "site" && (
                  <>
                    <SiteListTable
                      id={projectId}
                      data={siteList}
                      loader={dLoader}
                      terms={terms_and_labels}
                    />

                    {this.props.siteList.length > 0 && (
                      <div className="card-body">
                        <div className="table-footer">
                          <div className="showing-rows">
                            <p>
                              Showing <span>{this.props.fromData}</span> to{" "}
                              <span>
                                {" "}
                                {this.props.toData > this.props.totalCount
                                  ? this.props.totalCount
                                  : this.props.toData}{" "}
                              </span>{" "}
                              of <span>{this.props.totalCount}</span> entries.
                            </p>
                          </div>
                          {this.props.toData < this.props.totalCount ? (
                            <div className="table-pagination">
                              <ul>
                                <li className="page-item">
                                  <a
                                    onClick={e =>
                                      this.props.paginationHandler(
                                        this.props.pageNum - 1,
                                        null,
                                        {
                                          type: "projectSiteList",
                                          projectId: projectId
                                        }
                                      )
                                    }
                                  >
                                    <i className="la la-long-arrow-left" />
                                  </a>
                                </li>

                                {this.props.renderPageNumbers({
                                  type: "projectSiteList",
                                  projectId: projectId
                                })}

                                <li className="page-item ">
                                  <a
                                    onClick={e =>
                                      this.props.paginationHandler(
                                        this.props.pageNum + 1,
                                        null,
                                        {
                                          type: "projectSiteList",
                                          projectId: projectId
                                        }
                                      )
                                    }
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
                {activeTab === "region" && (
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
                <h5>Progress table</h5>
              </div>

              <ProgressTable
                data={progressTableData}
                loader={progressLoader}
                id={this.props.match.params.id}
              />
            </div>
          </div>
          <div className="chart mrb-30">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header main-card-header sub-card-header">
                    <h5>Form submissions</h5>
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
                    <h5>Site progress</h5>
                  </div>
                  <div className="card-body">
                    <ProgressChart progressData={site_progress_chart_data} />
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
                    <h5>Project managers</h5>
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
                      style={{ position: "relative", height: "327px" }}
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
  projectDashboard
});
ProjectDashboard.contextType = LanguageContext;
export default compose(
  connect(
    mapStateToProps,
    {
      getProjectDashboard,
      getRegionData,
      getProgressTableData,
      getSurveyForm
    }
  ),
  withPagination
)(ProjectDashboard);

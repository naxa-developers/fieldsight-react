import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

import ManageFormSetting from "./manageFormSetting/ManageFormSetting";
import ManageGeneralForm from "./manageGeneralForm";
import ManageSurveyForm from "./manageSurveyForm";
import ManageScheduledForm from "./manageScheduledForm";
import ManageStageForm from "./manageStageForm";

import ApprovedTable from "./ApprovedTable";
import PendingTable from "./PendingSubmissionTable";
import RejectedTable from "./RejectSubmissionTable";
import FlaggedTable from "./FlagedTable";

class ViewData extends Component {
  state = {
    hide: true,
    view_btn: false,
    id: this.props.match.params && this.props.match.params.id,
    deleted_forms: [],
    generals_forms: [],
    url: this.props.match.url && this.props.match.url,
    breadCrumb: {}
  };
  toggleHide = () => {
    this.setState({
      hide: !this.state.hide
    });
  };
  showViewData = () => {
    this.setState(
      state => {
        if (!!this.state.view_btn) {
          return {
            url: `${this.props.match.url}/general`,
            view_btn: !this.state.view_btn
          };
        } /*else if (
          this.props.match.url === `/project-responses/${this.state.id}`
        ) {
          return {
            url: `${this.props.match.url}rejected`,
            view_btn: !this.state.view_btn
          };
        }*/ else {
          return {
            url: `${this.props.match.url}/rejected`,
            view_btn: !this.state.view_btn
          };
        }
      },
      () => {
        this.props.history.push(this.state.url);
      }
    );
  };
  componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    if (
      this.props.location.pathname === `/project-responses/${id}/rejected` ||
      this.props.location.pathname === `/project-responses/${id}/pending` ||
      this.props.location.pathname === `/project-responses/${id}/flagged` ||
      this.props.location.pathname === `/project-responses/${id}/approved`
    ) {
      this.setState({
        id,
        view_btn: true
      });
    } else if (
      this.props.location.pathname === `/project-responses/${id}/general` ||
      this.props.location.pathname === `/project-responses/${id}/stage` ||
      this.props.location.pathname === `/project-responses/${id}/scheduled` ||
      this.props.location.pathname === `/project-responses/${id}/general-survey`
    ) {
      this.setState({
        view_btn: false,
        id
      });
    }
  }
  handleBreadCrumb = breadCrumb => {
    if (!!breadCrumb) {
      this.setState({
        breadCrumb
      });
    }
  };
  componentDidUpdate(preState) {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    if (preState.location.pathname !== this.props.location.pathname) {
      if (
        this.props.location.pathname === `/project-responses/${id}/rejected` ||
        this.props.location.pathname === `/project-responses/${id}/pending` ||
        this.props.location.pathname === `/project-responses/${id}/flagged` ||
        this.props.location.pathname === `/project-responses/${id}/approved`
      ) {
        this.setState({
          id,
          view_btn: true
        });
      } else if (
        this.props.location.pathname === `/project-responses/${id}/general` ||
        this.props.location.pathname === `/project-responses/${id}/stage` ||
        this.props.location.pathname === `/project-responses/${id}/scheduled` ||
        this.props.location.pathname ===
          `/project-responses/${id}/general-survey`
      ) {
        this.setState({
          view_btn: false,
          id
        });
      } else if (this.props.location.pathname == `/project-responses/${id}`) {
        this.props.history.push(`/project-responses/${id}/general`) ||
          this.props.history.push(`/project-responses/${id}/rejected`);
      }
    }
  }
  render() {
    const {
      match: {
        params: { id }
      },
      breadcrumbs
    } = this.props;

    return (
      <React.Fragment>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href={
                  breadcrumbs.project_url || this.state.breadCrumb.project_url
                }
              >
                {breadcrumbs.project_name || this.state.breadCrumb.project_name}
              </a>
            </li>
            <li className="breadcrumb-item">
              {breadcrumbs.current_page || this.state.breadCrumb.current_page}
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="left-sidebar new-sidebar sticky-top">
              <div
                className="card no-boxshadow"
                style={{ minHeight: this.props.height }}
              >
                <div className="card-header main-card-header">
                  <h5>View Data</h5>
                </div>
                <div className="card-body">
                  <ManageFormSetting
                    show_submission={this.state.view_btn}
                    url={this.state.url}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-8">
            <div className="right-content">
              <div className="card">
                <div className="tab-content">
                  <Switch>
                    <Route
                      exact
                      path={`${this.props.match.url}/general`}
                      render={props => (
                        <ManageGeneralForm
                          showViewData={this.showViewData}
                          data={this.state.view_btn}
                          id={this.state.id}
                          url={this.state.url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${this.props.match.url}/scheduled`}
                      render={props => (
                        <ManageScheduledForm
                          showViewData={this.showViewData}
                          data={this.state.view_btn}
                          id={this.state.id}
                          url={this.state.url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={`${this.props.match.url}/stage`}
                      render={props => (
                        <ManageStageForm
                          showViewData={this.showViewData}
                          data={this.state.view_btn}
                          id={this.state.id}
                          url={this.state.url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${this.props.match.url}/general-survey`}
                      render={props => (
                        <ManageSurveyForm
                          showViewData={this.showViewData}
                          data={this.state.view_btn}
                          id={this.state.id}
                          url={this.state.url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${this.props.match.url}/approved`}
                      render={props => (
                        <ApprovedTable
                          showViewData={this.showViewData}
                          data={this.state.view_btn}
                          id={this.state.id}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${this.props.match.url}/flagged`}
                      render={props => (
                        <FlaggedTable
                          showViewData={this.showViewData}
                          data={this.state.view_btn}
                          id={this.state.id}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={`${this.props.match.url}/pending`}
                      render={props => (
                        <PendingTable
                          showViewData={this.showViewData}
                          data={this.state.view_btn}
                          id={this.state.id}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${this.props.match.url}/rejected`}
                      render={props => (
                        <RejectedTable
                          showViewData={this.showViewData}
                          data={this.state.view_btn}
                          id={this.state.id}
                          url={this.state.url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ projectViewData }) => {
  const { breadcrumbs } = projectViewData;

  return {
    breadcrumbs
  };
};
export default compose(connect(mapStateToProps))(ViewData);

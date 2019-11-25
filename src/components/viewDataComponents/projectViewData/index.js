import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import ManageFormSetting from './manageFormSetting/ManageFormSetting';
import ManageGeneralForm from './manageGeneralForm';
import ManageSurveyForm from './manageSurveyForm';
import ManageScheduledForm from './manageScheduledForm';
import ManageStageForm from './manageStageForm';

import ApprovedTable from './ApprovedTable';
import PendingTable from './PendingSubmissionTable';
import RejectedTable from './RejectSubmissionTable';
import FlaggedTable from './FlagedTable';
/* eslint-disable camelcase */

class ViewData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: true,
      view_btn: false,
      id: props.match.params && props.match.params.id,
      url: props.match.url && props.match.url,
      breadCrumb: {},
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      location: { pathname },
    } = this.props;
    if (
      pathname === `/project-responses/${id}/rejected` ||
      pathname === `/project-responses/${id}/pending` ||
      pathname === `/project-responses/${id}/flagged` ||
      pathname === `/project-responses/${id}/approved`
    ) {
      this.setState({
        id,
        view_btn: true,
      });
    } else if (
      pathname === `/project-responses/${id}/general` ||
      pathname === `/project-responses/${id}/stage` ||
      pathname === `/project-responses/${id}/scheduled` ||
      pathname === `/project-responses/${id}/general-survey`
    ) {
      this.setState({
        view_btn: false,
        id,
      });
    }
  }

  componentDidUpdate(preState) {
    const {
      match: {
        params: { id },
      },
      location: { pathname },
    } = this.props;

    if (preState.location.pathname !== pathname) {
      this.getPath(pathname, id);
    }
  }

  getPath = (pathname, id) => {
    if (
      pathname === `/project-responses/${id}/rejected` ||
      pathname === `/project-responses/${id}/pending` ||
      pathname === `/project-responses/${id}/flagged` ||
      pathname === `/project-responses/${id}/approved`
    ) {
      this.setState({
        id,
        view_btn: true,
      });
    } else if (
      pathname === `/project-responses/${id}/general` ||
      pathname === `/project-responses/${id}/stage` ||
      pathname === `/project-responses/${id}/scheduled` ||
      pathname === `/project-responses/${id}/general-survey`
    ) {
      this.setState({
        view_btn: false,
        id,
      });
    } else if (pathname === `/project-responses/${id}`) {
      const url =
        `/project-responses/${id}/general` ||
        `/project-responses/${id}/rejected`;
      this.pushHistory(url);
    }
  };

  pushHistory = url => {
    this.props.history.push(url);
  };

  toggleHide = () => {
    this.setState(state => ({
      hide: !state.hide,
    }));
  };

  showViewData = () => {
    const {
      match: { url },
    } = this.props;
    if (this.state.view_btn) {
      this.setState(state => ({
        url: `${url}/general`,
        view_btn: !state.view_btn,
      }));
    } else {
      this.setState(state => ({
        url: `${url}/rejected`,
        view_btn: !state.view_btn,
      }));
    }

    this.pushHistory(this.state.url);
  };

  handleBreadCrumb = breadCrumb => {
    if (breadCrumb) {
      this.setState({
        breadCrumb,
      });
    }
  };

  render() {
    const {
      match: {
        url: siteUrl,
        // params: { id },
      },
      breadcrumbs,
      height,
    } = this.props;
    const { breadCrumb, view_btn, url, id } = this.state;
    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href={
                  breadcrumbs.project_url || breadCrumb.project_url
                }
              >
                {breadcrumbs.project_name || breadCrumb.project_name}
              </a>
            </li>
            <li className="breadcrumb-item">
              {breadcrumbs.current_page || breadCrumb.current_page}
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="left-sidebar new-sidebar sticky-top">
              <div
                className="card no-boxshadow"
                style={{ minHeight: height }}
              >
                <div className="card-header main-card-header">
                  {/*<h5>View Data</h5>*/}
                  <h5>
                    <FormattedMessage
                      id="app.view-data"
                      defaultMessage="View Data"
                    />
                  </h5>
                </div>
                <div className="card-body">
                  <ManageFormSetting
                    show_submission={view_btn}
                    url={url}
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
                      path={`${siteUrl}/general`}
                      render={props => (
                        <ManageGeneralForm
                          showViewData={this.showViewData}
                          data={view_btn}
                          id={id}
                          url={url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${siteUrl}/scheduled`}
                      render={props => (
                        <ManageScheduledForm
                          showViewData={this.showViewData}
                          data={view_btn}
                          id={id}
                          url={url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={`${siteUrl}/stage`}
                      render={props => (
                        <ManageStageForm
                          showViewData={this.showViewData}
                          data={view_btn}
                          id={id}
                          url={url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${siteUrl}/general-survey`}
                      render={props => (
                        <ManageSurveyForm
                          showViewData={this.showViewData}
                          data={view_btn}
                          id={id}
                          url={url}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${siteUrl}/approved`}
                      render={props => (
                        <ApprovedTable
                          showViewData={this.showViewData}
                          data={view_btn}
                          id={id}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${siteUrl}/flagged`}
                      render={props => (
                        <FlaggedTable
                          showViewData={this.showViewData}
                          data={view_btn}
                          id={id}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={`${siteUrl}/pending`}
                      render={props => (
                        <PendingTable
                          showViewData={this.showViewData}
                          data={view_btn}
                          id={id}
                          handleBreadCrumb={this.handleBreadCrumb}
                          {...props}
                        />
                      )}
                    />

                    <Route
                      path={`${siteUrl}/rejected`}
                      render={props => (
                        <RejectedTable
                          showViewData={this.showViewData}
                          data={view_btn}
                          id={id}
                          url={url}
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
      </>
    );
  }
}

const mapStateToProps = ({ projectViewData }) => {
  const { breadcrumbs } = projectViewData;

  return {
    breadcrumbs,
  };
};

ViewData.propTypes = {
  match: PropTypes.objectOf.isRequired,
  history: PropTypes.objectOf.isRequired,
  location: PropTypes.objectOf.isRequired,
  breadcrumbs: PropTypes.objectOf.isRequired,
  height: PropTypes.string.isRequired,
};
export default compose(connect(mapStateToProps))(ViewData);

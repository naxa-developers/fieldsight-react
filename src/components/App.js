import React, { Component } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import setDefault from "../config";
import Settings from "./settings/Settings";
import MyForm from "./myForm/MyformMain";
import SiteDashboard from "./siteDashboard";
import SiteList from "./projectSiteList/SiteList";
import SubmissionDetails from "./submissionDetails";
import MyrolesMain from "./myRoles/MyrolesMain";
import RegionSite from "./regionalSite/RegionSite";
import SiteDocument from "./siteDocument/siteDocument";
import SiteUsers from "./userDocument";
import TeamUser from "./teamUsers/teamUsers";
import ProjectUser from "./projectUsers/projectUsers";
import ProjectList from "./projectList/projectList";
import ProjectDashboard from "./projectDashboard";
import ProjectLog from "./projectLogs/projectLogs";
import Teams from "./team";
import SiteLog from "./siteLogs";
import ProjectAdd from "./projectAdd";
import TeamAdd from "./teamAdd";
import SiteAdd from "./siteAdd";
import EditSite from "./SiteEdit";
import ViewData from "./viewDataComponents/projectViewData/index";
import SiteData from "./viewDataComponents/siteViewData";
import SiteSubmissionData from "./viewDataComponents/siteViewData/FormSubmission";
import VersionSubmissionData from "./viewDataComponents/projectViewData/VersionTable";
import VersionSiteSubmission from "./viewDataComponents/siteViewData/VersionTable";

import TeamDashboard from "./teamDashboard";
import TeamSetting from "./settings/TeamSettings";
import SubmissionData from "./viewDataComponents/projectViewData/SubmissionTable";

import ManageForms from "./manageForms";

import en from "../translations/en";
import np from "../translations/np";
import messages from "../translations/messages";

import store from "../store";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "cropperjs/dist/cropper.css";
import "../css/line-awesome.min.css";
import "../scss/style.scss";
import "../css/custom.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      region: false
    };
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    return (this.state.height = window.innerHeight - 181);
  };

  componentWillMount() {
    setDefault();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  render() {
    return (
      <Provider store={store}>
        <div id="fieldsight-new" className="fieldsight-new">
          <div id="main-container">
            <div className="container-fluid">
              <main id="main-content">
                <Router>
                  <Switch>
                    <Route
                      path="/project-settings"
                      render={props => <Settings {...props} />}
                    />
                    <Route
                      path="/team-settings/:id"
                      render={props => (
                        <TeamSetting {...props} height={this.state.height} />
                      )}
                    />
                    <Route
                      path="/forms"
                      render={props => <MyForm {...props} />}
                    />
                    <Route
                      path="/project-sitelist"
                      render={props => <SiteList {...props} />}
                    />

                    <Route
                      path="/submission-details"
                      render={props => <SubmissionDetails {...props} />}
                    />

                    <Route
                      path="/site-dashboard/:id"
                      render={props => <SiteDashboard {...props} />}
                    />

                    <Route
                      path="/my-roles"
                      render={props => <MyrolesMain {...props} />}
                    />

                    <Route
                      path="/profile/:profileId"
                      render={props => <MyrolesMain {...props} />}
                    />

                    <Route
                      path="/regional-site/:id"
                      render={props => <RegionSite {...props} />}
                    />
                    <Route
                      path="/site-documents/:id"
                      render={props => <SiteDocument {...props} />}
                    />

                    <Route
                      path="/project-dashboard/:id"
                      render={props => <ProjectDashboard {...props} />}
                    />
                    <Route
                      path="/team-dashboard/:id"
                      render={props => <TeamDashboard {...props} />}
                    />
                    <Route
                      path="/site-users/:id"
                      render={props => <SiteUsers {...props} />}
                    />

                    <Route
                      path="/project-users/:id"
                      render={props => <ProjectUser {...props} />}
                    />

                    <Route
                      path="/team-users/:id"
                      render={props => <TeamUser {...props} />}
                    />

                    <Route
                      path="/team-projects/:id"
                      render={props => <ProjectList {...props} />}
                    />
                    <Route
                      path="/teams"
                      render={props => <Teams {...props} />}
                    />
                    <Route
                      path="/project_logs/:id"
                      render={props => <ProjectLog {...props} />}
                    />
                    <Route
                      path="/site_logs/:id"
                      render={props => <SiteLog {...props} />}
                    />
                    <Route
                      path="/project/manage-forms/1/:id"
                      render={props => <ManageForms {...props} />}
                    />
                    <Route
                      path="/site/manage-forms/0/:id"
                      render={props => <ManageForms {...props} />}
                    />
                    <Route
                      path="/project-add/:id"
                      render={props => <ProjectAdd {...props} />}
                    />
                    <Route
                      path="/create-team"
                      render={props => <TeamAdd {...props} />}
                    />
                    <Route
                      path="/create-site/:id"
                      render={props => <SiteAdd {...props} page="CreateSite" />}
                    />
                    <Route
                      path="/regional-site-add/:id/:regionalId"
                      render={props => (
                        <SiteAdd {...props} page="regionalSite" />
                      )}
                    />
                    <Route
                      path="/sub-site-add/:id/:siteId"
                      render={props => <SiteAdd {...props} page="subSite" />}
                    />
                    <Route
                      path="/site-edit/:id"
                      render={props => <EditSite {...props} page="subSite" />}
                    />

                    <Route
                      path="/project-responses/:id"
                      render={props => <ViewData {...props} />}
                    />
                    <Route
                      path="/site-responses/:id"
                      render={props => <SiteData {...props} />}
                    />
                    <Route
                      path="/submission-data/:id/:fid"
                      render={props => <SubmissionData {...props} />}
                    />
                    <Route
                      path="/site-submission-data/:id/:fid"
                      render={props => <SiteSubmissionData {...props} />}
                    />
                    <Route
                      path="/site-version-submission/:id/:fid"
                      render={props => <VersionSiteSubmission {...props} />}
                    />
                    <Route
                      path="/project-version-submission/:id/:fid"
                      render={props => <VersionSubmissionData {...props} />}
                    />
                  </Switch>
                  <ToastContainer />
                </Router>
              </main>
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}
export default App;

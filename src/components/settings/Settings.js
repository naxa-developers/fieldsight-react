import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import LeftSidebar from '../leftSidebar/LeftSidebar';
import EditProject from '../editProject/EditProject';
import SiteType from '../siteType/SiteType';
import SiteInformation from '../siteInfo/SiteInformation';
import SiteManage from '../SiteManage';
import ManageRegion from '../manageRegion/ManageRegion';
import SubRegion from '../manageRegion/SubRegion';
import TermsAndLabels from '../termsAndLabels/TermAndLabel';
import MapLayer from '../mapLayer/MapLayer';
import { RegionProvider } from '../../context';
/* eslint-disable react/prop-types  */

export default class Settings extends PureComponent {
  render() {
    const {
      match: { path },
    } = this.props;

    return (
      <RegionProvider>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href={`/fieldsight/application/#/project-dashboard/${
                  window.project_id ? window.project_id : 1
                }/`}
              >
                {window.project_name
                  ? window.project_name
                  : 'Project Name'}
              </a>
            </li>

            <li
              className="breadcrumb-item active"
              aria-current="page"
            >
              <FormattedMessage
                id="app.projectSettings"
                defaultMessage="Project Settings"
              />
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <div className="left-sidebar new-sidebar sticky-top">
              <div className="card">
                <div className="card-header main-card-header">
                  <h5>
                    <FormattedMessage
                      id="app.projectSettings"
                      defaultMessage="Project Settings"
                    />
                  </h5>
                </div>
                <div className="card-body">
                  <LeftSidebar />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-8">
            <div className="right-content">
              <div className="tab-content">
                <Switch>
                  <Route
                    exact
                    path={`${path}`}
                    component={EditProject}
                  />
                  <Route
                    path={`${path}/site-type`}
                    component={SiteType}
                  />
                  <Route
                    path={`${path}/site-information`}
                    component={SiteInformation}
                  />
                  <Route
                    path={`${path}/manage-region/:subRegionId/sub-region`}
                    component={SubRegion}
                  />
                  <Route
                    path={`${path}/manage-region`}
                    component={ManageRegion}
                  />

                  <Route
                    path={`${path}/manage-site`}
                    component={SiteManage}
                  />
                  <Route
                    path={`${path}/map-layer`}
                    component={MapLayer}
                  />
                  <Route
                    path={`${path}/term-and-label`}
                    component={TermsAndLabels}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </RegionProvider>
    );
  }
}

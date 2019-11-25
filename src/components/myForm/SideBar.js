import React, { PureComponent } from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import MyFormContent from './MyFormContent';
import ProjectFormContent from './ProjectFormContent';
/* eslint-disable react/prop-types  */

// import MyformTable from '../components/MyForm/MyformTable';
// import UserSelectForm from '../components/MyForm/UserSelectForm';

class SideBar extends PureComponent {
  render() {
    const {
      match: { path, url },
      height,
      location: { pathname },
      OpenTabHandler,
      commonPopupHandler,
    } = this.props;

    return (
      <>
        <div className="col-xl-3 col-lg-4">
          <div className="left-sidebar new-sidebar sticky-top">
            <div
              className="card no-boxshadow"
              style={{ minHeight: height }}
            >
              <div className="card-header main-card-header sub-card-header">
                <h5>
                  <FormattedMessage
                    id="app.forms"
                    defaultMessage="Forms"
                  />
                </h5>
              </div>
              <div className="card-body">
                <ul
                  className="nav nav-tabs flex-column border-tabs"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <Link
                      to={`${url}/myform`}
                      className={
                        pathname === `${url}/myform`
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                    >
                      <FormattedMessage
                        id="app.my-forms"
                        defaultMessage="My Forms"
                      />
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={`${url}/projectform`}
                      className={
                        pathname === `${url}/projectform`
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                    >
                      <FormattedMessage
                        id="app.project-forms"
                        defaultMessage="Project Forms"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Switch>
          <Route
            exact
            path={`${path}/myform`}
            render={props => (
              <MyFormContent
                {...props}
                title="MyFormContent"
                OpenTabHandler={OpenTabHandler}
                commonPopupHandler={commonPopupHandler}
              />
            )}
          />

          <Route
            exact
            path={`${path}/projectform`}
            render={props => (
              <ProjectFormContent
                {...props}
                title="ProjectFormContent"
                OpenTabHandler={OpenTabHandler}
                commonPopupHandler={commonPopupHandler}
              />
            )}
          />
        </Switch>
      </>
    );
  }
}

export default withRouter(SideBar);

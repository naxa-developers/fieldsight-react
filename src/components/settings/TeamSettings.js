import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Axios from 'axios';
import { FormattedMessage } from 'react-intl';

import TeamLeftSidebar from '../leftSidebar/TeamLeftSieBar';
import EditTeam from '../editTeam/EditTeam';
import TeamMapLayer from '../mapLayer/TeamMapLayer';
import AccountInfoLayout from '../accountInfo/AccountInfoLayout';

const onmountUrls = [
  'fv3/api/team-owner-account',
  '/fv3/api/settings-breadcrumbs',
];

export default class TeamSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamData: {},
      breadcrumb: {},
    };
  }

  componentWillMount() {
    const {
      match: {
        params: { id: teamId },
      },
    } = this.props;
    Axios.all(
      onmountUrls.map((url, i) => {
        return i === 0
          ? Axios.get(`${url}/${teamId}/`)
          : Axios.get(`${url}/${teamId}/?type=team`);
      }),
    ).then(
      Axios.spread((team, breadcrumb) => {
        this.setState({
          teamData: team.data,
          breadcrumb: breadcrumb.data,
        });
      }),
    ).catch = () => {};
  }

  render() {
    const {
      match: {
        params: { id: teamId },
        path,
      },
      height,
    } = this.props;

    const { teamData, breadcrumb } = this.state;
    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item ">
              <a
                href={breadcrumb.name_url}
                style={{ color: '#00628E' }}
              >
                {breadcrumb.name}
              </a>
            </li>

            <li className="breadcrumb-item" aria-current="page">
              {breadcrumb.current_page}
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="  col-xl-3 col-lg-4">
            <div className="left-sidebar new-sidebar sticky-top">
              <div className="card">
                <div className="card-header main-card-header">
                  <h5>
                    <FormattedMessage
                      id="app.settings"
                      defaultMessage="Settings"
                    />
                  </h5>
                </div>
                <div className="card-body">
                  <TeamLeftSidebar
                    teamOwner={teamData.team_owner}
                    height={height}
                  />
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
                    component={EditTeam}
                  />
                  <Route
                    path={`${path}/map-layer`}
                    component={TeamMapLayer}
                  />

                  <Route
                    path={`${path}/subscription/team-settings`}
                    render={() => (
                      <AccountInfoLayout
                        data={teamData}
                        teamId={teamId}
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

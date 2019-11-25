import React, { Component } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import YourTeamSideBar from './YourTeamSidebar';
import ProfileTab from './ProfileTab';
import RegionTable from './RegionTable';
import Submissions from './Submissions';
import InviteTab from './InviteTab';
import SiteTable from './SiteTable';
import MapPage from './MapPage';
import { successToast } from '../../utils/toastHandler';
import withPagination from '../../hoc/WithPagination';
import Modal from '../common/Modal';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-unused-state  */
/* eslint-disable camelcase */

class MyrolesMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invite: null,
      rightTab: 'site',
      profile: [],
      invitation: [],
      roles: [],
      teams: [],
      initialTeamId: null,
      site: [],
      submission: [],
      regions: [],
      mapData: [],
      dLoader: true,
      siteLoader: true,
      RegionLoader: true,
      teamId: null,
      siteId: null,
      myGuide: false,
      searchQuery: '',
    };
  }

  componentWillMount() {
    const { props } = this;
    const { profileId } = props.match.params;
    const url = profileId
      ? `fv3/api/myroles/?profile=${profileId}`
      : `fv3/api/myroles/`;
    this._isMounted = true;
    axios
      .get(`${url}`)

      .then(res => {
        if (this._isMounted) {
          if (res.status === 200) {
            const modifiedTeam = res.data.teams.map((team, i) => {
              return i === 0
                ? { ...team, accord: true }
                : { ...team, accord: false };
            });

            if (res.data.teams.length > 0) {
              this.setState({
                initialTeamId: res.data.teams[0].projects[0].id,
              });
            }

            this.setState({
              profile: res.data.profile,
              invitation: res.data.invitations,
              roles: res.data.roles,
              teams: modifiedTeam,
              dLoader: false,
              RegionLoader: false,
              myGuide: res.data.profile.guide_popup,
            });
          }
        }
      })
      .catch(err => {});
  }

  invitationOpen = (e, data) => {
    const { invite } = this.state;
    if (invite === 'hide') {
      this.setState({
        invite: null,
      });
    } else {
      this.setState({
        invite: 'hide',
      });
    }
  };

  rightTabOpen = (e, data) => {
    this.setState({
      rightTab: data,
      searchQuery: '',
    });
  };

  rejectHandler = id => {
    const reject_url = `fv3/api/decline-invite/${id}/`;

    axios
      .post(`${reject_url}`)

      .then(res => {
        if (res.status === 200) {
          const newInvitation = [...this.state.invitation];
          const deletedForm = newInvitation.filter(
            user => user.id !== id,
          );

          this.setState({
            invitation: deletedForm,
          });
          successToast('Invite', 'Rejected');
        }
      })
      .catch(err => {});
  };

  acceptHandler = (id, user) => {
    const accept_url = `fv3/api/accept-invite/${id}/${user}/`;

    axios
      .post(`${accept_url}`)

      .then(res => {
        if (res.status === 200) {
          const newInvitation = [...this.state.invitation];
          const deletedForm = newInvitation.filter(
            each => each.id !== id,
          );

          this.setState({
            invitation: deletedForm,
          });

          successToast('Invite', 'Accepted');
        }
      })
      .catch(err => {});
  };

  acceptAll = () => {
    const accept_all_url = `fv3/api/accept-all-invites/
      ${this.state.profile.username}/`;

    axios
      .post(`${accept_all_url}`)

      .then(res => {
        if (res.status === 200) {
          this.setState({
            invitation: [],
          });

          successToast('All Invites', 'Accepted');
        }
      })
      .catch(err => {});
  };

  requestRegions = id => {
    const url = `fv3/api/my-regions/?project=${id}`;
    this.setState({
      teamId: id,
      RegionLoader: true,
    });
    axios
      .get(`${url}`)
      .then(res => {
        if (res.status === 200) {
          this.setState(
            {
              regions: res.data.regions,
              RegionLoader: false,
            },
            // () => {
            //   this.state, 'dfghjh';
            // },
          );
        }
      })
      .catch(err => {});
  };

  requestSite = id => {
    const { paginationHandler } = this.props;
    this.setState({
      siteLoader: true,
      siteId: id,
    });

    paginationHandler(1, null, {
      type: 'mySiteList',
      projectId: id,
    });
  };

  requestSubmission = id => {
    const submission_url = `fv3/api/submissions-map/?project=${id}&type=submissions`;
    this.setState({
      submissionLoader: true,
    });
    axios
      .get(`${submission_url}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            submission: res.data,
            submissionLoader: false,
          });
        }
      })
      .catch(err => {});
  };

  requestMap = id => {
    const submission_url = `fv3/api/submissions-map/?project=${id}&type=map`;

    axios
      .get(`${submission_url}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            mapData: res.data,
          });
        }
      })
      .catch(err => {});
  };

  cancelHandler = () => {
    this.setState({
      myGuide: false,
    });
  };

  onChangeHandler = e => {
    const searchValue = e.target.value;
    const { siteId } = this.state;
    this.setState({ searchQuery: searchValue }, () => {
      const {
        props: { searchHandler },
        state: { searchQuery },
      } = this;
      searchHandler(
        searchQuery,
        `fv3/api/my-sites/?project=${siteId}&q=${searchQuery}`,
        {
          type: 'mySiteList',
          projectId: siteId,
        },
      );
    });
  };

  render() {
    const {
      match: {
        params: { profileId },
      },
      siteList,
      renderPageNumbers,
      pageNum,
      paginationHandler,
      fromData,
      toData,
      totalCount,
    } = this.props;
    const {
      myGuide,
      dLoader,
      profile,
      teams,
      teamId,
      rightTab,
      submission,
      invitation,
      invite,
      submissionLoader,
      regions,
      RegionLoader,
      initialTeamId,
      siteId,
      mapData,
    } = this.state;

    return (
      <>
        <div className="card mrb-30">
          <ProfileTab
            dLoader={dLoader}
            profile={profile}
            profileId={profileId}
          />
        </div>

        <div className="row">
          <YourTeamSideBar
            dLoader={dLoader}
            teams={teams}
            teamId={teamId}
            requestRegions={this.requestRegions}
            requestSite={this.requestSite}
            requestSubmission={this.requestSubmission}
            requestMap={this.requestMap}
            regions={regions}
            addPermission={profile.can_create_team}
          />

          <div className="col-xl-8 col-lg-7">
            <div className="right-content">
              <div className="card no-boxshadow">
                {/* <div className="card-header main-card-header">
                </div> */}
                <div className="card-body">
                  <div className="nav-wrapper">
                    {/* <!-- tab nav start --> */}
                    <ul
                      className="nav nav-tabs "
                      id="myTab"
                      role="tablist"
                    >
                      <li className="nav-item">
                        <a
                          className={
                            rightTab === 'site'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          tabIndex="0"
                          role="button"
                          onKeyDown={e => {
                            this.rightTabOpen(e, 'site');
                          }}
                          onClick={e => {
                            this.rightTabOpen(e, 'site');
                          }}
                        >
                          <FormattedMessage
                            id="app.regions"
                            defaultMessage="Regions"
                          />
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            rightTab === 'region'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          tabIndex="0"
                          role="button"
                          onKeyDown={e => {
                            this.rightTabOpen(e, 'region');
                          }}
                          onClick={e => {
                            this.rightTabOpen(e, 'region');
                          }}
                        >
                          <FormattedMessage
                            id="app.sites"
                            defaultMessage="Sites"
                          />
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            rightTab === 'submission'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          tabIndex="0"
                          role="button"
                          onKeyDown={e => {
                            this.rightTabOpen(e, 'submission');
                          }}
                          onClick={e => {
                            this.rightTabOpen(e, 'submission');
                          }}
                        >
                          <FormattedMessage
                            id="app.submissions"
                            defaultMessage="Submissions"
                          />
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            rightTab === 'map'
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                          tabIndex="0"
                          role="button"
                          onKeyDown={e => {
                            this.rightTabOpen(e, 'map');
                          }}
                          onClick={e => {
                            this.rightTabOpen(e, 'map');
                          }}
                        >
                          <FormattedMessage
                            id="app.map"
                            defaultMessage="map"
                          />
                        </a>
                      </li>
                    </ul>

                    {rightTab === 'site' && (
                      // <div className="dash-btn">
                      <form
                        className="floating-form"
                        onSubmit={e => {
                          e.preventDefault();
                        }}
                      >
                        <div
                          className="form-group mr-0"
                          style={{
                            top: '-43px',
                            right: '-597px',
                            width: '22%',
                            display: 'flex',
                          }}
                        >
                          <input
                            type="search"
                            className="form-control"
                            onChange={this.onChangeHandler}
                            placeholder="Search"
                          />
                          <div style={{ marginTop: ' 0.6rem' }}>
                            <i className="la la-search" />
                          </div>
                          {/* <label htmlFor="input">Search</label> */}
                        </div>
                      </form>
                      // </div>
                    )}
                  </div>
                  <div
                    className="tab-content mrt-30"
                    id="myTabContent"
                  >
                    {rightTab === 'submission' && (
                      <Submissions
                        submission={submission}
                        submissionLoader={submissionLoader}
                      />
                    )}

                    {rightTab === 'region' && (
                      <RegionTable
                        // initialTeamId={initialTeamId}
                        // requestRegions={this.requestRegions}
                        // requestSite={this.requestSite}
                        // requestSubmission={this.requestSubmission}
                        // requestMap={this.requestMap}
                        regions={regions}
                        RegionLoader={RegionLoader}
                        profileId={profileId}
                      />
                    )}
                    {rightTab === 'site' && (
                      <SiteTable
                        initialTeamId={initialTeamId}
                        requestRegions={this.requestRegions}
                        requestSite={this.requestSite}
                        requestSubmission={this.requestSubmission}
                        requestMap={this.requestMap}
                        site={siteList}
                        siteLoader={dLoader}
                        renderPageNumbers={renderPageNumbers}
                        paginationHandler={paginationHandler}
                        siteId={siteId}
                        pageNum={pageNum}
                        fromData={fromData}
                        toData={toData}
                        totalCount={totalCount}
                        profileId={profileId}
                      />
                    )}

                    {rightTab === 'map' && (
                      <MapPage mapData={mapData} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {invitation.length !== 0 && (
          <div
            className={`invite-popup invite ${invite}`}
            style={{ zIndex: '1011' }}
          >
            <InviteTab
              invitationOpen={this.invitationOpen}
              invitation={invitation}
              acceptHandler={this.acceptHandler}
              rejectHandler={this.rejectHandler}
              acceptAll={this.acceptAll}
            />
          </div>
        )}
        {myGuide && (
          <Modal
            title="Welcome to FieldSight"
            toggleModal={this.cancelHandler}
          >
            <div className="guide">
              <p>
                <FormattedMessage id="app.hi" defaultMessage="Hi," />
                &nbsp;
                <span style={{ textTransform: 'capitalize' }}>
                  {this.state.profile.fullname}
                </span>
                <FormattedMessage
                  id="app.noRole"
                  defaultMessage="seems like you have no role yet."
                />
                &nbsp;
                <FormattedMessage
                  id="app.noRole2"
                  defaultMessage="You can get started by
                            creating a team in FieldSight or contact your FieldSight manager
                            to invite you to join projects."
                />
              </p>
            </div>
            <div className="warning-footer text-center">
              <a
                href="/fieldsight/application/#/create-team/"
                className="fieldsight-btn"
                style={{
                  marginRight: '10px',
                  display: 'inline-block',
                }}
              >
                <FormattedMessage
                  id="app.createTeam"
                  defaultMessage="Create Team"
                />
              </a>
              <a
                tabIndex="0"
                role="button"
                onKeyDown={this.cancelHandler}
                className="fieldsight-btn rejected-btn"
                onClick={this.cancelHandler}
              >
                <FormattedMessage
                  id="app.cancel"
                  defaultMessage="Cancel"
                />
              </a>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

export default withPagination(MyrolesMain);

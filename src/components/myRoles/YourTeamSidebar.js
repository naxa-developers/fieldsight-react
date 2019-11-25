import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { BlockContentLoader } from '../common/Loader';
/* eslint-disable react/prop-types  */

// const url = 'fv3/api/myroles';
// let base_url = window.base_url
//   ? window.base_url
//   : 'https://fieldsight.naxa.com.np/';

class YourTeamSideBar extends Component {
  OpenTabHandler = url => {
    window.open(url, '_blank');
  };

  render() {
    const {
      addPermission,
      dLoader,
      teams,
      teamId,
      requestRegions,
      requestSite,
      requestSubmission,
      requestMap,
    } = this.props;
    return (
      <div className="col-xl-4 col-lg-5">
        <div className="left-sidebar new-sidebar sticky-top">
          <div className="card">
            <div className="card-header main-card-header">
              <h5>
                <FormattedMessage
                  id="app.your-teams"
                  defaultMessage="Your Teams"
                />
              </h5>
              {addPermission && (
                <div className="add-btn">
                  <a
                    href="/fieldsight/application/#/create-team/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FormattedMessage
                      id="app.addTeam"
                      defaultMessage="Add team"
                    />

                    <span>
                      <i className="la la-plus" />
                    </span>
                  </a>
                </div>
              )}
            </div>

            {dLoader && (
              <BlockContentLoader number={5} height="140px" />
            )}

            {!dLoader && (
              <div
                style={{
                  position: 'relative',
                  height: '600px',
                }}
              >
                <PerfectScrollbar>
                  <Accordion
                    defaultActiveKey="0"
                    className="sidebar-accordion"
                    id="accordion"
                  >
                    {teams.map((team, i) => (
                      <Card className="no-boxshadow" key={team.id}>
                        <Card.Header>
                          <figure>
                            <img src={team.logo} alt="pf" />
                          </figure>
                          <h5>
                            <Accordion.Toggle
                              as={Button}
                              variant="link"
                              eventKey={i.toString()}
                            >
                              {team.name}
                              {team.has_organization_access && (
                                <span
                                  tabIndex="0"
                                  role="button"
                                  onKeyDown={() => {
                                    this.OpenTabHandler(
                                      team.team_url,
                                    );
                                  }}
                                  onClick={() => {
                                    this.OpenTabHandler(
                                      team.team_url,
                                    );
                                  }}
                                  className="goto"
                                >
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip>
                                        Go to dashboard
                                      </Tooltip>
                                    }
                                  >
                                    <i className="la la-external-link" />
                                  </OverlayTrigger>
                                </span>
                              )}
                              <p>{team.address}</p>
                            </Accordion.Toggle>
                          </h5>
                        </Card.Header>

                        <Accordion.Collapse eventKey={i.toString()}>
                          <Card.Body>
                            <ul style={{ position: 'relative' }}>
                              {team.projects.map(project => (
                                <li
                                  className={
                                    project.id === teamId
                                      ? 'active'
                                      : null
                                  }
                                  key={project.id}
                                >
                                  <a
                                    tabIndex="0"
                                    role="button"
                                    onKeyDown={() => {
                                      requestRegions(project.id);
                                      requestSite(project.id);
                                      requestSubmission(project.id);
                                      requestMap(project.id);
                                    }}
                                    onClick={() => {
                                      requestRegions(project.id);
                                      requestSite(project.id);
                                      requestSubmission(project.id);
                                      requestMap(project.id);
                                    }}
                                  >
                                    {project.name}
                                  </a>
                                  {project.has_project_access && (
                                    <a
                                      className="project-link"
                                      href={project.project_url}
                                    >
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>
                                            Go to dashboard
                                          </Tooltip>
                                        }
                                      >
                                        <i className="la la-external-link" />
                                      </OverlayTrigger>
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    ))}
                  </Accordion>
                </PerfectScrollbar>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default YourTeamSideBar;

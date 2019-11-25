import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Table from 'react-bootstrap/Table';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TableContentLoader } from '../common/Loader';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-array-index-key  */

// let base_url = window.base_url
//   ? window.base_url
//   : 'https://fieldsight.naxa.com.np';

class SiteTable extends Component {
  componentDidUpdate(prevProps) {
    const { props } = this;
    if (prevProps.initialTeamId !== props.initialTeamId) {
      props.requestSite(props.initialTeamId);
      props.requestRegions(props.initialTeamId);
      props.requestSubmission(props.initialTeamId);
      props.requestMap(props.initialTeamId);
    }
  }

  render() {
    const {
      siteLoader,
      site,
      profileId,
      fromData,
      toData,
      totalCount,
      pageNum,
      paginationHandler,
      siteId,
      renderPageNumbers,
    } = this.props;
    return (
      <>
        <div
          className="table-wrapper"
          role="tabpanel"
          aria-labelledby="region_tab"
          style={{ position: 'relative', height: '650px' }}
        >
          {siteLoader && <TableContentLoader row={18} column={5} />}

          {!siteLoader && (
            <div>
              <ul style={{ position: 'relative', height: '650px' }}>
                {site.length === 0 && (
                  <p>
                    <FormattedMessage
                      id="app.noSites"
                      defaultMessage="You do not have any sites."
                    />
                  </p>
                )}
                <PerfectScrollbar>
                  {site.length > 0 && (
                    <Table
                      responsive="xl"
                      className="table  table-bordered  dataTable "
                    >
                      <thead>
                        <tr>
                          <th>
                            <FormattedMessage
                              id="app.site-name"
                              defaultMessage="Site Name"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.id"
                              defaultMessage="id"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.role"
                              defaultMessage="Role"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.region"
                              defaultMessage="Region"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.type"
                              defaultMessage="Type"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.progress"
                              defaultMessage="Progress"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.submissions"
                              defaultMessage="Submissions"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.latest-status"
                              defaultMessage="Latest status"
                            />
                          </th>
                          {this.props.profileId && (
                            <th>
                              <FormattedMessage
                                id="app.action"
                                defaultMessage="Action"
                              />
                            </th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {/*this.props.site.length === 0 && (
                    <tr>
                      <td>
                        <p>No Form Data Available</p>
                      </td>
                    </tr>
                  )*/}

                        {this.props.site.map((item, i) => (
                          <tr key={i}>
                            <td>
                              <a
                                href={
                                  '/fieldsight/application/#/site-dashboard/' +
                                  item.id
                                }
                                className="pending table-profile"
                              >
                                <h5>{item.name}</h5>
                              </a>
                            </td>
                            <td>{item.identifier}</td>

                            <td>
                              {item.role !== null
                                ? item.role
                                : 'Manager'}
                            </td>
                            <td>
                              <a href="#" className="pending">
                                {item.region}
                              </a>
                            </td>
                            <td>{item.type}</td>
                            <td>
                              <div className="progress">
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  aria-valuenow="40"
                                  aria-valuemin="0"
                                  aria-valuemax="200"
                                  style={{
                                    width: `${item.progress}%`,
                                  }}
                                >
                                  <span className="progress-count">
                                    {`${item.progress} %`}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>{item.submissions}</td>
                            <td>
                              <a
                                className={
                                  item.status !== null
                                    ? item.status.toLowerCase()
                                    : null
                                }
                              >
                                {item.status !== null
                                  ? item.status
                                  : 'No Submission Yet'}
                              </a>
                            </td>
                            {profileId && (
                              <td>
                                <a className="td-delete-btn td-btn">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip>Delete</Tooltip>
                                    }
                                  >
                                    <i className="la la-trash-o" />
                                  </OverlayTrigger>
                                </a>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </PerfectScrollbar>
              </ul>
            </div>
          )}
        </div>
        {site.length > 0 && (
          <div className="table-footer">
            <div className="showing-rows">
              <p>
                Showing
                <span>{fromData}</span>
                to
                <span>
                  {toData > totalCount ? totalCount : toData}
                </span>
                of
                <span>{totalCount}</span>
                entries.
              </p>
            </div>
            {fromData < totalCount ? (
              <div className="table-pagination">
                <ul>
                  <li
                    className={` page-item ${
                      pageNum === 1 ? 'disable-btn' : ''
                    }`}
                  >
                    <a
                      tabIndex="0"
                      role="button"
                      onKeyDown={() => {
                        paginationHandler(pageNum - 1, null, {
                          type: 'mySiteList',
                          projectId: siteId,
                        });
                      }}
                      onClick={() => {
                        paginationHandler(pageNum - 1, null, {
                          type: 'mySiteList',
                          projectId: siteId,
                        });
                      }}
                    >
                      <i className="la la-long-arrow-left " />
                    </a>
                  </li>

                  {renderPageNumbers({
                    type: 'mySiteList',
                    projectId: siteId,
                  })}

                  <li
                    className={`page-item  ${
                      pageNum === Math.ceil(totalCount / 200)
                        ? ' disable-btn'
                        : ''
                    }`}
                  >
                    <a
                      tabIndex="0"
                      role="button"
                      onKeyDown={() => {
                        paginationHandler(pageNum + 1, null, {
                          type: 'mySiteList',
                          projectId: siteId,
                        });
                      }}
                      onClick={() => {
                        paginationHandler(pageNum + 1, null, {
                          type: 'mySiteList',
                          projectId: siteId,
                        });
                      }}
                    >
                      <i className="la la-long-arrow-right" />
                    </a>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </>
    );
  }
}

export default SiteTable;

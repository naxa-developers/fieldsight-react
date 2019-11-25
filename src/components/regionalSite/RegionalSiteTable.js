import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { TableContentLoader } from '../common/Loader';
import withPagination from '../../hoc/WithPagination';
import isEmpty from '../../utils/isEmpty';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/label-has-associated-control  */
/* eslint-disable react/no-array-index-key  */

// let base_url = window.base_url
//   ? window.base_url
//   : "https://fieldsight.naxa.com.np";

class RegionalSiteTable extends Component {
  componentDidMount() {
    this.props.paginationHandler(1, null, {
      type: 'regionSite',
      projectId: this.props.regionId,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.regionId !== this.props.regionId) {
      this.props.paginationHandler(1, null, {
        type: 'regionSite',
        projectId: this.props.regionId,
      });
    }
  }

  onChangeHandler = e => {
    const searchValue = e.target.value;
    this.props.searchHandler(
      searchValue,
      `fv3/api/regional-sites/?page=1&region=${this.props.regionId}&q=${searchValue}`,
      {
        type: 'regionSite',
        projectId: this.props.regionId,
      },
    );
  };

  render() {
    const {
      OpenTabHandler,
      projectId,
      regionId,
      terms,
      dLoader,
      siteList,
      fromData,
      toData,
      totalCount,
      pageNum,
      paginationHandler,
      renderPageNumbers,
    } = this.props;

    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          <h5>Sites</h5>
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
                  onChange={this.onChangeHandler}
                />
                <label htmlFor="input">Search</label>
                <i className="la la-search" />
              </div>
            </form>
            <button
              type="button"
              className="fieldsight-btn"
              onClick={e => {
                OpenTabHandler(
                  e,
                  `/fieldsight/application/#/regional-site-add/
                    ${projectId}/${regionId}/`,
                );
              }}
            >
              <i className="la la-plus" />
            </button>
          </div>
        </div>
        <div className="card-body">
          <div style={{ position: 'relative', height: '800px' }}>
            <PerfectScrollbar>
              <Table
                responsive="xl"
                className="table  table-bordered  dataTable "
              >
                <thead>
                  <tr>
                    <th>
                      {!isEmpty(this.props.terms) ? (
                        `${this.props.terms.site} name`
                      ) : (
                        <FormattedMessage
                          id="app.site-name"
                          defaultMessage="Site name"
                        />
                      )}
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.identifier"
                        defaultMessage="Identifier"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.address"
                        defaultMessage="Address"
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
                  </tr>
                </thead>

                <tbody>
                  {!dLoader &&
                    siteList.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <a
                            href={`/fieldsight/application/#/site-dashboard/
                              ${item.id}`}
                            className="pending table-profile"
                          >
                            <figure>
                              <img src={item.logo} alt="site-logo" />
                            </figure>
                            <h5>{item.name}</h5>
                          </a>
                        </td>
                        <td>{item.identifier}</td>

                        <td>{item.address}</td>
                        <td>
                          <a href="#" className="pending">
                            {item.type}
                          </a>
                        </td>
                        <td>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              aria-valuenow="40"
                              aria-valuemin="0"
                              aria-valuemax="200"
                              style={{ width: `${item.progress} %` }}
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
                      </tr>
                    ))}
                </tbody>
              </Table>
              {dLoader && <TableContentLoader column={7} row={20} />}
            </PerfectScrollbar>
          </div>
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

            {toData < totalCount ? (
              <div className="table-pagination">
                <ul>
                  <li className="page-item">
                    <a
                      tabIndex="0"
                      role="button"
                      onKeyDown={() => {
                        paginationHandler(pageNum - 1, null, {
                          projectId: regionId,
                        });
                      }}
                      onClick={() => {
                        paginationHandler(pageNum - 1, null, {
                          projectId: regionId,
                        });
                      }}
                    >
                      <i className="la la-long-arrow-left" />
                    </a>
                  </li>

                  {renderPageNumbers({
                    type: 'regionSite',
                    projectId: regionId,
                  })}

                  <li className="page-item ">
                    <a
                      tabIndex="0"
                      role="button"
                      onKeyDown={() => {
                        paginationHandler(pageNum + 1, null, {
                          projectId: regionId,
                        });
                      }}
                      onClick={() => {
                        paginationHandler(pageNum + 1, null, {
                          projectId: regionId,
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
        </div>
      </>
    );
  }
}
export default withPagination(RegionalSiteTable);

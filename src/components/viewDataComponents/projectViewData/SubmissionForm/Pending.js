import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import StatusTable from '../../responded/StatusTable';
import WithPagination from '../../../../hoc/WithPagination';
import { DotLoader } from '../../../myForm/Loader';
/* eslint-disable react/destructuring-assignment */

/* eslint-disable react/prop-types */

class PendingTable extends Component {
  componentDidMount() {
    const { id, paginationHandler } = this.props;
    if (id) {
      paginationHandler(1, null, {
        type: 'viewByStatus',
        projectId: id,
        status: 'pending',
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.breadcrumbs !== this.props.breadcrumbs) {
      this.props.handleBreadCrumb(this.props.breadcrumbs);
    }
  }

  render() {
    const {
      props: {
        dLoader,
        siteList,
        id,
        fromData,
        toData,
        totalCount,
        pageNum,
        paginationHandler,
        renderPageNumbers,
      },
    } = this;

    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          <h5>
            <FormattedMessage
              id="app.pending-submissions"
              defaultMessage="Pending Submissions"
            />
          </h5>
          <div className="dash-btn">
            <Link to={`/project-responses/${id}/general`}>
              <button type="button" className="fieldsight-btn">
                <FormattedMessage
                  id="app.view-by-status"
                  defaultMessage="View By Status"
                />
              </button>
            </Link>
          </div>
        </div>
        {dLoader === false ? (
          <>
            <div className="card-body">
              <StatusTable
                submission={siteList}
                // count={count}
                // next={next}
                // previous={previous}
                projectId={id}
              />
            </div>

            {siteList && siteList.length > 0 ? (
              <div className="card-body">
                <div className="table-footer">
                  <div className="showing-rows">
                    <p>
                      <FormattedMessage
                        id="app.showing"
                        defaultMessage="Showing"
                      />
                      <span>{fromData}</span>
                      <FormattedMessage
                        id="app.to"
                        defaultMessage="to"
                      />
                      <span>
                        {toData > totalCount ? totalCount : toData}
                      </span>
                      <FormattedMessage
                        id="app.of"
                        defaultMessage="of"
                      />
                      <span>{totalCount}</span>
                      <FormattedMessage
                        id="app.entries"
                        defaultMessage="entries"
                      />
                      .
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
                                type: 'viewByStatus',
                                projectId: id,
                                status: 'pending',
                              });
                            }}
                            onClick={() => {
                              paginationHandler(pageNum - 1, null, {
                                type: 'viewByStatus',
                                projectId: id,
                                status: 'pending',
                              });
                            }}
                          >
                            <i className="la la-long-arrow-left" />
                          </a>
                        </li>

                        {renderPageNumbers({
                          type: 'viewByStatus',
                          projectId: id,
                          status: 'pending',
                        })}

                        <li className="page-item ">
                          <a
                            tabIndex="0"
                            role="button"
                            onKeyDown={() => {
                              paginationHandler(pageNum + 1, null, {
                                type: 'viewByStatus',
                                projectId: id,
                                status: 'pending',
                              });
                            }}
                            onClick={() => {
                              paginationHandler(pageNum + 1, null, {
                                type: 'viewByStatus',
                                projectId: id,
                                status: 'pending',
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
            ) : (
              <div className="card-body">
                <div className="table-footer">
                  <div className="showing-rows">
                    <p>
                      <FormattedMessage
                        id="app.sorryNoData"
                        defaultMessage="Sorry No Data"
                      />
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <DotLoader />
        )}
      </>
    );
  }
}

export default WithPagination(PendingTable);

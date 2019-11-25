import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import StatusTable from '../../responded/StatusTable';
import WithPagination from '../../../../hoc/WithPagination';
import { DotLoader } from '../../../myForm/Loader';

class ApprovedTable extends Component {
  componentDidMount() {
    if (this.props.id !== '') {
      this.props.paginationHandler(1, null, {
        type: 'viewByStatus',
        projectId: this.props.id,
        status: 'approved',
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
      props: { data, showViewData, dLoader, id },
    } = this;

    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          <h5>
            {/*Approved Submissions*/}
            <FormattedMessage
              id="app.approved-submissions"
              defaultMessage="Approved Submissions"
            />
          </h5>
          <div className="dash-btn">
            <button
              type="button"
              onClick={showViewData}
              className="fieldsight-btn"
            >
              {data ? (
                <FormattedMessage
                  id="app.view-by-form"
                  defaultMessage="View By Form"
                />
              ) : (
                <FormattedMessage
                  id="app.view-by-status"
                  defaultMessage="View By Status"
                />
              )}
            </button>
          </div>
        </div>
        {dLoader === false ? (
          <>
            <div className="card-body">
              <StatusTable submission={this.props.siteList} />
            </div>
            {this.props.siteList && this.props.siteList.length > 0 ? (
              <div className="card-body">
                <div className="table-footer">
                  <div className="showing-rows">
                    <p>
                      Showing
                      <span>{this.props.fromData}</span>
                      to
                      <span>
                        {this.props.toData > this.props.totalCount
                          ? this.props.totalCount
                          : this.props.toData}
                      </span>
                      of
                      <span>{this.props.totalCount}</span>
                      entries.
                    </p>
                  </div>
                  {this.props.toData < this.props.totalCount ? (
                    <div className="table-pagination">
                      <ul>
                        <li className="page-item">
                          <a
                            href="#"
                            onClick={() => {
                              this.props.paginationHandler(
                                this.props.pageNum - 1,
                                null,
                                { projectId: id },
                              );
                            }}
                          >
                            <i className="la la-long-arrow-left" />
                          </a>
                        </li>

                        {this.props.renderPageNumbers({
                          type: 'viewByStatus',
                          projectId: id,
                          status: 'flagged',
                        })}

                        <li className="page-item ">
                          <a
                            href="#"
                            onClick={() => {
                              this.props.paginationHandler(
                                this.props.pageNum + 1,
                                null,
                                { projectId: id },
                              );
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
                    <p>Sorry No Data</p>
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
ApprovedTable.propTypes = {
  id: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.objectOf.isRequired,
  showViewData: PropTypes.func.isRequired,
  siteList: PropTypes.arrayOf.isRequired,
  fromData: PropTypes.number.isRequired,
  toData: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageNum: PropTypes.number.isRequired,
  renderPageNumbers: PropTypes.func.isRequired,
  dLoader: PropTypes.bool.isRequired,
  paginationHandler: PropTypes.func.isRequired,
  data: PropTypes.objectOf.isRequired,
  handleBreadCrumb: PropTypes.func.isRequired,
};
export default WithPagination(ApprovedTable);

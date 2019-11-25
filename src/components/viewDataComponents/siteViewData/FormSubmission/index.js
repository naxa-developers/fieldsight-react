import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import PropTypes from 'prop-types';
import WithPagination from '../../../../hoc/WithPagination';
import Modal from '../../../common/Modal';
import { DotLoader } from '../../../myForm/Loader';

class SubmissionData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fid: props.match.params && props.match.params.fid,
      id: props.match.params && props.match.params.id,
      showConfirmation: false,
      siteList: [],
      mastersiteList: [],
      breadcrumbs: {},
      dLoader: true,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id, fid },
      },
      paginationHandler,
      siteList,
    } = this.props;

    paginationHandler(1, null, {
      type: 'siteSubmission',
      projectId: id,
      fsxf_id: fid,
      status: 'form-submission',
    });

    this.setState({
      fid,
      siteList,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteList !== this.props.siteList) {
      this.setState({
        siteList: nextProps.siteList,
        mastersiteList: nextProps.siteList,
        breadcrumbs: nextProps.breadcrumbs,
        dLoader: nextProps.dLoader,
      });
    }
  }

  cancleModel = () => {
    this.setState({
      showConfirmation: false,
    });
  };

  handleDelete = id => {
    this.setState({
      showConfirmation: true,
      id,
    });
  };

  delete = id => {
    let list = this.state.siteList;

    axios
      .get(`/fv3/api/delete-submission/${id}/`)
      .then(res => {
        if (res.status === 204) {
          this.setState(state => {
            const result = list.filter(
              data => data.submission_id !== id,
            );
            // (data => {
            //   if (id !== data.submission_id) {
            //     return data;
            //   }
            // });
            list = result;

            return {
              id: '',
              showConfirmation: false,
              siteList: list,
            };
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = async e => {
    const {
      target: { value },
    } = e;
    const { siteList, mastersiteList } = this.state;

    if (value) {
      const search = siteList.filter(result => {
        return result.submitted_by
          .toLowerCase()
          .includes(value.toLowerCase());
      });
      this.setState({
        siteList: search,
      });
    } else {
      this.setState({
        siteList: mastersiteList,
      });
    }
  };

  render() {
    const {
      breadcrumbs,
      dLoader,
      siteList,
      showConfirmation,
      id,
    } = this.state;
    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href={breadcrumbs.site_url}>
                {breadcrumbs.site_name}
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href={breadcrumbs.responses_url}>
                {breadcrumbs.responses}
              </a>
            </li>
            <li className="breadcrumb-item">
              {breadcrumbs.current_page}
            </li>
          </ol>
        </nav>
        <div className="card">
          <div className="card-header main-card-header sub-card-header">
            {/*<h5>Site Submissions</h5>*/}
            <h5>
              <FormattedMessage
                id="app.site-submissions"
                defaultMessage="Site Submissions"
              />
            </h5>
            <div className="dash-btn">
              <form className="floating-form">
                <div className="form-group mr-0">
                  <label htmlFor="search">
                    Search
                    <input
                      id="search"
                      type="search"
                      className="form-control"
                      onChange={e => this.handleChange(e)}
                      required
                    />
                  </label>
                  <i className="la la-search" />
                </div>
              </form>
            </div>
          </div>

          {dLoader === false ? (
            <div className="card-body">
              <Table
                responsive="xl"
                className="table  table-bordered  dataTable "
              >
                <thead>
                  <tr>
                    {/*<th>S.N.</th>*/}
                    <th>
                      <FormattedMessage
                        id="app.submission-id"
                        defaultMessage="submission id"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.submission-by"
                        defaultMessage="Submission By"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.submission-date"
                        defaultMessage="Submission Date"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.action"
                        defaultMessage="Action"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {siteList.length > 0 &&
                    siteList.map(list => {
                      return (
                        <tr key={list.id}>
                          <td>{list.submission_id}</td>
                          <td>
                            <a href={list.profile_url}>
                              {list.submitted_by}
                            </a>
                          </td>
                          <td>{list.date}</td>

                          <td>
                            <a
                              className="view-tag tag"
                              href={`/fieldsight/application/?submission=${list.submission_id}#/submission-details`}
                            >
                              <i className="la la-eye" />
                            </a>
                            <a
                              className="edit-tag tag"
                              href={`/forms/edit/${this.props.form_id_string}/${list.submission_id}`}
                            >
                              <i className="la la-edit" />
                            </a>

                            <a
                              href="#"
                              className="delete-tag tag"
                              onClick={() => {
                                this.handleDelete(list.submission_id);
                              }}
                            >
                              <i className="la la-trash-o" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              {this.props.siteList &&
              this.props.siteList.length > 0 ? (
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
                                  {
                                    type: 'formSubmission',
                                    projectId: this.state.id,
                                    fsxf_id: this.state.fid,
                                    status: 'form-submission',
                                  },
                                );
                              }}
                            >
                              <i className="la la-long-arrow-left" />
                            </a>
                          </li>

                          {this.props.renderPageNumbers({
                            type: 'formSubmission',
                            projectId: this.state.id,
                            fsxf_id: this.state.fid,
                            status: 'form-submission',
                          })}

                          <li className="page-item ">
                            <a
                              href="#"
                              onClick={() => {
                                this.props.paginationHandler(
                                  this.props.pageNum + 1,
                                  null,
                                  {
                                    type: 'formSubmission',
                                    projectId: this.state.id,
                                    fsxf_id: this.state.fid,
                                    status: 'form-submission',
                                  },
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
            </div>
          ) : (
            <DotLoader />
          )}
        </div>
        {showConfirmation && (
          <Modal
            title={`Are you sure you want to delete this submission ${id}?`}
            toggleModal={this.cancleModel}
          >
            <div className="warning">
              <h5>Warning</h5>
            </div>
            <div>
              <p>
                &quot;All the data within the submission will be
                completely removed. Do you still want to
                continue?&quot;
              </p>
            </div>
            <div className="warning-footer text-center">
              <a
                href="#"
                className="fieldsight-btn rejected-btn"
                onClick={() => {
                  this.setState({ showConfirmation: false });
                }}
              >
                cancel
              </a>
              <a
                href="#"
                className="fieldsight-btn"
                onClick={() => this.delete(id)}
              >
                confirm
              </a>
            </div>
          </Modal>
        )}
      </>
    );
  }
}
SubmissionData.propTypes = {
  id: PropTypes.string.isRequired,
  paginationHandler: PropTypes.func.isRequired,
  breadcrumbs: PropTypes.objectOf.isRequired,
  form_id_string: PropTypes.string.isRequired,
  dLoader: PropTypes.bool.isRequired,
  siteList: PropTypes.arrayOf.isRequired,
  fromData: PropTypes.number.isRequired,
  toData: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageNum: PropTypes.number.isRequired,
  renderPageNumbers: PropTypes.func.isRequired,
  match: PropTypes.objectOf.isRequired,
};
export default WithPagination(SubmissionData);

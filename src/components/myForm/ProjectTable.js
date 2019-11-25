import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PreviewModal from './PreviewModal';
import { DotLoader } from './Loader';
import { successToast } from './toastHandler';
/* eslint-disable react/prop-types  */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key  */
/* eslint-disable react/no-unused-state */

const url = 'fv3/api/myprojectforms/';

class ProjecTable extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      project_list: [],
      list: [],
      dLoader: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(`${url}`)

      .then(res => {
        if (this._isMounted) {
          if (res.status === 200) {
            this.setState({
              project_list: res.data,
              dLoader: false,
            });
          }
        }
      })
      .catch(err => {
        this.setState({
          dLoader: false,
        });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  cloneHandler = (e, clone_url, id, form_id) => {
    axios
      .post(clone_url, { id_string: id, project: form_id })
      .then(res => {
        successToast('Form', 'cloned');
      })
      .catch(err => console.log('err', err));
  };

  render() {
    const {
      state: { project_list, dLoader },
      props: { commonPopupHandler, OpenTabHandler },
    } = this;
    return (
      <>
        {project_list.length === 0 && !dLoader && (
          <div className="card-header main-card-header sub-card-header bg-header">
            <h5>
              <FormattedMessage
                id="app.noFormDataAvailable"
                defaultMessage="No Form Data Available"
              />
            </h5>
          </div>
        )}
        {project_list.map((item, i) => (
          <div key={i}>
            <div className="card-header main-card-header sub-card-header bg-header">
              <h5>{item.name}</h5>
            </div>
            <div
              className="card-body"
              style={{ position: 'relative', height: '300px' }}
            >
              <PerfectScrollbar>
                <table
                  id="project_form_table"
                  className="table-bordered table project_form dataTable"
                >
                  <thead>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="app.sn"
                          defaultMessage="S.N"
                        />{' '}
                      </th>
                      <th>
                        {' '}
                        <FormattedMessage
                          id="app.form-name"
                          defaultMessage="Form Name"
                        />
                      </th>
                      <th>
                        {' '}
                        <FormattedMessage
                          id="app.create-date"
                          defaultMessage="Create Date"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.updatedDate"
                          defaultMessage="Updated date"
                        />
                      </th>
                      <th>
                        {' '}
                        <FormattedMessage
                          id="app.action"
                          defaultMessage="Action"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.forms.map((items, key) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td style={{ width: '30%' }}>
                          {items.title}
                        </td>
                        <td>
                          <i className="fa fa-clock-o" />
                          <span>{items.date_created}</span>
                        </td>
                        <td>
                          <i className="fa fa-clock-o" />
                          <span>{items.date_modified}</span>
                        </td>
                        <td>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">
                                <FormattedMessage
                                  id="app.preview"
                                  defaultMessage="Preview"
                                />
                              </Tooltip>
                            }
                          >
                            <a
                              onClick={e => {
                                commonPopupHandler(
                                  e,
                                  PreviewModal,
                                  items.preview_url,
                                  'Preview Form',
                                  'preview',
                                  null,
                                );
                              }}
                              className="td-view-btn td-btn"
                              tabIndex="0"
                              role="button"
                              onKeyDown={e => {
                                commonPopupHandler(
                                  e,
                                  PreviewModal,
                                  items.preview_url,
                                  'Preview Form',
                                  'preview',
                                  null,
                                );
                              }}
                            >
                              <i className="la la-eye" />
                            </a>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">
                                <FormattedMessage
                                  id="app.edit"
                                  defaultMessage="Edit"
                                />
                              </Tooltip>
                            }
                          >
                            <a
                              onClick={e => {
                                OpenTabHandler(e, items.edit_url);
                              }}
                              className="td-edit-btn td-btn"
                              tabIndex="0"
                              role="button"
                              onKeyDown={e => {
                                OpenTabHandler(e, items.edit_url);
                              }}
                            >
                              <i className="la la-edit" />
                            </a>
                          </OverlayTrigger>
                          {/* <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">Replace</Tooltip>
                            }
                          >
                            <a
                              className="td-edit-btn td-btn"
                            >
                              {" "}
                              <i className="la la-refresh"> </i>{" "}
                            </a>
                          </OverlayTrigger> */}
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">
                                <FormattedMessage
                                  id="app.download"
                                  defaultMessage="download"
                                />
                              </Tooltip>
                            }
                          >
                            <a className="td-edit-btn td-btn">
                              <i className="la la-download" />
                            </a>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">
                                <FormattedMessage
                                  id="app.makeAcopy"
                                  defaultMessage="Make a copy"
                                />
                              </Tooltip>
                            }
                          >
                            <a
                              onClick={e => {
                                this.cloneHandler(
                                  e,
                                  items.clone_form_url,
                                  items.id_string,
                                  item.id,
                                );
                              }}
                              className="td-edit-btn td-btn"
                              tabIndex="0"
                              role="button"
                              onKeyDown={e => {
                                this.cloneHandler(
                                  e,
                                  items.clone_form_url,
                                  items.id_string,
                                  item.id,
                                );
                              }}
                            >
                              <i className="la la-clone" />
                            </a>
                          </OverlayTrigger>
                          {/* <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">Delete!</Tooltip>
                            }
                          >
                            <a className="td-delete-btn td-btn">
                              {" "}
                              <i className="la la-trash" />{" "}
                            </a>
                          </OverlayTrigger> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
          </div>
        ))}
        {dLoader && <DotLoader />}
      </>
    );
  }
}

export default ProjecTable;

import React, { Component } from 'react';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import SiteDocumentTable from './siteDocumentTable';
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control  */

export default class SiteDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmation: false,
      site_document: [],
      breadcrumb: [],
      files: [],
      document_name: '',
      document_type: 'Document Type',
      deleteConfirmation: false,
      id: '',
      show_button: '',
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    axios
      .get(`fv3/api/site/documents/?site_id=${id}`)
      .then(res => {
        this.setState({
          site_document: res.data.documents,
          breadcrumb: res.data.breadcrumbs,
          show_button: res.data.show_button,
        });
      })
      .catch(err => {
        return err;
      });
  }

  openModel = () => {
    this.setState({
      showConfirmation: true,
    });
  };

  cancelHandler = () => {
    this.setState({
      showConfirmation: false,
    });
  };

  cancleModel = () => {
    this.setState({
      deleteConfirmation: false,
    });
  };

  openDelete = () => {
    this.setState({
      deleteConfirmation: true,
    });
  };

  delete = id => {
    const { site_document } = this.state;
    axios
      .post(`/fv3/api/blueprints/?blueprint=${id}`)
      .then(res => {
        if (res.status === 204) {
          const delet = site_document.filter(data => id !== data.id);
          this.setState({
            site_document: delet,
            id: '',
            deleteConfirmation: false,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleDelete = id => {
    this.setState({
      deleteConfirmation: true,
      id,
    });
  };

  handleUpdate = data => {
    if (data.status === 201) {
      const {
        match: {
          params: { id },
        },
      } = this.props;
      axios
        .get(`fv3/api/site/documents/?site_id=${id}`)
        .then(res => {
          this.setState({
            site_document: res.data.documents,
            breadcrumb: res.data.breadcrumbs,
          });
        })
        .catch(err => {
          return err;
        });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { files, document_name, document_type } = this.state;
    const form_data = new FormData();
    const data = files;
    data.map(each => {
      return form_data.append('files', each);
    });
    form_data.append('name', document_name);
    form_data.append('doc_type', document_type);
    // for (var pair of form_data.entries()) {
    // }
    axios({
      method: 'post',
      url: `fv3/api/blueprints/?site=${id}`,
      data: form_data,
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (res.status === 201) {
          this.setState({
            document_name: '',
            document_type: 'Document Type',
            files: [],
            showConfirmation: false,
          });
          this.handleUpdate(res);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  fileSelectedHandler = e => {
    this.setState(state => ({
      files: [...state.files, ...e.target.files],
    }));
  };

  handleChange = async e => {
    await this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { showConfirmation, breadcrumb, show_button } = this.state;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          {Object.keys(breadcrumb).length > 0 && (
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href={breadcrumb.site_url}>{breadcrumb.site}</a>
              </li>
              <li className="breadcrumb-item">{breadcrumb.name}</li>
            </ol>
          )}
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="right-content">
                <div className="card no-boxshadow">
                  <div className="card-header main-card-header">
                    <h5>
                      {' '}
                      <h5>
                        <FormattedMessage
                          id="app.site-document"
                          defaultMessage="Site documents"
                        />
                      </h5>
                    </h5>
                    <div className="add-btn">
                      {show_button && (
                        <button
                          type="button"
                          onClick={this.openModel}
                          className="fieldsight-btn"
                        >
                          Add new
                          <span>
                            <i className="la la-plus" />
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="card-body ">
                    <SiteDocumentTable
                      site_document={this.state.site_document}
                      handleDelete={id => {
                        this.handleDelete(id);
                      }}
                      openDelete={this.openDelete}
                    />
                  </div>
                  {showConfirmation && (
                    <Modal
                      title="Add site Document"
                      toggleModal={this.cancelHandler}
                    >
                      <form
                        className="floating-form"
                        onSubmit={this.handleSubmit}
                      >
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="document_name"
                            onChange={e => this.handleChange(e)}
                            value={this.state.document_name}
                            required
                          />

                          <label htmlFor="input">Document Name</label>
                        </div>
                        <div className="form-group">
                          <div className="select-option">
                            <select
                              className="form-control"
                              onChange={e => this.handleChange(e)}
                              name="document_type"
                              value={this.state.document_type}
                            >
                              <option selected value="Document Type">
                                Document Type
                              </option>
                              <option value="Blue print">
                                Blue print
                              </option>
                              <option value="Report">Report</option>
                              <option value="Drawing">Drawing</option>
                              <option value="Permit">Permit</option>
                              <option value="Registration">
                                Registration
                              </option>
                              I
                              <option value="Identification">
                                Identification
                              </option>
                              <option value="Contract">
                                Contract
                              </option>
                              <option value="Variation">
                                Variation
                              </option>
                              <option value="Manual or Instruction">
                                Manual or Instruction
                              </option>
                              <option value="Payment or Invoice">
                                Payment or Invoice
                              </option>
                              <option value="Notes">Notes</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Attach file</label>
                          <div className="upload-form">
                            <input
                              type="file"
                              name="userprofile_picture"
                              id="filePhoto"
                            />
                            <div className="fieldsight-btn">
                              <label htmlFor="upload-btn">
                                upload
                                <i className="la la-cloud-upload" />
                              </label>
                              <input
                                type="file"
                                id="upload-btn"
                                multiple
                                onChange={this.fileSelectedHandler}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group pull-right no-margin">
                          <button
                            type="submit"
                            className="fieldsight-btn"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </Modal>
                  )}
                  {this.state.deleteConfirmation && (
                    <Modal
                      title="Warning"
                      toggleModal={this.cancleModel}
                    >
                      <div className="warning">
                        <p>Are you sure you want to delete?</p>
                      </div>
                      <div className="warning-footer text-center">
                        <a
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          className="fieldsight-btn rejected-btn"
                          onClick={() => {
                            this.setState({
                              deleteConfirmation: false,
                            });
                          }}
                        >
                          cancel
                        </a>
                        <a
                          role="button"
                          onKeyDown={this.handleKeyDown}
                          tabIndex="0"
                          className="fieldsight-btn"
                          onClick={() => {
                            this.delete(this.state.id);
                          }}
                        >
                          confirm
                        </a>
                      </div>
                    </Modal>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
SiteDocument.propTypes = {
  match: PropTypes.objectOf.isRequired,
};

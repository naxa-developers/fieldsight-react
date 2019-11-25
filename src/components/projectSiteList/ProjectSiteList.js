import React, { Component } from 'react';
import Zoom from 'react-reveal/Zoom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import ProjectSiteTable from './ProjectSiteTable';
import AddSite from './AddSite';
import { RegionContext } from '../../context';
import isEmpty from '../../utils/isEmpty';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/label-has-associated-control  */

// const project_id = 137;
// const base_url = 'https://fieldsight.naxa.com.np';
// const project_name = "test";

const popUpState = {
  addModal: false,
  uploadModal: false,
};

class ProjectSiteList extends Component {
  constructor(props) {
    super(props);
    this.contextType = RegionContext;
    this.state = {
      addModal: false,
      uploadModal: false,
      breadcrumbs: {},
    };
  }

  showPopup = (e, type) => {
    this.setState(prevState => ({
      ...popUpState,
      [`${type}Modal`]: true,
    }));
  };

  closePopup = () => {
    this.setState({
      addModal: false,
      uploadModal: false,
    });
  };

  OpenTabHandler = (e, url) => {
    // console.log(this.context.projectId);
    window.open(url, '_self');
  };

  breadcrumbhandler = breadcrumbs => {
    this.setState({
      breadcrumbs,
    });
  };

  render() {
    const {
      context: { terms },
    } = this;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li
              className="breadcrumb-item active"
              aria-current="page"
            >
              <a href={this.state.breadcrumbs.project_url}>
                {this.state.breadcrumbs.project_name}
              </a>
            </li>
            {/* <li className="breadcrumb-item">
              <a href="/fieldsight/organization-dashboard/13/">Site List</a>
            </li> */}

            <li className="breadcrumb-item " aria-current="page">
              {!isEmpty(terms) ? (
                `${terms.site} List`
              ) : (
                <FormattedMessage
                  id="app.siteList"
                  defaultMessage="Site List"
                />
              )}
            </li>
          </ol>
        </nav>

        <div className="card">
          <ProjectSiteTable
            showPopup={this.showPopup}
            OpenTabHandler={this.OpenTabHandler}
            breadcrumbhandler={this.breadcrumbhandler}
          />

          {this.state.uploadModal && (
            <Zoom duration={500}>
              <div className="fieldsight-popup open">
                <div className="popup-body lg-body">
                  <div className="card">
                    <div className="card-header main-card-header">
                      <h5>
                        <FormattedMessage
                          id="app.bulkUpload"
                          defaultMessage="Bulk Upload"
                        />
                      </h5>
                      <span
                        role="button"
                        onKeyDown={this.closePopup}
                        tabIndex="0"
                        className="popup-close"
                        onClick={this.closePopup}
                      >
                        <i className="la la-close" />
                      </span>
                    </div>
                    <div className="card-body">
                      <form
                        className="edit-form"
                        style={{
                          position: 'relative',
                          height: '250px',
                        }}
                      >
                        <PerfectScrollbar>
                          <div className="form-group">
                            <label>
                              <FormattedMessage
                                id="app.uploadFile"
                                defaultMessage="Upload file"
                              />
                            </label>
                            <div className="upload-form">
                              <div className="upload-wrap">
                                <div className="content">
                                  <h3>
                                    <FormattedMessage
                                      id="app.drag&DropAnImage"
                                      defaultMessage="Drag & Drop an image"
                                    />
                                  </h3>
                                  <span>
                                    <FormattedMessage
                                      id="app.or"
                                      defaultMessage="or"
                                    />
                                  </span>
                                </div>
                                <input
                                  type="file"
                                  className="userprofile_picture"
                                  id="filePhoto"
                                />
                                <div className="fieldsight-btn">
                                  <label htmlFor="upload-btn">
                                    <FormattedMessage
                                      id="app.upload"
                                      defaultMessage="Upload"
                                    />
                                    <i className="la la-cloud-upload" />
                                  </label>
                                  <input
                                    type="file"
                                    id="upload-btn"
                                    multiple
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </PerfectScrollbar>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Zoom>
          )}

          {this.state.addModal && (
            <AddSite closePopup={this.closePopup} />
          )}
        </div>
      </>
    );
  }
}
export default ProjectSiteList;

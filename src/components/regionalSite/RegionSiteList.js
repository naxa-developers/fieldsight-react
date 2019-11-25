import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Zoom from 'react-reveal/Zoom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import AddSite from './AddSite';
import RegionalSiteTable from './RegionalSiteTable';
import isEmpty from '../../utils/isEmpty';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/label-has-associated-control  */
/* eslint-disable consistent-return  */
/* eslint-disable react/no-array-index-key  */

const popUpState = {
  addModal: false,
  uploadModal: false,
};

class RegionSiteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      uploadModal: false,
      subRegionList: [],
      dLoader: true,
      projectId: null,
      terms: {},
      breadcrumbs: {},
    };
  }

  componentDidMount() {
    this._isMounted = true;

    const { regionId } = this.props;
    const subRegion = `fv3/api/sub-regions/?region=${regionId}`;

    axios
      .get(`${subRegion}`)

      .then(res => {
        if (res.status === 200) {
          // console.log(res.data.terms_and_labels.site)
          this.setState({
            subRegionList: res.data.data,
            dLoader: false,
            projectId: res.data.project,
            terms: res.data.terms_and_labels,
            breadcrumbs: res.data.breadcrumbs,
          });
        }
      })
      .catch(() => {
        this.setState({
          // dLoader: false
        });
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.regionId === this.props.regionId) {
      const { regionId } = this.props;
      const subRegion = `fv3/api/sub-regions/?region=${regionId}`;

      axios
        .get(`${subRegion}`)

        .then(res => {
          if (this._isMounted) {
            if (res.status === 200) {
              this.setState({
                subRegionList: res.data.data,
                dLoader: false,
                projectId: res.data.project,
                terms: res.data.terms_and_labels,
                breadcrumbs: res.data.breadcrumbs,
              });
            }
          }
        })
        .catch(() => {
          this.setState({
            // dLoader: false
          });
        });
    }
  }

  showPopup = (e, type) => {
    this.setState({
      ...popUpState,
      [`${type}Modal`]: true,
    });
  };

  closePopup = () => {
    this.setState({
      addModal: false,
      uploadModal: false,
    });
  };

  OpenTabHandler = (e, url) => {
    window.open(url, '_self');
  };

  render() {
    const {
      state: {
        breadcrumbs,
        terms,
        projectId,
        uploadModal,
        addModal,
        subRegionList,
        dLoader,
      },
      props: { regionId },
    } = this;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          {Object.keys(breadcrumbs).length > 0 && (
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href={breadcrumbs.project_url}>
                  {breadcrumbs.project_name}
                </a>
              </li>

              <li
                className="breadcrumb-item active"
                aria-current="page"
              >
                {breadcrumbs.region}
              </li>
            </ol>
          )}
        </nav>
        <div className="sub-regions">
          <div className="card">
            <div className="card-header main-card-header">
              <h5>
                {!isEmpty(terms)
                  ? `Sub ${terms.region} `
                  : 'Sub Regions'}
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {subRegionList.map((subRegion, i) => (
                  <div className="col-xl-3 col-lg-6" key={i}>
                    <Link to={`/regional-site/${subRegion.id}`}>
                      <div className="sub-regions-item ">
                        <h5>{subRegion.name}</h5>
                        <h6>{subRegion.identifier}</h6>
                        <p>
                          <label>
                            <FormattedMessage
                              id="app.total"
                              defaultMessage="Total"
                            />
                            :
                          </label>
                          {subRegion.total_sites}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <RegionalSiteTable
            showPopup={this.showPopup}
            OpenTabHandler={this.OpenTabHandler}
            regionId={regionId}
            projectId={projectId}
            terms={terms}
            loader={dLoader}
          />

          {uploadModal && (
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
                        tabIndex="0"
                        role="button"
                        className="popup-close"
                        onClick={this.closePopup}
                        onKeyDown={() => {
                          this.closePopup();
                        }}
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
                                defaultMessage="Upload File"
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

          {addModal && <AddSite closePopup={this.closePopup} />}
        </div>
      </>
    );
  }
}
export default RegionSiteList;

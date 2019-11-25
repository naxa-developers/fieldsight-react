import React, { Component } from 'react';
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cropper from 'react-cropper';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Table from 'react-bootstrap/Table';
import { FormattedMessage } from 'react-intl';
import CountCard from '../../common/CountCard';
import { AvatarContentLoader, DotLoader } from '../../common/Loader';
import SubmissionModal from './SubmissionModal';
import Modal from '../../common/Modal';
import Td from '../../common/TableData';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/label-has-associated-control  */
/* eslint-disable react/no-array-index-key  */

// const projectId = window.project_id ? window.project_id : 137;

class DashboardHeader extends Component {
  saveImage = () => {
    const { siteId, closeModal, putCropImage } = this.props;
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    const croppedImage = this.cropper.getCroppedCanvas().toDataURL();
    putCropImage(siteId, croppedImage);
    closeModal('Cropper');
  };

  rotate = () => {
    this.cropper.rotate(90);
  };

  rotateLeft = () => {
    this.cropper.rotate(-90);
  };

  render() {
    const {
      props: {
        name,
        address,
        identifier,
        enableSubsites,
        logo,
        region,
        totalUsers,
        totalSubmission,
        siteForms,
        siteId,
        showModal,
        showDotLoader,
        activeTab,
        closeModal,
        openModal,
        toggleTab,
        showCropper,
        subSites,
        showSubsites,
        totalSubsites,
        showGallery,
        showContentLoader,
        subSitesLoader,
        termsAndLabels,
        hasWritePermission,
        projectId,
        currentProgress,
        type,
      },
      rotate,
      rotateLeft,
    } = this;

    const ManageDropdown = [
      {
        title: 'Generate Report',
        link: `/fieldsight/site-dashboard/${siteId}/`,
        id: 'app.generate-report',
      },
      {
        title: 'View Data',
        link: `/fieldsight/application/#/site-responses/${siteId}/general/`,
        id: 'app.view-data',
      },
    ];

    const HeaderDropdown = [
      {
        title: `Edit ${termsAndLabels && termsAndLabels.site}`,
        link: `/fieldsight/application/#/site-edit/${siteId}/`,
      },
      {
        title: `${termsAndLabels && termsAndLabels.site} documents`,
        link: `/fieldsight/application/#/site-documents/${siteId}/`,
      },
      {
        title: 'users',
        link: `/fieldsight/manage/people/site/${siteId}/`,
      },
      {
        title: 'users',
        link: `/fieldsight/manage/people/site/${siteId}/`,
        id: 'app.users',
      },
      {
        title: 'forms',
        link: `/fieldsight/application/#/site/manage-forms/0/${siteId}/generalform`,
        id: 'app.forms',
      },
    ];

    return (
      <div className="card mrb-30">
        <div className="card-header main-card-header dashboard-header">
          {showContentLoader ? (
            <AvatarContentLoader number={1} width="300px" size="80" />
          ) : (
            <div className="dash-pf">
              <figure
                style={{
                  backgroundImage: `url(${logo})`,
                  // height: "80px",
                  width: '80px',
                  // borderRadius: "100%",
                  // backgroundRepeat: "no-repeat",
                  // backgroundSize: "cover"
                }}
              >
                {/* <img src={logo} alt={logo} /> */}
                <span />
                <figcaption>
                  <a
                    onKeyDown={() => {
                      openModal('Gallery');
                    }}
                    tabIndex="0"
                    role="button"
                    className="photo-preview"
                    onClick={() => openModal('Gallery')}
                  >
                    <i className="la la-eye" />
                  </a>
                  {hasWritePermission && (
                    <a
                      tabIndex="0"
                      role="button"
                      className="photo-edit"
                      onClick={() => openModal('Cropper')}
                      onKeyDown={() => {
                        openModal('Cropper');
                      }}
                    >
                      <i className="la la-camera" />
                    </a>
                  )}
                </figcaption>
              </figure>
              <div className="dash-pf-content">
                {name && <h5>{name}</h5>}
                <div className="flex">
                  {identifier && (
                    <div className="col-sm-8">
                      <label>
                        <strong>
                          <FormattedMessage
                            id="app.identifier"
                            defaultMessage="Identifier"
                          />
                          :
                        </strong>
                      </label>
                      &nbsp;
                      <span>{identifier}</span>
                    </div>
                  )}
                  {region && (
                    <div className="col-sm-8">
                      <label>
                        <strong>
                          <FormattedMessage
                            id="app.region"
                            defaultMessage="Region"
                          />
                          :
                        </strong>
                      </label>
                      &nbsp;
                      <span>{region}</span>
                    </div>
                  )}
                </div>
                <div className="flex">
                  {address && (
                    <div className="col-sm-8">
                      <label>
                        <strong>
                          <FormattedMessage
                            id="app.address"
                            defaultMessage="Address"
                            description="Address"
                          />
                          :
                        </strong>
                      </label>
                      &nbsp;
                      <span>{address}</span>
                    </div>
                  )}
                  {type && (
                    <div className="col-sm-8">
                      <label>
                        <strong>
                          <FormattedMessage
                            id="app.type"
                            defaultMessage="Type"
                            description="Type"
                          />
                          :
                        </strong>
                      </label>
                      &nbsp;
                      <span>{type}</span>
                    </div>
                  )}
                </div>
                {/* {address && <span>{address}</span>}
                {region && <span>{region} </span>} */}
              </div>
            </div>
          )}

          <div className="dash-btn">
            <Dropdown>
              <Dropdown.Toggle
                variant=""
                id="dropdown-Data"
                className="fieldsight-btn"
              >
                <i className="fa fa-paste" />
                {/* <span>Data</span>*/}

                <span>
                  <FormattedMessage
                    id="app.data"
                    defaultMessage="Data"
                    description="Data"
                  />
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-right">
                {ManageDropdown.map((item, i) => (
                  <Dropdown.Item
                    href={item.link}
                    key={i}
                    target="_blank"
                  >
                    {/*item.title*/}
                    <FormattedMessage
                      id={item.id}
                      defaultMessage={item.title}
                      description={item.title}
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {hasWritePermission && (
              <Dropdown>
                <Dropdown.Toggle
                  variant=""
                  id="dropdown-Manage"
                  className="fieldsight-btn"
                >
                  <i className="fa fa-cog" />
                  {/*<span>Manage</span>*/}
                  <span>
                    <FormattedMessage
                      id="app.manage"
                      defaultMessage="Manage"
                      description="Manage"
                    />
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-right">
                  {HeaderDropdown.map((item, i) => (
                    <Dropdown.Item
                      href={item.link}
                      key={i}
                      target="_blank"
                    >
                      {!!item.id ? (
                        <FormattedMessage
                          id={item.id}
                          defaultMessage={item.title}
                          description={item.title}
                        />
                      ) : (
                        item.title
                      )}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="header-count">
            <Link
              to={`/site-responses/${siteId}/general`}
              target="_blank"
            >
              <CountCard
                countName=""
                countNumber={totalSubmission}
                icon="la-clone"
              />
            </Link>
            <a
              href={`/fieldsight/application/#/site-users/${siteId}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CountCard
                countName="User"
                countNumber={totalUsers}
                icon="la-user"
                noSubmissionText
              />
            </a>
            {enableSubsites && (
              <a
                tabIndex="0"
                role="button"
                onKeyDown={() => {
                  closeModal('Subsites');
                }}
                onClick={() => openModal('Subsites')}
              >
                <CountCard
                  countName="Subsite"
                  countNumber={totalSubsites}
                  icon="la-map-marker"
                  noSubmissionText
                />
              </a>
            )}

            {hasWritePermission && (
              <div className="add-data">
                <a
                  tabIndex="0"
                  role="button"
                  onKeyDown={() => {
                    closeModal('Header');
                  }}
                  onClick={() => {
                    openModal('Header');
                  }}
                >
                  <FormattedMessage
                    id="app.addData"
                    defaultMessage="Add Data"
                  />
                  <i className="la la-plus" />
                </a>
              </div>
            )}
            <CountCard
              countName="Progress"
              icon="la-signal"
              countNumber={currentProgress}
              noSubmissionText
            />
          </div>

          {showModal && (
            <SubmissionModal
              showDotLoader={showDotLoader}
              siteForms={siteForms}
              activeTab={activeTab}
              closeModal={() => closeModal('Header')}
              toggleTab={toggleTab}
              enableSubsites={enableSubsites}
            />
          )}

          {showCropper && (
            <Modal
              title="Preview"
              toggleModal={() => closeModal('Cropper')}
            >
              <div className="cropper-btn">
                <button
                  type="button"
                  onClick={rotate}
                  className="fieldsight-btn"
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        <FormattedMessage
                          id="app.rotateLeft"
                          defaultMessage="Rotate Left"
                        />
                      </Tooltip>
                    }
                  >
                    <i className="la la-rotate-left" />
                  </OverlayTrigger>
                </button>
                <button
                  type="button"
                  onClick={rotateLeft}
                  className="fieldsight-btn"
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        <FormattedMessage
                          id="app.rotateRight"
                          defaultMessage="Rotate Right"
                        />
                      </Tooltip>
                    }
                  >
                    <i className="la la-rotate-right" />
                  </OverlayTrigger>
                </button>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="card-body" style={{ padding: 0 }}>
                    <figure>
                      <Cropper
                        style={{ height: 400, width: 300 }}
                        aspectRatio={1 / 1}
                        preview=".img-preview"
                        guides={false}
                        src={logo}
                        ref={cropper => {
                          this.cropper = cropper;
                        }}
                      />
                    </figure>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card-body" style={{ padding: 0 }}>
                    <figure>
                      <div
                        className="img-preview"
                        style={{
                          width: '100%',
                          height: 400,
                          overflow: 'hidden',
                        }}
                      />
                    </figure>
                  </div>
                </div>
                <div className="col-md-12 text-right">
                  <button
                    type="button"
                    className="fieldsight-btn"
                    style={{ marginTop: '15px' }}
                    onClick={this.saveImage}
                  >
                    <FormattedMessage
                      id="app.saveImage"
                      defaultMessage="Save Image"
                    />
                  </button>
                </div>
              </div>
            </Modal>
          )}
          {showSubsites && (
            <Modal
              title="Subsites"
              toggleModal={() => {
                closeModal('Subsites');
              }}
              showButton={enableSubsites && hasWritePermission}
              url={`/fieldsight/application/#/sub-site-add/${projectId}/${siteId}`}
            >
              {subSitesLoader ? (
                <DotLoader />
              ) : (
                <PerfectScrollbar>
                  <Table
                    responsive="xl"
                    className="table  table-bordered  dataTable "
                  >
                    <thead>
                      <tr>
                        <th>
                          <FormattedMessage
                            id="app.identifier"
                            defaultMessage="Identifier"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="app.name"
                            defaultMessage="Name"
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
                            id="app.type"
                            defaultMessage="Type"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subSites.map((subSite, i) => (
                        <tr key={i}>
                          <Td to={`/site-dashboard/${subSite.id}`}>
                            {subSite.identifier}
                          </Td>
                          <Td to={`/site-dashboard/${subSite.id}`}>
                            {subSite.name}
                          </Td>

                          <Td to={`/site-dashboard/${subSite.id}`}>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="40"
                                aria-valuemin="0"
                                aria-valuemax="200"
                                style={{
                                  width: `${subSite.progress} %`,
                                }}
                              >
                                <span className="progress-count">
                                  {`${subSite.progress} %`}
                                </span>
                              </div>
                            </div>
                          </Td>
                          <Td to={`/site-dashboard/${subSite.id}`}>
                            {subSite.submissions}
                          </Td>
                          <Td to={`/site-dashboard/${subSite.id}`}>
                            {subSite.type}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </PerfectScrollbar>
              )}
            </Modal>
          )}
          {showGallery && (
            <div
              tabIndex="0"
              role="button"
              onKeyDown={() => {
                closeModal('Gallery');
              }}
              className="gallery-zoom fieldsight-popup open"
              style={{ zIndex: 99999 }}
              onClick={() => {
                closeModal('Gallery');
              }}
            >
              <div className="gallery-body">
                <img
                  src={logo}
                  alt="logo"
                  style={{ minHeight: '400px', maxHeight: '400px' }}
                />
              </div>
              <span
                tabIndex="0"
                role="button"
                onKeyDown={() => {
                  closeModal('Gallery');
                }}
                className="popup-close"
                onClick={() => {
                  closeModal('Gallery');
                }}
              >
                <i className="la la-close" />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DashboardHeader;

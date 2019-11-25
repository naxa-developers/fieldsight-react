import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import CountCard from '../../common/CountCard';
import { AvatarContentLoader } from '../../common/Loader';
import SubmissionModal from './SubmissionModel';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-array-index-key  */

class DashboardHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openmodel: false,
    };
  }

  saveImage = () => {
    const { siteId, putCropImage, closeModal } = this.props;
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
      name,
      address,
      logo,
      totalUsers,
      totalSites,
      id,
      showContentLoader,
      closeModal,
      openModal,
      termsAndLabels,
      showGallery,
      isProjectManager,
      totalSubmissions,
      surveyData,
    } = this.props;

    const { openmodel } = this.state;
    const ManageDropdown = [
      {
        title: 'users',
        link: `/fieldsight/manage/people/project/${id}/`,
        id: 'app.users',
      },
      // { title: "forms", link: `/forms/setup-forms/1/${id}` },
      {
        title: 'forms',
        link: `/fieldsight/application/#/project/manage-forms/1/${id}/generalform`,
        id: 'app.forms',
      },

      {
        title: `${termsAndLabels && termsAndLabels.site}`,
        link: `/fieldsight/application/?project=${id}#/project-sitelist`,
        id:
          `${termsAndLabels && termsAndLabels.site}` == 'School'
            ? 'app.school'
            : `${termsAndLabels && termsAndLabels.site}`,
      },
      {
        title: `settings`,
        link: `/fieldsight/application/?project=${id}#/project-settings`,
        id: 'app.setting',
      },
    ];
    const DataDropdown = [
      {
        title: 'Generate Report',
        link: `/fieldsight/project-dashboard/${id}/`,
        id: 'app.generate-report',
      },
      {
        title: 'View Data',
        link: `/fieldsight/application/#/project-responses/${id}/general/`,
        id: 'app.view-data',
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
                  width: '80px',
                }}
              >
                <span />
                <figcaption>
                  <a
                    onKeyDown={() => {
                      openModal('Gallery');
                    }}
                    tabIndex="0"
                    role="button"
                    className="photo-preview"
                    onClick={() => {
                      openModal('Gallery');
                    }}
                  >
                    <i className="la la-eye" />
                  </a>
                </figcaption>
              </figure>
              <div className="dash-pf-content">
                {name && <h5>{name}</h5>}
                {/* {identifier && <span>{identifier}</span>} */}
                {address && <span>{address}</span>}
                {/* {region && <span>{region} </span>} */}
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
                <i className="la la-paste" />
                {/*<span>Data</span>*/}
                <span>
                  <FormattedMessage
                    id="app.data"
                    defaultMessage="Data"
                    description="Data"
                  />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-right">
                {DataDropdown.map((item, i) => (
                  <Dropdown.Item
                    href={item.link}
                    key={i}
                    target="_blank"
                  >
                    <FormattedMessage
                      id={item.id}
                      defaultMessage={item.title}
                      description={item.title}
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {isProjectManager && (
              <Dropdown>
                <Dropdown.Toggle
                  variant=""
                  id="dropdown-Manage"
                  className="fieldsight-btn"
                >
                  <i className="la la-cog" />
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
                  {ManageDropdown.map((item, i) => (
                    <Dropdown.Item
                      href={item.link}
                      key={i}
                      target="_blank"
                    >
                      <FormattedMessage
                        id={item.id}
                        defaultMessage={item.title}
                        description={item.title}
                      />
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
              to={`/project-responses/${id}/general`}
              target="_blank"
            >
              <CountCard
                countName=""
                countNumber={totalSubmissions}
                icon="la-copy"
                // noSubmissionText={true}
              />
            </Link>
            <a
              href={`/fieldsight/application/#/project-users/${id}/`}
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
            <a
              href={`/fieldsight/application/?project=${id}#/project-sitelist`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CountCard
                countName="site"
                countNumber={totalSites}
                icon="la-map-marker"
                noSubmissionText
              />
            </a>
            {isProjectManager && (
              <div className="add-data">
                <a
                  tabIndex="0"
                  role="button"
                  onKeyDown={() => this.setState({ openmodel: true })}
                  onClick={() => this.setState({ openmodel: true })}
                >
                  <FormattedMessage
                    id="app.addData"
                    defaultMessage="Add Data"
                  />
                  <i className="la la-plus" />
                </a>
              </div>
            )}
          </div>
          {openmodel && (
            <SubmissionModal
              surveyData={surveyData}
              toggleModal={() => this.setState({ openmodel: false })}
            />
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
                  closeModal('Header');
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

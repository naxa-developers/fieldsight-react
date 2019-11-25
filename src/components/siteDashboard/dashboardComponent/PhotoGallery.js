import React, { Component } from 'react';
import axios from 'axios';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown } from 'react-bootstrap';
import { GridContentLoader } from '../../common/Loader';
import Modal from '../../common/Modal';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions  */
/* eslint-disable jsx-a11y/click-events-have-key-events  */
/* eslint-disable react/no-array-index-key  */

const GalleryModal = ({
  selectedImage,
  imagesNumber,
  gotoPrevious,
  gotoNext,
  closeModal,
}) => (
  <div
    tabIndex="0"
    role="button"
    className="gallery-zoom fieldsight-popup open"
    style={{ zIndex: 99999 }}
    onClick={closeModal}
  >
    <div className="gallery-body">
      <img
        src={
          selectedImage._attachments.download_url
            ? selectedImage._attachments.download_url
            : selectedImage._attachments
        }
        alt="infographic"
        style={{ maxHeight: '400px' }}
      />
      <div className="gallery-footer">
        <p>
          <span>
            {selectedImage.index + 1}
            of
            {imagesNumber}
          </span>
        </p>
      </div>
    </div>
    <span
      className="popup-close"
      role="button"
      tabIndex="0"
      onClick={closeModal}
    >
      <i className="la la-close" />
    </span>
    <div className="gallery-nav">
      <i
        aria-label="prev"
        tabIndex="0"
        role="button"
        className="la la-long-arrow-left"
        onClick={e => {
          e.stopPropagation();
          gotoPrevious(selectedImage.index);
        }}
      />
      <i
        tabIndex="0"
        aria-label="next"
        role="button"
        className="la la-long-arrow-right"
        onClick={e => {
          e.stopPropagation();
          gotoNext(selectedImage.index);
        }}
      />
    </div>
  </div>
);

class PhotoGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedImage: {},
      data: '',
      response: false,
    };
  }

  showModal = (img, i) => {
    const imgWithIndex = { ...img, index: i };
    this.setState({
      selectedImage: imgWithIndex,
    });
  };

  closeModal = () => {
    this.setState({
      selectedImage: {},
    });
  };

  gotoPrevious = i => {
    if (i === 0) {
      const selectedImage = {
        ...this.props.recentPictures[
          this.props.recentPictures.length - 1
        ],
        index: this.props.recentPictures.length - 1,
      };

      return this.setState({
        selectedImage,
      });
    }

    const selectedImage = {
      ...this.props.recentPictures[i - 1],
      index: i - 1,
    };
    return this.setState({
      selectedImage,
    });
  };

  gotoNext = i => {
    if (i === this.props.recentPictures.length - 1) {
      const selectedImage = {
        ...this.props.recentPictures[0],
        index: 0,
      };
      return this.setState({
        selectedImage,
      });
    }

    const selectedImage = {
      ...this.props.recentPictures[i + 1],
      index: i + 1,
    };

    return this.setState({
      selectedImage,
    });
  };

  imageQuality = (imageid, siteId) => {
    axios
      .get(`/fv3/api/zip-site-images/${siteId}/${imageid}/`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            data: res.data.message,
            response: true,
          });
        }
      })
      .catch(err => {
        // dispatch({
        //   type: SITE_DASHBOARD_ERR
        // });
      });
  };

  render() {
    const {
      props: { recentPictures, showContentLoader, siteId },
      state: { selectedImage },
      gotoPrevious,
      gotoNext,
      showModal,
      closeModal,
    } = this;

    return (
      <div className="col-lg-6">
        <div className="card recent-photo">
          <div className="card-header main-card-header sub-card-header">
            {/* <h5>Recent Pictures</h5>*/}
            <h5>
              <FormattedMessage
                id="app.recent-pictures"
                defaultMessage="Recent Pictures"
              />
            </h5>
            {recentPictures.length > 0 ? (
              <div className="dash-btn">
                <a
                  href={`/fieldsight/site/all-pictures/${siteId}/`}
                  className="fieldsight-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FormattedMessage
                    id="app.view-all"
                    defaultMessage="view all"
                  />
                </a>
                <Dropdown>
                  <Dropdown.Toggle
                    variant=""
                    id="dropdown-Data"
                    className="fieldsight-btn"
                  >
                    <i className="la la-download" />
                    <span>
                      <FormattedMessage
                        id="app.download"
                        defaultMessage="Download"
                      />
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-right">
                    <Dropdown.Item
                      target="_blank"
                      // rel="noopener noreferrer"
                      onClick={() => {
                        this.imageQuality(0, siteId);
                      }}
                    >
                      <FormattedMessage
                        id="app.low"
                        defaultMessage="Low"
                      />
                    </Dropdown.Item>
                    <Dropdown.Item
                      target="_blank"
                      onClick={() => this.imageQuality(1, siteId)}
                    >
                      <FormattedMessage
                        id="app.medium"
                        defaultMessage="Medium"
                      />
                    </Dropdown.Item>
                    <Dropdown.Item
                      target="_blank"
                      onClick={() => this.imageQuality(2, siteId)}
                    >
                      <FormattedMessage
                        id="app.high"
                        defaultMessage="High"
                      />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : null}
          </div>
          <div className="card-body">
            {showContentLoader ? (
              <GridContentLoader
                number={window.innerWidth < 992 ? 2 : 6}
                height="180px"
              />
            ) : (
              <>
                <div className="gallery">
                  {recentPictures.length > 0 ? (
                    <div className="row">
                      {recentPictures.map((image, i) => (
                        <div className="col-lg-4 col-md-6" key={i}>
                          <div
                            className="photo-item"
                            style={{
                              backgroundImage: `url(
                              ${
                                image._attachments.download_url
                                  ? image._attachments.download_url
                                  : image._attachments
                              }
                            )`,
                            }}
                          >
                            <figcaption
                              onClick={() => showModal(image, i)}
                            >
                              <a className="photo-preview">
                                <i className="la la-eye" />
                              </a>
                            </figcaption>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>
                      <FormattedMessage
                        id="app.noDataAvailable"
                        defaultMessage="No Data Available"
                      />
                    </p>
                  )}
                </div>
                {Object.keys(selectedImage).length > 0 && (
                  <GalleryModal
                    selectedImage={selectedImage}
                    imagesNumber={recentPictures.length}
                    gotoNext={gotoNext}
                    gotoPrevious={gotoPrevious}
                    closeModal={closeModal}
                  />
                )}
              </>
            )}
          </div>
        </div>
        {this.state.response && (
          <Modal
            title="Message"
            toggleModal={() => this.setState({ response: false })}
          >
            <div className="response">
              <p>{this.state.data}</p>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default PhotoGallery;

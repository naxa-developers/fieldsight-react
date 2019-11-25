import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import Modal from '../common/Modal';
import InputElement from '../common/InputElement';
import SelectElement from '../common/SelectElement';
import RightContentCard from '../common/RightContentCard';
import Loader from '../common/Loader';
import 'leaflet/dist/leaflet.css';
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */

const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

class TeamAdd extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      project: {
        teamName: '',
        contactnumber: '',
        email: '',
        address: '',
        website: '',
        publicDescription: '',
        logo: '',
      },
      loaded: 0,
      teamTypes: [],
      country: [],

      position: {
        latitude: '51.505',
        longitude: '-0.09',
      },
      zoom: 13,
      src: '',
      showCropper: false,
      cropResult: '',
      isLoading: false,
      selectedCountry: '',
      selectedteam: '',
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    axios
      .get(`/fv3/api/team-types-countries`)
      .then(res => {
        this.setState({
          teamTypes: res.data.team_types,
          country: res.data.countries,
          // id,
        });
      })
      .catch(err => {
        console.log(err, 'err');
      });
    // if (this._isMounted) {
    //   if (sector) {
    //   }
    // }
  }

  onChangeHandler = (e, position) => {
    const { name, value } = e.target;
    this.setState(state => {
      if (position) {
        return {
          position: {
            ...state.position,
            [name]: value,
          },
        };
      }
      return {
        project: {
          ...state.project,
          [name]: value,
        },
      };
    });
  };

  onSubmitHandler = e => {
    e.preventDefault();

    const data = {
      name: this.state.project.teamName,
      contactnumber: this.state.project.contactnumber,
      email: this.state.project.email,
      address: this.state.project.address,
      website: this.state.project.website,
      publicDescription: this.state.project.publicDescription,
      selectedCountry: this.state.selectedCountry,
      selectedteam: this.state.selectedCountry,
      cropResult: this.state.cropResult,
      latitude: this.state.position.latitude,
      longitude: this.state.position.longitude,
    };

    axios
      .post(`fv3/api/team-form/`, data)
      .then(res => {
        if (res.status === 201) {
          this.setState({
            project: {
              teamName: '',
              contactnumber: '',
              email: '',
              address: '',
              website: '',
              publicDescription: '',
              logo: '',
            },
            position: {
              latitude: '51.505',
              longitude: '-0.09',
            },
            zoom: 13,
            src: '',
            showCropper: false,
            cropResult: '',
            isLoading: false,
            selectedCountry: '',
            selectedteam: '',
          });
          this.props.history.push(`/team-dashboard/${res.data.id}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  mapClickHandler = e => {
    this.setState(state => ({
      position: {
        ...state.position,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      },
    }));
  };

  onSelectChangeHandler = (e, data) => {
    const { value } = e.target;
    if (data === 'teamTypes') {
      this.setState({
        selectedCountry: value,
      });
    } else if (data === 'country') {
      this.setState({
        selectedCountry: value,
      });
    }
  };

  closeModal = () => {
    this.setState({
      showCropper: false,
    });
  };

  readFile = file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({
        src: reader.result,
        showCropper: true,
      });
    };
    reader.readAsDataURL(file[0]);
  };

  cropImage = () => {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.setState({
      cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      showCropper: false,
      src: '',
    });
  };

  render() {
    const {
      onChangeHandler,
      onSubmitHandler,
      mapClickHandler,
      onSelectChangeHandler,
      readFile,
      closeModal,
      state: {
        project: {
          teamName,
          contactnumber,
          email,
          address,
          website,
          publicDescription,
          // logo,
        },
        loaded,
        position: { latitude, longitude },
        cropResult,
        // zoom,
        // src,
        showCropper,
        isLoading,
        teamTypes,
        country,
        selectedteam,
        selectedCountry,
      },
    } = this;
    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li
              className="breadcrumb-item active"
              aria-current="page"
            >
              <FormattedMessage
                id="app.createTeam"
                defaultMessage="Create Team"
              />
            </li>
          </ol>
        </nav>
        <RightContentCard title="app.newTeam">
          <form className="edit-form" onSubmit={onSubmitHandler}>
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  required
                  label="app.teamName"
                  name="teamName"
                  value={teamName}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <SelectElement
                  className="form-control"
                  label="app.typeOfTeam"
                  translation
                  options={
                    teamTypes.length > 0
                      ? teamTypes.map(each => each)
                      : teamTypes
                  }
                  changeHandler={e => {
                    onSelectChangeHandler(e, 'teamTypes');
                  }}
                  value={selectedteam}
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  required
                  label="app.contactNumber"
                  name="contactnumber"
                  value={contactnumber}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="email"
                  required
                  label="app.email"
                  name="email"
                  value={email}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="form-group">
                  <InputElement
                    formType="editForm"
                    tag="input"
                    type="url"
                    label="app.website"
                    name="website"
                    value={website}
                    changeHandler={onChangeHandler}
                    translation
                  />
                </div>
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  required
                  label="app.address"
                  name="address"
                  value={address}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <SelectElement
                  className="form-control"
                  label="app.country"
                  translation
                  options={
                    country.length > 0
                      ? country.map(each => each)
                      : country
                  }
                  changeHandler={e => {
                    onSelectChangeHandler(e, 'country');
                  }}
                  value={selectedCountry}
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="form-group">
                  <InputElement
                    formType="editForm"
                    tag="input"
                    type="text"
                    required
                    label="app.description"
                    name="publicDescription"
                    value={publicDescription}
                    changeHandler={onChangeHandler}
                    translation
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <div className="form-group">
                  <label htmlFor="map">
                    <FormattedMessage
                      id="app.map"
                      defaultMessage="Map"
                    />
                    <sup>*</sup>
                  </label>

                  <div className="map-form">
                    <Map
                      style={{ height: '205px', marginTop: '1rem' }}
                      center={[latitude, longitude]}
                      zoom={this.state.zoom}
                      onClick={mapClickHandler}
                    >
                      <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[latitude, longitude]}>
                        <Popup>
                          <b>
                            <FormattedMessage
                              id="app.name"
                              defaultMessage="Name"
                            />
                            :{' '}
                          </b>
                          {teamName}
                        </Popup>
                      </Marker>
                    </Map>
                    <div className="latitude-form">
                      <div className="lat-group">
                        <InputElement
                          formType="editForm"
                          tag="input"
                          type="number"
                          translation
                          required
                          label="app.latitude"
                          name="latitude"
                          value={latitude}
                          changeHandler={e => {
                            onChangeHandler(e, 'latitude');
                          }}
                        />
                      </div>

                      <div className="lat-group">
                        <InputElement
                          formType="editForm"
                          tag="input"
                          type="number"
                          translation
                          required
                          label="app.longitude"
                          name="longitude"
                          value={longitude}
                          changeHandler={e => {
                            onChangeHandler(e, 'longitude');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-6">
                <div className="form-group">
                  <label htmlFor="cropresult">
                    {cropResult ? (
                      <FormattedMessage
                        id="app.preview"
                        defaultMessage="Preview"
                      />
                    ) : (
                      <FormattedMessage
                        id="app.attatchFile"
                        defaultMessage="Attach File"
                      />
                    )}
                  </label>

                  {cropResult ? (
                    <Dropzone
                      onDrop={acceptedFile => readFile(acceptedFile)}
                    >
                      {({ getRootProps, getInputProps }) => {
                        return (
                          <section>
                            <div className="upload-form">
                              <img
                                src={this.state.cropResult}
                                alt="Cropped"
                              />
                            </div>

                            <div {...getRootProps()}>
                              <input
                                {...getInputProps()}
                                multiple={false}
                              />
                              <div className="upload-icon" />

                              <button
                                type="button"
                                className="fieldsight-btn"
                              >
                                <FormattedMessage
                                  id="app.upload"
                                  defaultMessage="Upload"
                                />
                                <i className="la la-cloud-upload" />
                              </button>
                            </div>
                          </section>
                        );
                      }}
                    </Dropzone>
                  ) : (
                    <Dropzone
                      onDrop={acceptedFile => readFile(acceptedFile)}
                    >
                      {({ getRootProps, getInputProps }) => {
                        return (
                          <section>
                            <div className="upload-form">
                              <div className="upload-wrap">
                                <div className="content">
                                  <div {...getRootProps()}>
                                    <input
                                      {...getInputProps()}
                                      multiple={false}
                                    />
                                    <div className="upload-icon" />
                                    <h3>
                                      <FormattedMessage
                                        id="app.drag&DropAnImage"
                                        defaultMessage="Drag & Drop an image"
                                      />
                                    </h3>
                                    <button className="fieldsight-btn">
                                      <FormattedMessage
                                        id="app.upload"
                                        defaultMessage="Upload"
                                      />
                                      <i className="la la-cloud-upload" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        );
                      }}
                    </Dropzone>
                  )}
                </div>
              </div>

              <div className="col-sm-12">
                <button
                  type="submit"
                  className="fieldsight-btn pull-right"
                >
                  <FormattedMessage
                    id="app.save"
                    defaultMessage="Save"
                  />
                </button>
              </div>
            </div>
          </form>
          {showCropper && (
            <Modal title="Preview" toggleModal={closeModal}>
              <div className="row">
                <div className="col-md-6">
                  <div className="card-body" style={{ padding: 0 }}>
                    <figure>
                      <Cropper
                        style={{ height: 400, width: 300 }}
                        aspectRatio={1 / 1}
                        preview=".img-preview"
                        guides={false}
                        src={this.state.src}
                        ref={cropper => {
                          this.cropper = cropper;
                        }}
                      />
                      <button
                        type="button"
                        className="fieldsight-btn"
                        style={{ marginTop: '15px' }}
                        onClick={this.cropImage}
                      >
                        <FormattedMessage
                          id="app.saveImage"
                          defaultMessage="Save Image"
                        />
                      </button>
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
              </div>
            </Modal>
          )}
          {isLoading && <Loader loaded={loaded} />}
        </RightContentCard>
      </>
    );
  }
}
TeamAdd.propTypes = {
  match: PropTypes.objectOf.isRequired,
  history: PropTypes.objectOf.isRequired,
};
export default TeamAdd;

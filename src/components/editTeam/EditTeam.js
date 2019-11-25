import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import { FormattedMessage } from 'react-intl';
import Modal from '../common/Modal';
import InputElement from '../common/InputElement';
import SelectElement from '../common/SelectElement';
import RightContentCard from '../common/RightContentCard';
import Loader from '../common/Loader';
import { errorToast, successToast } from '../../utils/toastHandler';
import 'leaflet/dist/leaflet.css';
import { markerIcon } from '../common/Marker';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const urls = [
  `fv3/api/team-settings/`,
  `fv3/api/team-types-countries`,
];

class EditTeam extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      teamId: props.match.params ? props.match.params.id : '',
      team: {
        name: '',
        type: '',
        address: '',
        email: '',
        phone: '',
        website: '',
        country: '',
        public_desc: '',
        logo: '',
      },
      loaded: 0,
      position: {
        latitude: '',
        longitude: '',
      },
      teamTypes: [],
      countryList: [],
      zoom: 13,
      src: '',
      showCropper: false,
      cropResult: '',
      isLoading: false,
      updateLogo: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { teamId } = this.state;

    axios
      .all(
        urls.map((url, i) => {
          return i === 0
            ? axios.get(`${url}${teamId}/`)
            : axios.get(url);
        }),
      )
      .then(
        axios.spread((team, types) => {
          teamData(team.data.name);

          if (this._isMounted) {
            if (team && types) {
              const position =
                team.data.location && team.data.location.split(' ');
              const longitude = position && position[1].split('(')[1];
              const latitude = position && position[2].split(')')[0];
              const teamType = types.data.team_types
                ? types.data.team_types
                : [];
              const selectedType = team.data.type;
              const countryList = types.data.countries
                ? types.data.countries
                : '';
              const selectedCountry = team.data.country;

              const newPosition =
                position && position.length > 0
                  ? { latitude, longitude }
                  : { latitude: '', longitude: '' };

              const newCropResult = team.data.logo
                ? team.data.logo
                : '';

              this.setState({
                team: team.data,
                teamTypes: teamType,
                countryList: countryList,
                cropResult: newCropResult,
                position: newPosition,
              });
            }
          }
        }),
      )
      .catch(err => console.log('err', err));
  }

  requestHandler = () => {
    const {
      state: {
        teamId,
        team: {
          name,
          type,
          address,
          email,
          phone,
          website,
          country,
          public_desc,
          logo,
        },
        position: { latitude, longitude },
        cropResult,
        updateLogo,
      },
      props: {},
    } = this;

    const team = {
      name,
      type,
      address,
      email,
      phone,
      website,
      country,
      public_desc,
      // logo,
      ...(!!updateLogo && cropResult && { logo: cropResult }),
      latitude,
      longitude,
    };

    axios
      .put(`${urls[0]}${teamId}/`, team, {
        onUploadProgress: progressEvent => {
          this.setState({
            loaded: Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            ),
          });
        },
      })
      .then(res => {
        this.setState(
          {
            isLoading: false,
            loaded: 0,
          },
          () => successToast('Team', 'updated'),
        );
      })
      .catch(err => {
        this.setState(
          {
            isLoading: false,
          },
          errorToast,
        );
      });
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true,
      },
      this.requestHandler,
    );
  };

  onChangeHandler = (e, position) => {
    const { name, value } = e.target;
    if (position) {
      return this.setState({
        position: {
          ...this.state.position,
          [name]: value,
        },
      });
    }
    this.setState({
      team: {
        ...this.state.team,
        [name]: value,
      },
    });
  };

  readFile = file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({
        src: reader.result,
        showCropper: true,
        updateLogo: true,
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

  closeModal = () => {
    this.setState({
      showCropper: false,
    });
  };

  mapClickHandler = e => {
    this.setState({
      position: {
        ...this.state.position,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      },
    });
  };

  onTypeSelectChangeHandler = e => {
    const { value } = e.target;

    this.setState({
      team: {
        ...this.state.team,
        type: value,
      },
    });
  };

  onCountrySelectChangeHandler = e => {
    const { value } = e.target;

    this.setState({
      team: {
        ...this.state.team,
        country: value,
      },
    });
  };

  render() {
    const {
      state: {
        loaded,
        team: {
          name,
          type,
          address,
          email,
          phone,
          website,
          country,
          public_desc,
          logo,
        },
        position: { latitude, longitude },
        showCropper,
        cropResult,
        isLoading,
        countryList,
        teamTypes,
      },
      onChangeHandler,
      onTypeSelectChangeHandler,
      onSubmitHandler,
      onCountrySelectChangeHandler,
      readFile,
      closeModal,
      mapClickHandler,
    } = this;

    return (
      <RightContentCard title="app.editTeam">
        <form className="edit-form" onSubmit={onSubmitHandler}>
          <div className="row">
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required
                label="app.teamName"
                name="name"
                value={name}
                changeHandler={onChangeHandler}
                translation
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <SelectElement
                className="form-control"
                label="app.typeOfTeam"
                name="type"
                options={teamTypes.map(team => team)}
                changeHandler={e => {
                  onTypeSelectChangeHandler(e);
                }}
                value={type && type}
                translation
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="number"
                // required={true}
                label="app.contactNumber"
                name="phone"
                value={phone}
                changeHandler={onChangeHandler}
                translation
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="email"
                // required={true}
                label="app.email"
                name="email"
                value={email}
                changeHandler={onChangeHandler}
                translation
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="url"
                // required={true}
                label="app.website"
                name="website"
                value={website}
                changeHandler={onChangeHandler}
                translation
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <SelectElement
                className="form-control"
                label="app.country"
                name="country"
                options={countryList.map(each => each)}
                changeHandler={e => {
                  onCountrySelectChangeHandler(e);
                }}
                value={country && country}
                required
                translation
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                // required={true}
                label="app.address"
                name="address"
                value={address}
                changeHandler={onChangeHandler}
                translation
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required
                label="app.description"
                name="public_desc"
                value={public_desc}
                changeHandler={onChangeHandler}
                translation
              />
            </div>

            <div className="col-xl-4 col-md-6">
              <div className="form-group">
                <label>
                  <FormattedMessage
                    id="app.map"
                    defaultMessage="Map"
                  />{' '}
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
                    <Marker
                      position={[latitude, longitude]}
                      icon={markerIcon}
                    >
                      <Popup>
                        <b>
                          <FormattedMessage
                            id="app.name"
                            defaultMessage="Name"
                          />
                          :{' '}
                        </b>
                        {name}
                      </Popup>
                    </Marker>
                  </Map>
                  <div className="latitude-form">
                    <div className="lat-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="number"
                        required
                        label="app.latitude"
                        name="latitude"
                        value={latitude}
                        changeHandler={e => {
                          onChangeHandler(e, 'latitude');
                        }}
                        translation
                      />
                    </div>

                    <div className="lat-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="number"
                        required
                        label="app.longitude"
                        name="longitude"
                        value={longitude}
                        translation
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
                <label>
                  {' '}
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
                              alt="Cropped Image"
                            />
                          </div>
                          <div {...getRootProps()}>
                            <input
                              {...getInputProps()}
                              multiple={false}
                            />
                            <div className="upload-icon" />

                            <button className="fieldsight-btn">
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
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}
export default EditTeam;

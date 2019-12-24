import React, { Component } from 'react';
import L from 'leaflet';
import axios from 'axios';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import RightContentCard from '../common/RightContentCard';
import InputElement from '../common/InputElement';
import CheckBox from '../common/CheckBox';
import SelectElement from '../common/SelectElement';
import 'leaflet/dist/leaflet.css';

const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
/* eslint-disable */
/* eslint-disable  camelcase */

export default class SuperAdminFormEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      fax: '',
      email: '',
      website: '',
      address: '',
      public_desc: '',
      additional_desc: '',
      is_active: '',
      position: {
        latitude: '51.505',
        longitude: '-0.09',
      },
      zoom: 13,
      Selectedtypes: '',
      country: '',
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const editUrl = axios.get(
      `/fv3/api/super-organization-lists/${id}/`,
    );
    const contryListUrl = axios.get(`/fv3/api/team-types-countries`);

    axios
      .all([editUrl, contryListUrl])
      .then(
        axios.spread((...responses) => {
          const responseedit = responses[0];
          const responseContryList = responses[1];
          const position =
            responses[0].data.location &&
            responses[0].data.location.split('');
          const longitude = position && position[1].split('(')[1];
          const latitude = position && position[2].split(')')[0];
          console.log(responses, 'res');
          this.setState({
            name: responses[0].data.name,
            phone: responses[0].data.phone,
            fax: responses[0].data.fax,
            email: responses[0].data.email,
            website: responses[0].data.website,
            address: responses[0].data.address,
            public_desc: responses[0].data.public_desc,
            additional_desc: responses[0].data.additional_desc,
            is_active: responses[0].data.is_active,
            position: {
              latitude: latitude,
              longitude: longitude,
            },
            zoom: 13,
            Selectedtypes: responses[0].data.country,
            country: responses[1].data.countries,
          });
        }),
      )
      .catch(errors => {
        // react on errors.
      });
  }

  onChangeHandler = (e, position) => {
    const { name, value } = e.target;
    if (position) {
      this.setState(prevState => ({
        position: {
          ...prevState.position,
          [name]: value,
        },
      }));
    }
    return this.setState(prevState => ({
      ...prevState.project,
      [name]: value,
    }));
  };

  onSubmitHandler = e => {
    e.preventDefault();

    const data = {
      name: this.state.name,
      phone: this.state.phone,
      fax: this.state.fax,
      email: this.state.email,
      website: this.state.website,
      country: this.state.Selectedtypes,
      address: this.state.address,
      public_desc: this.state.public_desc,
      additional_desc: this.state.additional_desc,
      is_active: this.state.is_active,
      latitude: this.state.position.latitude,
      longitude: this.state.position.longitude,
    };
    axios
      .put(`/fv3/api/super-organization-form/`, data)
      .then(req => {
        if (req === 201) {
          this.setState({
            name: '',
            phone: '',
            fax: '',
            email: '',
            website: '',
            country: '',
            address: '',
            public_desc: '',
            additional_desc: '',
            is_active: '',
            position: {
              latitude: '51.505',
              longitude: '-0.09',
            },
            zoom: 13,
            Selectedtypes: '',
            id: '',
          });
        }
      })
      .catch(err => {});
  };

  changeHandler = e => {
    const { checked } = e.target;

    this.setState({
      is_active: checked,
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

  onSelectChangeHandler = e => {
    const { value } = e.target;
    this.setState({
      Selectedtypes: value,
    });
  };

  render() {
    const {
      onChangeHandler,
      onSubmitHandler,
      changeHandler,
      mapClickHandler,

      onSelectChangeHandler,
      state: {
        name,
        phone,
        fax,
        email,
        website,
        country,
        address,
        public_desc,
        additional_desc,
        is_active,
        position: { latitude, longitude },
        Selectedtypes,
      },
    } = this;

    const countrySelect = [
      { id: '1', name: 'nepal' },
      { id: '2', name: 'India' },
      { id: '3', name: 'NPL' },
      { id: '4', name: 'the State' },
      { id: '5', name: 'greece' },
    ];

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li
              className="breadcrumb-item active"
              aria-current="page"
            >
              Edit Super User
            </li>
          </ol>
        </nav>
        <RightContentCard title="Edit Super Admin">
          <form className="edit-form" onSubmit={onSubmitHandler}>
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="name"
                  name="name"
                  value={name}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="phone"
                  name="phone"
                  value={phone}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="website"
                  name="website"
                  value={website}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                {country && (
                  <SelectElement
                    className="form-control"
                    label="Country"
                    translation
                    options={country}
                    changeHandler={e => onSelectChangeHandler(e)}
                    value={Selectedtypes && Selectedtypes}
                  />
                )}
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="email"
                  name="email"
                  value={email}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <CheckBox
                  checked={is_active}
                  changeHandler={this.changeHandler}
                  label="Active"
                  value={is_active}
                  translation
                />
              </div>

              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="fax"
                  name="fax"
                  value={fax}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="address"
                  name="address"
                  value={address}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="additional_desc"
                  name="additional_desc"
                  value={additional_desc}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="public_desc"
                  name="public_desc"
                  value={public_desc}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <div className="form-group">
                  <label>
                    Map
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
                          <b>Name :</b>
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
                          label="Latitude"
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
                          label="longitude"
                          name="longitude"
                          value={longitude}
                          changeHandler={e => {
                            onChangeHandler(e, 'longitude');
                          }}
                          translation
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12">
              <button
                type="submit"
                className="fieldsight-btn pull-right"
              >
                Save
              </button>
            </div>
          </form>
        </RightContentCard>
      </>
    );
  }
}

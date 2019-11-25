import React, { Component } from 'react';
import Zoom from 'react-reveal/Zoom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Select from 'react-select';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { FormattedMessage } from 'react-intl';
import 'leaflet/dist/leaflet.css';
import InputElement from '../common/InputElement';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/label-has-associated-control  */
/* eslint-disable no-restricted-globals  */

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const SelectOption = () => <Select options={options} />;

class AddSite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
    };
  }

  render() {
    return (
      <>
        <Zoom duration={500}>
          <div className="fieldsight-popup open">
            <div className="popup-body lg-body">
              <div className="card">
                <div className="card-header main-card-header">
                  <h5>
                    <FormattedMessage
                      id="app.addSite"
                      defaultMessage="Add Site"
                    />
                  </h5>
                  <span
                    tabIndex="0"
                    role="button"
                    onKeyDown={() => {
                      this.props.closePopup();
                    }}
                    className="popup-close"
                    onClick={this.props.closePopup}
                  >
                    <i className="la la-close" />
                  </span>
                </div>
                <div className="card-body">
                  <form
                    className="floating-form"
                    style={{ position: 'relative', height: '300px' }}
                  >
                    <PerfectScrollbar>
                      <div className="row">
                        <div className="col-xl-6 col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              required
                            />
                            <label htmlFor="input">
                              <FormattedMessage
                                id="app.id"
                                defaultMessage="id"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              required
                            />
                            <label htmlFor="input">
                              <FormattedMessage
                                id="app.name"
                                defaultMessage="Name"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                          <div className="form-group">
                            <SelectOption />
                          </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                          <div className="form-group">
                            <input
                              type="number"
                              className="form-control"
                              required
                            />
                            <label htmlFor="input">
                              <FormattedMessage
                                id="app.phone"
                                defaultMessage="Phone"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="col-xl-6 col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              required
                            />
                            <label htmlFor="input">
                              <FormattedMessage
                                id="app.address"
                                defaultMessage="Address"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              required
                            />
                            <label htmlFor="input">
                              <FormattedMessage
                                id="app.region"
                                defaultMessage="Region"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>
                              <FormattedMessage
                                id="app.sitePhoto"
                                defaultMessage="Site Photo"
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
                                      defaultMessage="upload"
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
                        </div>
                        {/* sdad */}
                        <div className="col-xl-4 col-md-6">
                          <div className="form-group">
                            <label>
                              <FormattedMessage
                                id="app.map"
                                defaultMessage="Map"
                              />
                              <sup>*</sup>
                            </label>

                            <div className="map-form">
                              <Map
                                style={{
                                  height: '205px',
                                  marginTop: '1rem',
                                }}
                                center={[27.2234, 87.23232]}
                                zoom={this.state.zoom}
                                onClick={this.mapClickHandler}
                              >
                                <TileLayer
                                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker
                                  position={[27.2234, 87.23232]}
                                >
                                  <Popup>
                                    <b>
                                      <FormattedMessage
                                        id="app.name"
                                        defaultMessage="Name"
                                      />
                                      :
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
                                    label="Latitude"
                                    name="latitude"
                                    value={27.2234}
                                    translation
                                    changeHandler={e => {
                                      this.props.onChangeHandler(
                                        e,
                                        'latitude',
                                      );
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
                                    label="Longitude"
                                    name="longitude"
                                    value={87.23232}
                                    changeHandler={e => {
                                      this.props.onChangeHandler(
                                        e,
                                        'longitude',
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* sdad */}
                      </div>
                      <div className="form-group">
                        <div className="form-group pull-right no-margin">
                          <button
                            type="submit"
                            className="fieldsight-btn"
                          >
                            <FormattedMessage
                              id="app.save"
                              defaultMessage="Save"
                            />
                          </button>
                        </div>
                      </div>
                    </PerfectScrollbar>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Zoom>
      </>
    );
  }
}
export default AddSite;

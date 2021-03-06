import React, { Component, Fragment } from 'react';
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
import CheckBox from '../common/CheckBox';
import Select from './Select';

import 'leaflet/dist/leaflet.css';

const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');
/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase  */

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export default class SiteAdd extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      project: {
        name: '',
        site_id: '',
        phone: undefined,
        address: '',
        publicDescription: '',
        logo: '',
        weight: 0,
        cluster_sites: false,
      },
      loaded: 0,
      jsondata: [],
      position: {
        latitude: '51.505',
        longitude: '-0.09',
      },
      zoom: 13,
      src: '',
      showCropper: false,
      cropResult: '',
      isLoading: false,

      id: '',

      region: [{ name: '----', id: '' }],
      data: {},
      regionselected: '',
      dataSelected: '',
      siteId: '',
      regionalId: '',
      site_types: [{ name: '----', id: '' }],
      Selectedtypes: '',
      show: false,
      // jsdata: '',
      breadcrumbs: {},
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const {
      match: {
        params: { id, siteId, regionalId },
      },
    } = this.props;
    const urls = [
      `/fv3/api/site-form/?project=${id}`,
      `fv3/api/site-forms-breadcrumbs/?project=${id}&type=create`,
    ];

    axios
      .all(
        urls.map(url => {
          return axios.get(url);
        }),
      )
      .then(
        axios.spread((siteForm, breadcrumbRes) => {
          const regionArr = this.state.region;
          const typeArr = this.state.site_types;

          if (this._isMounted) {
            const position =
              siteForm.data.location !== 'None'
                ? siteForm.data.location &&
                  siteForm.data.location.split(' ')
                : '';
            const longitude = position && position[1].split('(')[1];
            const latitude = position && position[2].split(')')[0];
            const breadcrumbs = breadcrumbRes.data;
            this.setState(
              () => {
                if (siteForm.data.regions !== undefined) {
                  siteForm.data.regions.map(each =>
                    regionArr.push(each),
                  );
                }
                if (siteForm.data.site_types !== undefined) {
                  siteForm.data.site_types.map(each =>
                    typeArr.push(each),
                  );
                }
                return {
                  jsdata: siteForm.data.hello,
                  jsondata: siteForm.data.json_questions,
                  id,
                  region:
                    siteForm.data.regions !== undefined || ''
                      ? regionArr
                      : [],
                  siteId,
                  regionalId,
                  site_types: typeArr,
                  position: {
                    longitude,
                    latitude,
                  },
                  breadcrumbs,
                };
              },
              () => {},
            );
          }
        }),
      )
      .catch(() => {
        // console.log(err, 'err');
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
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
      project: {
        ...prevState.project,
        [name]: value,
      },
    }));
  };

  onSubmitHandler = e => {
    e.preventDefault();
    // let select;
    const data = {
      project: this.state.id,
      name: this.state.project.name,
      identifier: this.state.project.site_id,
      phone: this.state.project.phone,
      address: this.state.project.address,
      public_desc: this.state.project.publicDescription,
      region: this.state.regionselected,
      ...(this.state.show && { logo: this.state.cropResult }),
      latitude: this.state.position.latitude,
      longitude: this.state.position.longitude,
      type: this.state.Selectedtypes,
      enable_subsites: this.state.project.cluster_sites,
      site_meta_attributes_ans: JSON.stringify(
        this.state.data,
        this.state.dataSelected,
      ),
    };

    const Subsite = {
      project: this.state.id,
      name: this.state.project.name,
      identifier: this.state.project.site_id,
      phone: this.state.project.phone,
      address: this.state.project.address,
      public_desc: this.state.project.publicDescription,
      region: this.state.regionselected,
      ...(this.state.show && { logo: this.state.cropResult }),
      latitude: this.state.position.latitude,
      longitude: this.state.position.longitude,
      type: this.state.Selectedtypes,
      site: this.state.siteId,
      weight: this.state.weight,
      enable_subsites: this.state.project.cluster_sites,
      site_meta_attributes_ans: JSON.stringify(
        this.state.data,
        this.state.dataSelected,
      ),
    };
    const region = {
      project: this.state.id,
      name: this.state.project.name,
      identifier: this.state.project.site_id,
      phone: this.state.project.phone,
      address: this.state.project.address,
      public_desc: this.state.project.publicDescription,
      region: this.state.regionalId,
      ...(this.state.show && { logo: this.state.cropResult }),
      latitude: this.state.position.latitude,
      longitude: this.state.position.longitude,
      type: this.state.Selectedtypes,
      enable_subsites: this.state.project.cluster_sites,
      site_meta_attributes_ans: JSON.stringify(
        this.state.data,
        this.state.dataSelected,
      ),
      subsite: this.state.siteId,
    };

    if (this.props.page === 'CreateSite') {
      axios({
        method: 'POST',
        url: `/fv3/api/site-form/?project=${this.state.id}`,
        data,
        headers: { 'content-type': 'application/json' },
      })
        .then(req => {
          if (req.status === 201) {
            this.setState({
              project: {
                name: '',
                site_id: '',
                phone: '',
                address: '',
                publicDescription: '',
                logo: '',
                cluster_sites: false,
              },
              position: {
                latitude: '51.505',
                longitude: '-0.09',
              },
              src: '',
              showCropper: false,
              cropResult: '',
              isLoading: false,

              id: '',

              regionselected: '',
              // selectedGender: 'Male',
              dataSelected: '',
              data: [],
            });
            this.props.history.push(`/site-dashboard/${req.data.id}`);
          }
        })
        .catch(() => {
          // console.log(err);
        });
    } else if (this.props.page === 'subSite') {
      axios({
        method: 'POST',
        url: `/fv3/api/site-form/?project=${this.state.id}&site=${this.state.siteId}`,
        data: Subsite,
        headers: { 'content-type': 'application/json' },
      })
        .then(req => {
          if (req.status === 201) {
            this.setState({
              project: {
                name: '',
                site_id: '',
                phone: '',
                address: '',
                publicDescription: '',
                logo: '',
                cluster_sites: false,
              },
              position: {
                latitude: '51.505',
                longitude: '-0.09',
              },
              src: '',
              showCropper: false,
              cropResult: '',
              isLoading: false,

              id: '',

              regionselected: '',
              // selectedGender: 'Male',
              dataSelected: '',
              data: [],
            });
            this.props.history.push(`/site-dashboard/${req.data.id}`);
          }
        })
        .catch(() => {
          // console.log(err);
        });
    } else if (this.props.page === 'regionalSite') {
      axios({
        method: 'POST',
        url: `/fv3/api/site-form/?project=${this.state.id}&region=${this.state.regionalId}`,
        data: region,
        headers: { 'content-type': 'application/json' },
      })
        .then(req => {
          if (req.status === 201) {
            this.setState({
              project: {
                name: '',
                site_id: '',
                phone: '',
                address: '',
                publicDescription: '',
                logo: '',
                cluster_sites: false,
              },
              position: {
                latitude: '51.505',
                longitude: '-0.09',
              },
              src: '',
              showCropper: false,
              cropResult: '',
              isLoading: false,

              id: '',

              regionselected: '',
              // selectedGender: 'Male',
              dataSelected: '',
              data: [],
            });
            this.props.history.push(`/site-dashboard/${req.data.id}`);
          }
        })
        .catch(() => {
          // console.log(err);
        });
    }
  };

  mapClickHandler = e => {
    this.setState(prevState => ({
      position: {
        ...prevState.position,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      },
    }));
  };

  onSelectChangeHandler = (e, data) => {
    const { value } = e.target;
    if (data === 'regions') {
      this.setState({
        regionselected: value,
      });
    } else if (data === 'site_types') {
      this.setState({
        Selectedtypes: value,
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
        show: true,
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

  handleCheckboxChange = e => {
    const { checked } = e.target;
    this.setState(prevState => ({
      project: {
        ...prevState.project,
        cluster_sites: checked,
      },
    }));
  };

  ondynamiChangeHandler = e => {
    const {
      target: { name, value },
    } = e;
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        [name]: value,
      },
    }));
  };

  // onchange = e => {
  //   this.setState({
  //     selectedGender: e.target.value,
  //   });
  // };

  selectedValue = data => {
    this.setState({
      dataSelected: data,
    });
  };

  selectform = data => {
    if (data.question_type === 'Text') {
      return (
        <div className="col-xl-4 col-md-6">
          <InputElement
            formType="editForm"
            tag="input"
            type={data.question_type}
            id={data.id}
            label={data.question_text}
            name={data.question_name}
            value={this.state.data[data.question_name] || ''}
            placeholder={data.question_placeholder}
            changeHandler={this.ondynamiChangeHandler}
          />
          <span>{data.question_help}</span>
        </div>
      );
    }
    if (data.question_type === 'Date') {
      return (
        <div className="col-xl-4 col-md-6">
          <InputElement
            formType="editForm"
            tag="input"
            type="text"
            id={data.id}
            label={data.question_text}
            name={data.question_name}
            value={this.state.data[data.question_name] || ''}
            placeholder={data.question_placeholder}
            changeHandler={this.ondynamiChangeHandler}
          />
          <span>{data.question_help}</span>
        </div>
      );
    }
    if (data.question_type === 'MCQ') {
      return (
        <div className="form-group col-xl-4 col-md-6">
          <label>{data.question_text}</label>
          <select
            className="form-control"
            onChange={this.ondynamiChangeHandler}
            name={data.question_name}
            style={{ border: '0', borderBottom: '1px solid #eaeaea' }}
          >
            {data.mcq_options.map(option => {
              return (
                <Fragment key={option.id}>
                  <option value={option.option_text}>
                    {option.option_text}
                  </option>
                </Fragment>
              );
            })}
          </select>
          <span>{data.question_help}</span>
        </div>
      );
    }
    if (data.question_type === 'Number') {
      return (
        <div className="col-xl-4 col-md-6">
          <InputElement
            formType="editForm"
            tag="input"
            type={data.question_type}
            id={data.id}
            label={data.question_text}
            name={data.question_name}
            value={this.state.data[data.question_name] || ''}
            placeholder={data.question_placeholder}
            changeHandler={this.ondynamiChangeHandler}
          />
          <span>{data.question_help}</span>
        </div>
      );
    }
    if (data.question_type === 'Link') {
      return (
        <Select
          data={data.project_id}
          onchange={this.ondynamiChangeHandler}
          value={this.state.data[data.id] || ''}
          type={data.question_text}
          selectedValue={this.selectedValue}
          name={data.question_name}
        />
      );
    }
    return null;
  };

  render() {
    const {
      onChangeHandler,
      onSubmitHandler,
      mapClickHandler,
      onSelectChangeHandler,
      readFile,
      closeModal,
      handleCheckboxChange,
      state: {
        project: {
          name,
          site_id,
          phone,
          address,
          publicDescription,
          cluster_sites,
        },
        region,
        position: { latitude, longitude },
        cropResult,
        showCropper,
        isLoading,
        breadcrumbs,
        loaded,
        jsondata,
        site_types,
        regionselected,
        Selectedtypes,
      },
    } = this;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          {breadcrumbs && Object.keys(breadcrumbs).length > 0 && (
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href={breadcrumbs.name_url}>{breadcrumbs.name}</a>
              </li>
              <li className="breadcrumb-item">
                {breadcrumbs.current_page}
              </li>
            </ol>
          )}
        </nav>
        <RightContentCard title="app.siteForm">
          <form className="edit-form" onSubmit={onSubmitHandler}>
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  required
                  label="app.id"
                  name="site_id"
                  value={site_id}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  required
                  label="app.name"
                  name="name"
                  value={name}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              {region.length > 0 ? (
                this.props.page === 'CreateSite' ||
                this.props.page === 'subSite' ? (
                  <div className="col-xl-4 col-md-6">
                    <SelectElement
                      className="form-control"
                      label="app.regions"
                      translation
                      options={
                        region.length > 0
                          ? region.map(regions => regions)
                          : region
                      }
                      changeHandler={e => {
                        onSelectChangeHandler(e, 'regions');
                      }}
                      value={regionselected && regionselected}
                    />
                  </div>
                ) : (
                  ''
                )
              ) : (
                ''
              )}

              <div className="col-xl-4 col-md-6">
                <SelectElement
                  className="form-control"
                  label="app.siteType"
                  translation
                  options={
                    site_types.length > 0
                      ? site_types.map(site_type => site_type)
                      : site_types
                  }
                  changeHandler={e => {
                    onSelectChangeHandler(e, 'site_types');
                  }}
                  value={Selectedtypes}
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  required={false}
                  label="app.phone"
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
                  required={false}
                  label="app.address"
                  name="address"
                  value={address}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <div className="form-group">
                  <CheckBox
                    checked={this.state.project.cluster_sites || ''}
                    label="app.enableSubsites"
                    value={cluster_sites}
                    changeHandler={handleCheckboxChange}
                    translation
                  />
                </div>
              </div>
              {this.props.page === 'subSite' ? (
                <div className="col-xl-4 col-md-6">
                  <InputElement
                    formType="editForm"
                    tag="input"
                    type="number"
                    required={false}
                    label="app.weight"
                    name="weight"
                    value={this.state.weight}
                    changeHandler={e => {
                      this.setState({ weight: e.target.value });
                    }}
                    translation
                  />
                </div>
              ) : (
                ''
              )}
              <div className="col-xl-4 col-md-6">
                <div className="form-group">
                  <InputElement
                    formType="editForm"
                    tag="input"
                    type="text"
                    required={false}
                    label="app.description"
                    name="publicDescription"
                    value={publicDescription}
                    changeHandler={onChangeHandler}
                    translation
                  />
                </div>
              </div>
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

              <div className="col-xl-4 col-md-6">
                <div className="form-group">
                  <label>
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
                                alt=""
                              />
                            </div>

                            <div {...getRootProps()}>
                              <input
                                {...getInputProps()}
                                multiple={false}
                              />
                              <div className="upload-icon" />

                              <button
                                className="fieldsight-btn"
                                type="button"
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
                                    <button
                                      className="fieldsight-btn"
                                      type="button"
                                    >
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
              {jsondata.map(data => {
                return (
                  <Fragment key={data.id}>
                    {this.selectform(data)}
                  </Fragment>
                );
              })}
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
            <Modal title="app.preview" toggleModal={closeModal}>
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

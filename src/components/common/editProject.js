import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import { FormattedMessage } from 'react-intl';
import 'leaflet/dist/leaflet.css';

import Modal from '../common/Modal';
import InputElement from '../common/InputElement';
import SelectElement from '../common/SelectElement';
import RightContentCard from '../common/RightContentCard';
import CheckBox from '../common/CheckBox';
import Loader from '../common/Loader';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

class EditProject extends Component {
  state = {
    data: '',
  };

  imageCroper = () => {
    const { cropImage } = this.props;
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.setState(
      {
        data: this.cropper.getCroppedCanvas().toDataURL(),
      },
      () => {
        cropImage(this.state.data);
      },
    );
  };

  render() {
    const {
      onChangeHandler,
      onSubmitHandler,
      sector,
      selectedSector,
      name,
      phone,
      email,
      address,
      website,
      donor,
      public_desc,
      cluster_sites,
      onSelectChangeHandler,
      selectedSubSector,
      handleCheckbox,
      latitude,
      longitude,
      zoom,
      mapClickHandler,
      cropResult,
      showCropper,
      closeModal,
      src,
      isLoading,
      subSectors,
      readFile,
      title,
    } = this.props;

    return (
      <RightContentCard title={title}>
        <form className="edit-form" onSubmit={onSubmitHandler}>
          <div className="row">
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
            <div className="col-xl-4 col-md-6">
              <SelectElement
                className="form-control"
                label="app.sector"
                options={
                  sector.length > 0
                    ? sector.map(sect => sect)
                    : sector
                }
                changeHandler={onSelectChangeHandler}
                value={selectedSector && selectedSector}
                translation
              />
            </div>
            <div className="col-xl-4 col-md-6">
              <SelectElement
                className="form-control"
                label="app.subSector"
                translation
                options={
                  subSectors.length > 0
                    ? subSectors.map(subSect => subSect)
                    : subSectors
                }
                changeHandler={e =>
                  onSelectChangeHandler(e, 'subSect')
                }
                value={selectedSubSector && selectedSubSector}
              />
            </div>
            <div className="col-xl-4 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required={false}
                label="app.Phone"
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
                type="email"
                required={false}
                label="app.email"
                name="email"
                value={email}
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
              <div className="form-group">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  label="app.donor"
                  name="donor"
                  value={donor}
                  changeHandler={onChangeHandler}
                  translation
                />
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="form-group">
                <CheckBox
                  checked={cluster_sites || ''}
                  label="app.enable/disable"
                  changeHandler={handleCheckbox}
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
                    zoom={zoom}
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
                              src={cropResult}
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
                      src={src}
                      ref={cropper => (this.cropper = cropper)}
                    />
                    <button
                      className="fieldsight-btn"
                      style={{ marginTop: '15px' }}
                      onClick={this.imageCroper}
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
}

export default EditProject;

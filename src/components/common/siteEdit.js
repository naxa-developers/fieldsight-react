import React, { Component, Fragment } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import Dropzone from "react-dropzone";
import Cropper from "react-cropper";
import Modal from "../common/Modal";
import InputElement from "../common/InputElement";
import SelectElement from "../common/SelectElement";
import RightContentCard from "../common/RightContentCard";
import Loader from "../common/Loader";
import CheckBox from "../common/CheckBox";
import Select from "../siteAdd/Select";

import { errorToast, successToast } from "../../utils/toastHandler";
import { RegionContext } from "../../context";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default class SiteAdd extends Component {
  state = {
    data: ""
  };
  cropImage = () => {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.setState(
      {
        data: this.cropper.getCroppedCanvas().toDataURL()
      },
      () => {
        this.props.cropImage(this.state.data);
      }
    );
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
      ondynamiChangeHandler,
      handleDelete,
      deleteClose,
      deleteFile,
      project: {
        project: {
          name,
          site_id,
          phone,
          address,
          public_desc,
          logo,
          weight,
          cluster_sites
        },
        position: { latitude, longitude },
        region,
        cropResult,
        zoom,
        src,
        showCropper,
        isLoading,

        jsondata,
        site_types,
        data,
        regionselected,
        selectdata,
        selectedGender,
        Selectedtypes,
        deleteConfirm
      }
    } = this.props;
    // console.log(jsondata, "jsondata");

    return (
      <RightContentCard title=" Site Form">
        <div
          style={{
            display: "flex",
            justifyContent: " flex-end",
            position: "absolute",
            right: "35px",
            top: "4px"
          }}
        >
          {this.props.delete_perm === true ? (
            <a
              className="fieldsight-btn rejected-btn"
              style={{ boxShadow: "none" }}
              onClick={handleDelete}
            >
              Delete
            </a>
          ) : (
            ""
          )}
        </div>
        <form className="edit-form" onSubmit={onSubmitHandler}>
          <div className="row">
            <div className="col-xl-4 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required={true}
                label="ID"
                name="site_id"
                value={site_id}
                changeHandler={onChangeHandler}
              />
            </div>
            <div className="col-xl-4 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required={true}
                label="Name"
                name="name"
                value={name}
                changeHandler={onChangeHandler}
              />
            </div>

            {this.props.region !== undefined ? (
              <div className="col-xl-4 col-md-6">
                <SelectElement
                  className="form-control"
                  label="Regions"
                  options={
                    !!region && region.length > 0
                      ? region.map(region => region)
                      : []
                  }
                  changeHandler={e => onSelectChangeHandler(e, "regions")}
                  value={regionselected}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-xl-4 col-md-6">
              <SelectElement
                className="form-control"
                label="Types"
                options={
                  site_types && site_types.length > 0
                    ? site_types.map(region => region)
                    : site_types
                }
                changeHandler={e => onSelectChangeHandler(e, "site_types")}
                value={Selectedtypes}
              />
            </div>
            <div className="col-xl-4 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required={false}
                label="Phone"
                name="phone"
                value={phone}
                changeHandler={onChangeHandler}
              />
            </div>
            <div className="col-xl-4 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required={false}
                label="Address"
                name="address"
                value={address}
                changeHandler={onChangeHandler}
              />
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="form-group">
                <CheckBox
                  checked={cluster_sites || ""}
                  label="Enable subsites"
                  changeHandler={handleCheckboxChange}
                  value={cluster_sites}
                />
              </div>
            </div>
            {weight !== undefined ? (
              <div className="col-xl-4 col-md-6">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="number"
                  required={false}
                  label="Weight"
                  name="weight"
                  value={weight}
                  changeHandler={onChangeHandler}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-xl-4 col-md-6">
              <div className="form-group">
                <InputElement
                  formType="editForm"
                  tag="input"
                  type="text"
                  required={false}
                  label="Description"
                  name="public_desc"
                  value={public_desc}
                  changeHandler={onChangeHandler}
                />
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="form-group">
                <label>
                  Map <sup>*</sup>
                </label>

                <div className="map-form">
                  <Map
                    style={{ height: "205px", marginTop: "1rem" }}
                    center={[latitude, longitude]}
                    zoom={this.props.zoom}
                    onClick={mapClickHandler}
                  >
                    <TileLayer
                      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[latitude, longitude]}>
                      <Popup>
                        <b>Name: </b>
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
                        required={true}
                        label="Latitude"
                        name="latitude"
                        value={latitude}
                        changeHandler={e => onChangeHandler(e, "latitude")}
                      />
                    </div>

                    <div className="lat-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="number"
                        required={true}
                        label="Longitude"
                        name="longitude"
                        value={longitude}
                        changeHandler={e => onChangeHandler(e, "longitude")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-md-6">
              <div className="form-group">
                <label> {cropResult ? "Preview" : "Attach File"}</label>

                {cropResult ? (
                  <Dropzone onDrop={acceptedFile => readFile(acceptedFile)}>
                    {({ getRootProps, getInputProps }) => {
                      return (
                        <section>
                          <div className="upload-form">
                            <img
                              src={this.props.cropResult}
                              alt="Cropped Image"
                            />
                          </div>

                          <div {...getRootProps()}>
                            <input {...getInputProps()} multiple={false} />
                            <div className="upload-icon" />

                            <button className="fieldsight-btn">
                              Upload
                              <i className="la la-cloud-upload" />
                            </button>
                          </div>
                        </section>
                      );
                    }}
                  </Dropzone>
                ) : (
                  <Dropzone onDrop={acceptedFile => readFile(acceptedFile)}>
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
                                  <h3>Drag & Drop an image</h3>
                                  <button className="fieldsight-btn">
                                    Upload
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

            {!!this.props.jsondata &&
              this.props.jsondata.map((data, key) => {
                return (
                  <Fragment key={key}>
                    {data.question_type === "Text" ? (
                      <div className="col-xl-4 col-md-6">
                        <InputElement
                          formType="editForm"
                          tag="input"
                          type={data.question_type}
                          id={data.id}
                          label={data.question_text}
                          name={data.question_name}
                          value={this.props.project_info[data.question_name]}
                          placeholder={data.question_placeholder}
                          changeHandler={ondynamiChangeHandler}
                        />
                        <span>{data.question_help}</span>
                      </div>
                    ) : (
                      ""
                    )}
                    {data.question_type === "Date" ? (
                      <div className="col-xl-4 col-md-6">
                        <InputElement
                          formType="editForm"
                          tag="input"
                          type="text"
                          id={data.id}
                          label={data.question_text}
                          name={data.question_name}
                          value={this.props.project_info[data.question_name]}
                          placeholder={data.question_placeholder}
                          changeHandler={ondynamiChangeHandler}
                        />
                        <span>{data.question_help}</span>
                      </div>
                    ) : (
                      ""
                    )}
                    {data.question_type === "MCQ" ? (
                      <div className="form-group col-xl-4 col-md-6">
                        <label>{data.question_text}</label>
                        <select
                          className="form-control"
                          onChange={ondynamiChangeHandler}
                          name={data.question_name}
                          value={this.props.project_info[data.question_name]}
                          style={{
                            border: "0",
                            borderBottom: "1px solid #eaeaea"
                          }}
                        >
                          {data.mcq_options.map((option, key) => {
                            return (
                              <Fragment key={key}>
                                <option value={option.option_text}>
                                  {option.option_text}
                                </option>
                              </Fragment>
                            );
                          })}
                        </select>
                        <span>{data.question_help}</span>
                      </div>
                    ) : (
                      ""
                    )}
                    {data.question_type === "Number" ? (
                      <div className="col-xl-4 col-md-6">
                        <InputElement
                          formType="editForm"
                          tag="input"
                          type={data.question_type}
                          id={data.id}
                          label={data.question_text}
                          name={data.question_name}
                          value={this.props.project_info[data.question_name]}
                          placeholder={data.question_placeholder}
                          changeHandler={ondynamiChangeHandler}
                        />
                        <span>{data.question_help}</span>
                      </div>
                    ) : (
                      ""
                    )}

                    {data.question_type === "Link" ? (
                      <Select
                        data={data.project_id}
                        //onchange={ondynamiChangeHandler}
                        value={this.props.project_info[data.question_name]}
                        type={data.question_text}
                        name={data.question_name}
                        selectedValue={this.props.selectedValue}
                      />
                    ) : (
                      ""
                    )}
                  </Fragment>
                );
              })}
            <div className="col-sm-12">
              <button type="submit" className="fieldsight-btn pull-right">
                Save
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
                      src={this.props.src}
                      ref={cropper => {
                        this.cropper = cropper;
                      }}
                    />
                    <button
                      className="fieldsight-btn"
                      style={{ marginTop: "15px" }}
                      onClick={this.cropImage}
                    >
                      Save Image
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
                        width: "100%",
                        height: 400,
                        overflow: "hidden"
                      }}
                    />
                  </figure>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {deleteConfirm && (
          <Modal
            title={"Are you sure you want to delete " + name + " ?"}
            toggleModal={deleteClose}
          >
            <div className="warning">
              <h3 style={{ color: "red" }}>Warning</h3>
              <p>
                All the form submissions and user roles within the site will be
                completely removed.Do you still want to continue?
              </p>
            </div>
            <div className="warning-footer text-center">
              <a className="fieldsight-btn rejected-btn" onClick={deleteClose}>
                cancel
              </a>
              <a className="fieldsight-btn" onClick={deleteFile}>
                confirm
              </a>
            </div>
          </Modal>
        )}

        {isLoading && <Loader loaded={loaded} />}
      </RightContentCard>
    );
  }
}

import React, { Component } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import Dropzone from "react-dropzone";
import Cropper from "react-cropper";
import Modal from "../common/Modal";
import InputElement from "../common/InputElement";
import SelectElement from "../common/SelectElement";
import RightContentCard from "../common/RightContentCard";
import CheckBox from "../common/CheckBox";
import Loader from "../common/Loader";
import { errorToast, successToast } from "../../utils/toastHandler";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const teams = [
  { team: "Govenmet" },
  { team: "local ngo" },
  { team: "ingo" },
  { team: "academic" },
  { team: "multinational" }
];
const countries = [
  { name: "Nepal" },
  { name: "China" },
  { name: "India" },
  { name: "Thailand" },
  { name: "Japan" }
];
class EditTeam extends Component {
  _isMounted = false;

  state = {
    team: {
      name: "",
      type: "",
      address: "",
      email: "",
      phone: "",
      website: "",
      country: "",
      public_desc: "",
      logo: ""
    },
    loaded: 0,
    position: {
      latitude: "",
      longitude: ""
    },
    zoom: 13,
    src: "",
    showCropper: false,
    cropResult: "",
    isLoading: false
  };

  requestHandler = () => {
    const {
      state: {
        team: {
          name,
          type,
          phone,
          email,
          address,
          website,
          public_desc,
          country,
          logo,
          organization
        },
        position: { latitude, longitude },
        cropResult
      },
      props: {
        match: {
          params: { id: teamId }
        }
      }
    } = this;

    const team = {
      name,
      type,
      phone,
      email,
      address,
      website,
      country,
      public_desc,
      ...(cropResult && { logo: cropResult }),
      latitude,
      longitude,
      organization
    };

    // axios
    //   .put(`${urls[0]}${projectId}/`, project, {
    //     onUploadProgress: progressEvent => {
    //       this.setState({
    //         loaded: Math.round(
    //           (progressEvent.loaded * 100) / progressEvent.total
    //         )
    //       });
    //     }
    //   })
    //   .then(res => {
    //     this.setState(
    //       {
    //         isLoading: false,
    //         loaded: 0
    //       },
    //       () => successToast("Project", "updated")
    //     );
    //   })
    //   .catch(err => {
    //     this.setState(
    //       {
    //         isLoading: false
    //       },
    //       errorToast
    //     );
    //   });
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true
      },
      this.requestHandler
    );
  };

  onChangeHandler = (e, position) => {
    const { name, value } = e.target;
    if (position) {
      return this.setState({
        position: {
          ...this.state.position,
          [name]: value
        }
      });
    }
    this.setState({
      team: {
        ...this.state.team,
        [name]: value
      }
    });
  };

  readFile = file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result, showCropper: true });
    };
    reader.readAsDataURL(file[0]);
  };

  cropImage = () => {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.setState({
      cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      showCropper: false,
      src: ""
    });
  };

  closeModal = () => {
    this.setState({
      showCropper: false
    });
  };

  mapClickHandler = e => {
    this.setState({
      position: {
        ...this.state.position,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }
    });
  };

  onSelectChangeHandler = e => {
    const { value } = e.target;
    this.setState({
      [e.target.name]: value
    });
  };

  render() {
    const {
      state: {
        loaded,
        team: {
          name,
          type,
          phone,
          email,
          address,
          website,
          country,
          public_desc,
          logo
        },
        position: { latitude, longitude },
        showCropper,
        cropResult,
        isLoading
      },
      onChangeHandler,
      onSelectChangeHandler,
      onSubmitHandler,
      handleCheckboxChange,
      readFile,
      closeModal,
      mapClickHandler
    } = this;
    return (
      <RightContentCard title="Edit Team">
        <form className="edit-form" onSubmit={onSubmitHandler}>
          <div className="row">
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required={true}
                label="Team Name"
                name="name"
                value={name}
                changeHandler={onChangeHandler}
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <SelectElement
                className="form-control"
                label="Type of Team"
                name="type"
                options={teams.map(team => team.team)}
                changeHandler={e => onSelectChangeHandler(e)}
                value={type && type}
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="number"
                // required={true}
                label="Contact Number"
                name="phone"
                value={phone}
                changeHandler={onChangeHandler}
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="email"
                // required={true}
                label="Email"
                name="email"
                value={email}
                changeHandler={onChangeHandler}
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                // required={true}
                label="Website"
                name="website"
                value={website}
                changeHandler={onChangeHandler}
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <SelectElement
                className="form-control"
                label="Country"
                name="country"
                options={countries.map(each => each.name)}
                changeHandler={e => onSelectChangeHandler(e)}
                value={country && country}
                required={true}
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                // required={true}
                label="Address"
                name="address"
                value={address}
                changeHandler={onChangeHandler}
              />
            </div>
            <div className="col-xl-6 col-md-6">
              <InputElement
                formType="editForm"
                tag="input"
                type="text"
                required={true}
                label="Description"
                name="public_desc"
                value={public_desc}
                changeHandler={onChangeHandler}
              />
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
                    zoom={this.state.zoom}
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
                <label> {cropResult ? "Logo" : "Attach File"}</label>
                {cropResult ? (
                  <Dropzone onDrop={acceptedFile => readFile(acceptedFile)}>
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
                      src={this.state.src}
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
        {isLoading && <Loader loaded={loaded} />}
      </RightContentCard>
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}
export default EditTeam;

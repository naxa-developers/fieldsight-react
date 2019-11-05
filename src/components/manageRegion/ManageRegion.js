import React, { Component, Fragment } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import InputElement from "../common/InputElement";
import RightContentCard from "../common/RightContentCard";
import Loader from "../common/Loader";
import WithContext from "../../hoc/WithContext";
import isEmpty from "../../utils/isEmpty";
import axios from "axios";
import { RegionContext } from "../../context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class ManageRegion extends Component {
  static contextType = RegionContext;

  state = {
    hide: "",
    response: "",
    model: false,
    cluster_sites: ""
  };
  componentDidMount() {
    const { projectId } = this.context;

    axios
      .get(`/fv3/api/enable-project-cluster-sites/${projectId}/`)
      .then(res => {
        console.log(res.data.cluster_sites, "cluster_sites");

        this.setState({
          cluster_sites: !res.data.cluster_sites,
          hide: res.data.cluster_sites
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  region = () => {
    const { projectId } = this.context;

    let data = {};
    data.cluster_sites = this.state.cluster_sites;
    data.Project = projectId;

    !this.state.model
      ? axios
          .post(`/fv3/api/enable-project-cluster-sites/${projectId}/`, data)
          .then(res => {
            this.setState({
              hide: !this.state.hide,
              response: res.data.detail,
              model: true,
              cluster_sites: res.data.cluster_sites
            });
          })
          .catch(err => {
            console.log(err);
          })
      : axios
          .post(`/fv3/api/enable-project-cluster-sites/${projectId}/`, data)
          .then(res => {
            this.setState({
              hide: !this.state.hide,
              response: res.data.detail,
              model: false,
              cluster_sites: res.data.cluster_sites
            });
          })
          .catch(err => {
            console.log(err);
          });
  };

  toast() {
    toast.success(this.state.response);
  }
  render() {
    const {
      props: {
        value: {
          terms,
          isLoading,
          selectedIdentifier,
          selectedName,
          showModal,
          showDeleteConfirmation,
          region,
          toggleModal,
          onChangeHandler,
          editHandler,
          removeHandler,
          confirmHandler,
          cancelHandler,
          onSubmitHandler,
          selectRegionHandler
        }
      }
    } = this;

    const tableHeader = {
      manageRegions: !isEmpty(terms)
        ? [
            `${terms.region} ID`,
            `${terms.region} Name`,
            ,
            "Created Date",
            "Action"
          ]
        : ["Region ID", "Region Name", "Created Date", "Action"]
    };

    return (
      <Fragment>
        <RightContentCard
          title={!isEmpty(terms) ? `${terms.region}` : "Regions"}
          addButton
          toggleModal={toggleModal}
        >
          <div
            className="add-btn"
            style={{
              justifyContent: "flex-end",
              position: "relative",
              bottom: "52px",
              marginRight: "44px"
            }}
          >
            {this.state.hide ? (
              <button
                type="button"
                className="btn-toggle"
                onClick={this.region}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  textAlign: "left",
                  width: "83px"
                }}
              >
                Turn OFF
                <div
                  className="handle"
                  style={{ left: "auto", right: "0.1875rem" }}
                ></div>
              </button>
            ) : (
              <button
                type="button"
                className="btn-toggle"
                onClick={this.region}
                style={{
                  width: "83px"
                }}
              >
                Turn ON
                <div className="handle"></div>
              </button>
            )}
          </div>
          <Table
            page="manageRegion"
            tableHeader={tableHeader.manageRegions}
            tableRow={region}
            removeHandler={removeHandler}
            editHandler={editHandler}
            selectRegionHandler={selectRegionHandler}
          />
        </RightContentCard>

        {showModal && (
          <Modal
            title={!isEmpty(terms) ? `${terms.region}` : "Regions"}
            toggleModal={toggleModal}
          >
            <form className="floating-form" onSubmit={onSubmitHandler}>
              <InputElement
                tag="input"
                type="text"
                required={true}
                label="ID"
                formType="floatingForm"
                htmlFor="input"
                name="selectedIdentifier"
                value={selectedIdentifier}
                changeHandler={onChangeHandler}
              />
              <InputElement
                tag="textarea"
                type="text"
                required={true}
                label="Name"
                formType="floatingForm"
                htmlFor="textarea"
                name="selectedName"
                value={selectedName}
                changeHandler={onChangeHandler}
              />{" "}
              <div className="form-group pull-right no-margin">
                <button type="submit" className="fieldsight-btn">
                  Save
                </button>
              </div>
            </form>
          </Modal>
        )}
        {isLoading && <Loader />}

        {showDeleteConfirmation && (
          <Modal title="Warning" toggleModal={cancelHandler}>
            <div className="warning">
              <i className="la la-exclamation-triangle" />

              <p>
                Are you sure you want to delete{" "}
                {!isEmpty(terms) ? `${terms.region}` : "Regions"} ?
              </p>
            </div>
            <div className="warning-footer text-center">
              <a
                className="fieldsight-btn rejected-btn"
                onClick={cancelHandler}
              >
                cancel
              </a>
              <a className="fieldsight-btn" onClick={confirmHandler}>
                confirm
              </a>
            </div>
          </Modal>
        )}
        {this.state.model && this.toast()}

        {/*this.state.model && (
          <Modal title="response" toggleModal={this.closeModel}>
            <p>{this.state.response}</p>
          </Modal>
        )*/}
      </Fragment>
    );
  }
}

export default WithContext(ManageRegion);

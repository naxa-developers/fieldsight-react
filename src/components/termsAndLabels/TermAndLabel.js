import React, { Component, Fragment } from "react";
import axios from "axios";
import InputElement from "../common/InputElement";
import RightContentCard from "../common/RightContentCard";
import Table from "../common/Table";
import Loader, { DotLoader } from "../common/Loader";

import { successToast, errorToast } from "../../utils/toastHandler";
import { RegionContext } from "../../context";
import isEmpty from "../../utils/isEmpty";

const tableHeader = {
  termsAndLabels: ["Terms And Labels", "Changed To"]
};

const url = "fv3/api/project-terms-labels/";

export default class TermAndLabel extends Component {
  static contextType = RegionContext;

  state = {
    termsAndLabels: {
      id: "",
      donor: "",
      site: "",
      site_supervisor: "",
      site_reviewer: "",
      region: "",
      region_supervisor: "",
      region_reviewer: "",
      //project: window.project_id ? window.project_id : 137
      project: window.project_id
    },
    showList: true,
    isLoading: false
    // dotLoader: true
  };

  requestHandler = async () => {
    try {
      const {
        state: {
          termsAndLabels: {
            id,
            donor,
            site,
            site_supervisor,
            site_reviewer,
            region,
            region_supervisor,
            region_reviewer,
            project
          }
        },
        context: { updateTerms }
      } = this;

      const termsAndLabels = {
        donor,
        site,
        site_supervisor,
        site_reviewer,
        region,
        region_supervisor,
        region_reviewer,
        project
      };

      if (id) {
        await axios.put(`${url}${id}/`, termsAndLabels);
        await this.setState({
          isLoading: false,
          showList: true
        });

        successToast("Terms and Labels", "updated");
        return updateTerms(termsAndLabels);
      }

      await axios.post(`${url}?project=${project}`, termsAndLabels);
      await this.setState({
        isLoading: false,
        showList: true
      });
      successToast("Terms and Labels", "added");
      updateTerms(termsAndLabels);
    } catch (error) {
      await this.setState({
        isLoading: false
      });
      errorToast();
    }
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

  onChangeHandler = e => {
    const { name, value } = e.target;

    this.setState({
      termsAndLabels: {
        ...this.state.termsAndLabels,
        [name]: value
      }
    });
  };

  componentDidMount() {
    const { projectId, terms } = this.context;

    if (!isEmpty(terms)) {
      this.setState({
        termsAndLabels: { ...terms, project: projectId }
      });
    }
  }

  componentDidUpdate() {
    const {
      state: {
        termsAndLabels: { project, ...restLabels }
      },
      context: { projectId, terms }
    } = this;

    const isStateTermsEmpty =
      Object.values(restLabels).filter(Boolean).length === 0;

    if (isStateTermsEmpty && !isEmpty(terms)) {
      this.setState({
        termsAndLabels: { ...terms, project: projectId }
        // dotLoader: false
      });
    }
  }

  editHandler = () => {
    this.setState({
      showList: false
    });
  };

  listHandler = () => {
    this.setState({
      showList: true
    });
  };

  render() {
    const {
      state: {
        termsAndLabels: {
          donor,
          site,
          site_supervisor,
          site_reviewer,
          region,
          region_supervisor,
          region_reviewer
        },
        showList,
        isLoading
        // dotLoader
      },
      listHandler,
      editHandler,
      onChangeHandler,
      onSubmitHandler
    } = this;

    const { id, project, ...restLabels } = this.state.termsAndLabels;

    return (
      <Fragment>
        <RightContentCard title="Terms And Labels">
          {/* {dotLoader && <DotLoader />} */}
          {!showList && (
            <Fragment>
              <form className="edit-form" onSubmit={onSubmitHandler}>
                <div className="row">
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="Donor"
                      name="donor"
                      value={donor}
                      required={false}
                      changeHandler={onChangeHandler}
                    />
                  </div>

                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="Site"
                      name="site"
                      value={site}
                      required={false}
                      changeHandler={onChangeHandler}
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="Site Supervisor"
                      name="site_supervisor"
                      value={site_supervisor}
                      required={false}
                      changeHandler={onChangeHandler}
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="Site Reviewer"
                      name="site_reviewer"
                      value={site_reviewer}
                      required={false}
                      changeHandler={onChangeHandler}
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="Region"
                      name="region"
                      value={region}
                      required={false}
                      changeHandler={onChangeHandler}
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <div className="form-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="text"
                        label="Region Supervisor"
                        name="region_supervisor"
                        value={region_supervisor}
                        required={false}
                        changeHandler={onChangeHandler}
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <div className="form-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="text"
                        label="Region Reviewer"
                        name="region_reviewer"
                        value={region_reviewer}
                        required={false}
                        changeHandler={onChangeHandler}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="display-inline pull-right">
                    <button
                      className="fieldsight-btn"
                      style={{
                        marginRight: "0.5rem",
                        background: "#ccc",
                        color: "#555"
                      }}
                      onClick={listHandler}
                    >
                      See List
                    </button>
                    <button type="submit" className="fieldsight-btn pull-right">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </Fragment>
          )}
          {showList && (
            <Fragment>
              <Table
                page="termsAndLabels"
                tableHeader={tableHeader.termsAndLabels}
                tableRow={Object.entries(restLabels)}
              />
              <button className="fieldsight-btn" onClick={editHandler}>
                Edit
              </button>
            </Fragment>
          )}
        </RightContentCard>
        {isLoading && <Loader />}
      </Fragment>
    );
  }
}

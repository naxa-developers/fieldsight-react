import React, { Component } from "react";
import Select from "react-select";

import InputElement from "../common/InputElement";
import { DeleteModal, WarningModal } from "../common/DeleteModal";
import { warnToast } from "../../utils/toastHandler";

class AddStageForm extends Component {
  state = {
    form: {
      selectedRegion: [],
      selectedType: [],
      name: this.props.stageData ? this.props.stageData.name : "",
      desc: this.props.stageData ? this.props.stageData.description : "",
      order: this.props.stageData ? this.props.stageData.order : null,
      id: this.props.stageData ? this.props.stageData.id : ""
    },
    regionDropdown: [],
    typeDropdown: [],
    hasLoaded: false,
    isDelete: false,
    warning: false
  };
  componentDidMount() {
    const { typeOptions, regionOptions, stageData } = this.props;
    const newRegionArr = regionOptions.map(each => ({
      ...each,
      value: each.identifier,
      label: each.name
    }));
    const newTypeArr = typeOptions.map(each => ({
      ...each,
      value: each.identifier,
      label: each.name
    }));

    let selectedRegion = [];
    let selectedType = [];
    if (Object.keys(stageData).length > 0) {
      if (stageData.regions.length > 0) {
        regionOptions.map(region => {
          if (stageData.regions.indexOf(region.id) > -1) {
            selectedRegion.push({
              ...region,
              value: region.identifier,
              label: region.name
            });
          }
        });
        // } else {
        //   selectedRegion = newRegionArr;
      }

      if (stageData.tags.length > 0) {
        typeOptions.map(type => {
          if (stageData.tags.indexOf(type.id) > -1) {
            selectedType.push({
              ...type,
              value: type.identifier,
              label: type.name
            });
          }
        });
        // } else {
        //   selectedType = newTypeArr;
      }
    } else {
      (selectedRegion = newRegionArr), (selectedType = newTypeArr);
    }
    this.setState({
      hasLoaded: true,
      regionDropdown: newRegionArr,
      typeDropdown: newTypeArr,
      form: {
        ...this.state.form,
        selectedRegion,
        selectedType
      }
    });
  }

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({
      form: {
        ...this.state.form,

        [name]: value
      }
    });
  };
  handleSelectRegionChange = region => {
    this.setState({
      form: {
        ...this.state.form,
        selectedRegion: region
      }
    });
  };
  handleSelectTypeChange = type => {
    this.setState({
      form: {
        ...this.state.form,
        selectedType: type
      }
    });
  };
  handleSubmitForm = e => {
    e.preventDefault();
    this.props.handleSubmit(this.state.form);
  };
  toggleWarning = () => {
    this.setState({ warning: !this.state.warning }, () => {
      if (this.state.warning) {
        warnToast(
          "You need to DELETE or UNDEPLOY all substages to proceed this action!"
        );
      }
    });
  };
  toggleDelete = () => {
    this.setState({ isDelete: !this.state.isDelete }, () => {
      if (this.props.canDeleteStage) this.props.handleDeleteStage();
      else {
        this.toggleWarning();
      }
    });
  };
  render() {
    const {
      state: {
        regionDropdown,
        typeDropdown,
        form: { name, desc, selectedRegion, selectedType },
        hasLoaded,
        isDelete,
        warning
      },
      handleChange,
      handleSelectRegionChange,
      handleSelectTypeChange,
      handleSubmitForm
    } = this;
    const isEdit = Object.keys(this.props.stageData).length > 0 ? true : false;

    return (
      <>
        <form
          className="floating-form "
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <div>
            <InputElement
              formType="editForm"
              tag="input"
              type="text"
              required={true}
              label="Name"
              name="name"
              value={name}
              changeHandler={handleChange}
            />
            {/* </div> */}
            {regionDropdown && regionDropdown.length > 0 && (
              <div>
                <label>Regions</label>
                {hasLoaded && (
                  <Select
                    defaultValue={selectedRegion}
                    isMulti={true}
                    options={regionDropdown}
                    onChange={handleSelectRegionChange}
                  />
                )}
              </div>
            )}
            {typeDropdown && typeDropdown.length > 0 && (
              <div>
                <label>Types</label>
                {hasLoaded && (
                  <Select
                    defaultValue={selectedType}
                    isMulti
                    options={typeDropdown}
                    onChange={handleSelectTypeChange}
                  />
                )}
              </div>
            )}
            <InputElement
              classname="border-0"
              formType="editForm"
              tag="input"
              type="text"
              // required={true}
              label="Description"
              name="desc"
              value={desc}
              changeHandler={handleChange}
            />
          </div>
          {/* <div className="modal-footer"> */}
          <div className="form-group pull-right no-margin">
            {isEdit && (
              <button
                type="button"
                className="fieldsight-btn"
                onClick={this.toggleDelete}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              className="fieldsight-btn"
              onClick={handleSubmitForm}
            >
              Save
            </button>
          </div>
          {/* </div> */}
        </form>
      </>
    );
  }
}
export default AddStageForm;

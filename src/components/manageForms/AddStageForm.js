import React, { Component } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import InputElement from "../common/InputElement";
import RadioElement from "../common/RadioElement";
const animatedComponents = makeAnimated();

class AddStageForm extends Component {
  state = {
    form: {
      selectedRegion: [],
      selectedType: [],
      name: this.props.stageData ? this.props.stageData.name : "",
      desc: this.props.stageData ? this.props.stageData.description : "",
      order: this.props.stageData ? this.props.stageData.order : 0,
      id: this.props.stageData ? this.props.stageData.id : ""
    },
    regionDropdown: [],
    typeDropdown: [],
    hasLoaded: false
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
      if (!!stageData.regions && stageData.regions.length > 0) {
        regionOptions.map(region => {
          if (stageData.regions.indexOf(region.id) > -1) {
            selectedRegion.push({
              ...region,
              value: region.identifier,
              label: region.name
            });
          }
        });
      } else if (stageData.tags && stageData.tags.length > 0) {
        typeOptions.map(type => {
          if (stageData.tags.indexOf(type.id) > -1) {
            selectedType.push({
              ...type,
              value: type.identifier,
              label: type.name
            });
          }
        });
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
  render() {
    const {
      state: {
        regionDropdown,
        typeDropdown,
        form: { name, desc, selectedRegion, selectedType },
        hasLoaded
      },
      handleChange,
      handleSelectRegionChange,
      handleSelectTypeChange,
      handleSubmitForm
    } = this;
    const isEdit = Object.keys(this.props.stageData).length > 0 ? true : false;

    return (
      <form className="floating-form " onSubmit={handleSubmitForm}>
        {/* <div className="form-group"> */}
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
                // closeMenuOnSelect={false}
                onChange={handleSelectRegionChange}
                options={regionDropdown}
                isMulti={true}
                defaultValue={selectedRegion}
                components={animatedComponents}
              />
            )}
          </div>
        )}
        {typeDropdown && typeDropdown.length > 0 && (
          <div>
            <label>Types</label>
            {hasLoaded && (
              <Select
                // closeMenuOnSelect={true}
                components={animatedComponents}
                onChange={handleSelectTypeChange}
                defaultValue={selectedType}
                isMulti
                options={typeDropdown}
              />
            )}
          </div>
        )}
        <InputElement
          formType="editForm"
          tag="input"
          type="text"
          required={true}
          label="Description"
          name="desc"
          value={desc}
          changeHandler={handleChange}
        />
        <div className="form-group pull-right no-margin">
          <button type="submit" className="fieldsight-btn">
            {!!isEdit ? "Save" : "Add"}
          </button>
        </div>
      </form>
    );
  }
}
export default AddStageForm;

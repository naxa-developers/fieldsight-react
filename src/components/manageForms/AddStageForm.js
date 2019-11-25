import React, { Component } from 'react';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';

import InputElement from '../common/InputElement';

class AddStageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        selectedRegion: [],
        selectedType: [],
        name: props.stageData ? props.stageData.name : '',
        desc: props.stageData ? props.stageData.description : '',
        order: props.stageData ? props.stageData.order : null,
        id: props.stageData ? props.stageData.id : '',
      },
      regionDropdown: [],
      typeDropdown: [],
      hasLoaded: false,
    };
  }

  componentDidMount() {
    const { typeOptions, regionOptions, stageData } = this.props;
    const newRegionArr = regionOptions.map(each => ({
      ...each,
      value: each.identifier,
      label: each.name,
    }));
    const newTypeArr = typeOptions.map(each => ({
      ...each,
      value: each.identifier,
      label: each.name,
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
              label: region.name,
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
              label: type.name,
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
        selectedType,
      },
    });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      form: {
        ...this.state.form,

        [name]: value,
      },
    });
  };

  handleSelectRegionChange = region => {
    this.setState({
      form: {
        ...this.state.form,
        selectedRegion: region,
      },
    });
  };

  handleSelectTypeChange = type => {
    this.setState({
      form: {
        ...this.state.form,
        selectedType: type,
      },
    });
  };

  handleSubmitForm = e => {
    e.preventDefault();
    const {
      props: { handleSubmit },
      state: { form },
    } = this;
    handleSubmit(form);
  };

  render() {
    const {
      state: {
        regionDropdown,
        typeDropdown,
        form: { name, desc, selectedRegion, selectedType },
        hasLoaded,
      },
      handleChange,
      handleSelectRegionChange,
      handleSelectTypeChange,
      handleSubmitForm,
    } = this;

    // const isEdit =
    //   Object.keys(this.props.stageData).length > 0 ? true : false;

    return (
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
            required
            label="app.name"
            name="name"
            value={name}
            changeHandler={handleChange}
            translation
          />
          {/* </div> */}
          {regionDropdown && regionDropdown.length > 0 && (
            <div>
              <label>
                <FormattedMessage
                  id="app.regions"
                  defaultMessage="Regions"
                />
              </label>
              {hasLoaded && (
                <Select
                  defaultValue={selectedRegion}
                  isMulti
                  options={regionDropdown}
                  onChange={handleSelectRegionChange}
                />
              )}
            </div>
          )}
          {typeDropdown && typeDropdown.length > 0 && (
            <div>
              <label>
                <FormattedMessage
                  id="app.types"
                  defaultMessage="Types"
                />
              </label>
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
            label="app.description"
            name="desc"
            value={desc}
            changeHandler={handleChange}
            translation
          />
        </div>
        {/* <div className="modal-footer"> */}
        <div className="form-group pull-right no-margin">
          <button
            type="button"
            className="fieldsight-btn"
            onClick={handleSubmitForm}
          >
            <FormattedMessage id="app.save" defaultMessage="Save" />
          </button>
        </div>
        {/* </div> */}
      </form>
    );
  }
}
export default AddStageForm;

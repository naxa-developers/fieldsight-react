import React, { Component } from 'react';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import InputElement from '../common/InputElement';
import RadioElement from '../common/RadioElement';

class AddSubstageForm extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      id: props.formData ? props.formData.id : '',
      em: props.formData ? props.formData.em : null,
      status:
        props.formData && props.formData.default_submission_status
          ? props.formData.default_submission_status
          : 0,
      isDonor:
        props.formData && props.formData.setting
          ? props.formData.setting.donor_visibility
          : true,
      isEdit:
        props.formData && props.formData.setting
          ? props.formData.setting.can_edit
          : true,
      isDelete:
        props.formData && props.formData.setting
          ? props.formData.setting.can_delete
          : true,
      regionSelected: [],
      typeSelected: [],
      weight: props.formData ? props.formData.weight : 0,
      substageTitle:
        props.formData && props.formData.name
          ? props.formData.name
          : '',
      substageDesc:
        props.formData && props.formData.description
          ? props.formData.description
          : '',
      hasLoaded: false,
      order:
        props.formData && props.formData.order
          ? props.formData.order
          : 0,
      settingId:
        props.formData && props.formData.setting
          ? props.formData.setting.id
          : '',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const {
      typeOptions,
      regionOptions,
      formData,
      stagedRegions,
      stagedTypes,
    } = this.props;
    const regionSelected =
      formData && formData.setting && formData.setting.regions;
    const typeSelected =
      formData && formData.setting && formData.setting.types;

    if (this._isMounted) {
      let newRegionArr = [];
      let newTypeArr = [];
      regionOptions.map(each => {
        if (stagedRegions.indexOf(each.id) > -1) {
          newRegionArr.push({
            ...each,
            value: each.identifier,
            label: each.name,
          });
        }
      });

      typeOptions.map(each => {
        if (stagedTypes.indexOf(each.id) > -1) {
          newTypeArr.push({
            ...each,
            value: each.identifier,
            label: each.name,
          });
        }
      });

      let selectedRegion = [];
      let selectedType = [];
      if (formData && formData.setting) {
        if (regionSelected && regionSelected.length > 0) {
          regionOptions.map(region => {
            if (regionSelected.indexOf(region.id) > -1) {
              selectedRegion.push({
                ...region,
                value: region.identifier,
                label: region.name,
              });
            }
          });
        }

        if (typeSelected && typeSelected.length > 0) {
          typeOptions.map(type => {
            if (typeSelected.indexOf(type.id) > -1) {
              selectedType.push({
                ...type,
                value: type.identifier,
                label: type.name,
              });
            }
          });
        }
      } else {
        selectedRegion = newRegionArr;
        selectedType = newTypeArr;
      }

      this.setState({
        hasLoaded: true,
        regionDropdown: newRegionArr,
        typeDropdown: newTypeArr,
        regionSelected: selectedRegion,
        typeSelected: selectedType,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleClearState = () => {
    const { handleToggleForm } = this.props;
    this.setState(
      {
        status: 0,
        isDonor: true,
        isEdit: true,
        isDelete: true,
        regionSelected: [],
        typeSelected: [],
        weight: 0,
        substageTitle: '',
        substageDesc: '',
        hasLoaded: false,
      },
      () => {
        handleToggleForm();
      },
    );
  };

  handleRadioChange = e => {
    const { name, value } = e.target;

    this.setState(state => {
      if (name == 'status') {
        return {
          status: value,
        };
      } else if (name == 'donor') {
        return {
          isDonor: JSON.parse(value),
        };
      } else if (name == 'edit') {
        return {
          isEdit: JSON.parse(value),
        };
      } else if (name == 'delete') {
        return {
          isDelete: JSON.parse(value),
        };
      }
    });
  };

  handleSelectRegionChange = region => {
    this.setState(state => {
      return {
        regionSelected: region,
      };
    });
  };

  handleSelectTypeChange = type => {
    this.setState(state => {
      return {
        typeSelected: type,
      };
    });
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleCreateForm } = this.props;

    handleCreateForm(this.state);
  };

  render() {
    const {
      props: { toggleFormModal, formTitle, isEditForm },
      state: {
        regionDropdown,
        regionSelected,
        typeDropdown,
        typeSelected,
        status,
        isDonor,
        isEdit,
        isDelete,
        weight,
        substageTitle,
        substageDesc,
        hasLoaded,
      },
    } = this;

    return (
      <>
        <form className="floating-form" onSubmit={this.handleSubmit}>
          <div className="form-form">
            <InputElement
              classname="border-0"
              formType="editForm"
              tag="input"
              type="text"
              required
              label="app.name"
              name="substageTitle"
              value={substageTitle}
              changeHandler={this.handleInputChange}
              translation
            />
            <InputElement
              classname="border-0"
              formType="editForm"
              tag="input"
              type="text"
              //   required
              label="app.description"
              name="substageDesc"
              value={substageDesc}
              changeHandler={this.handleInputChange}
              translation
            />
            <div className="selected-form">
              <div className="selected-text">
                <span>{formTitle}</span>
              </div>

              <div className="add-btn flex-start">
                <a data-tab="choose-form" onClick={toggleFormModal}>
                  {!!isEditForm || formTitle
                    ? 'Change form'
                    : ' Choose form'}
                  {!formTitle && (
                    <sup style={{ color: '#ed5261' }}>*</sup>
                  )}
                  <span>
                    <i className="la la-file-text-o"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <InputElement
            classname="border-0"
            formType="editForm"
            tag="input"
            type="number"
            // required
            label="app.weight"
            name="weight"
            value={weight}
            changeHandler={this.handleInputChange}
            translation
          />

          <div className="form-group flexrow checkbox-group">
            <label>
              <FormattedMessage
                id="app.defaultSubmissionMession"
                defaultMessage="Default submission status"
              />
            </label>
            <div className="custom-checkbox display-inline">
              <RadioElement
                label="app.approved"
                className="approved"
                name="status"
                value={3}
                changeHandler={this.handleRadioChange}
                checked={status == 3}
                translation
              />
              <RadioElement
                label="app.pending"
                className="pending"
                name="status"
                value={0}
                changeHandler={this.handleRadioChange}
                checked={status == 0}
                translation
              />
              <RadioElement
                label="app.flagged"
                className="flagged"
                name="status"
                value={2}
                changeHandler={this.handleRadioChange}
                checked={status == 2}
                translation
              />
              <RadioElement
                label="app.rejected"
                className="rejected"
                name="status"
                value={1}
                changeHandler={this.handleRadioChange}
                checked={status == 1}
                translation
              />
            </div>
          </div>
          <div>
            <label>
              <FormattedMessage
                id="app.regions"
                defaultMessage="Regions"
              />
            </label>
            {hasLoaded && (
              <Select
                defaultValue={regionSelected}
                isMulti
                options={regionDropdown}
                onChange={this.handleSelectRegionChange}
              />
            )}
          </div>
          <div>
            <label>
              <FormattedMessage
                id="app.types"
                defaultMessage="Types"
              />
            </label>
            {hasLoaded && (
              <Select
                defaultValue={typeSelected}
                isMulti
                options={typeDropdown}
                onChange={this.handleSelectTypeChange}
              />
            )}
          </div>
          {/* <div className="form-group checkbox-group">
            <label>Donor visibility</label>
            <div className="custom-checkbox display-inline">
              <RadioElement
                label="Yes"
                name="donor"
                changeHandler={this.handleRadioChange}
                value={true}
                checked={isDonor == true}
              />
              <RadioElement
                label="No"
                name="donor"
                changeHandler={this.handleRadioChange}
                value={false}
                checked={isDonor == false}
              />
            </div>
          </div>
          <div className="form-group checkbox-group">
            <label>Can edit submission ?</label>
            <div className="custom-checkbox display-inline">
              <RadioElement
                label="Yes"
                name="edit"
                changeHandler={this.handleRadioChange}
                value={true}
                checked={isEdit == true}
              />
              <RadioElement
                label="No"
                name="edit"
                changeHandler={this.handleRadioChange}
                value={false}
                checked={isEdit == false}
              />
            </div>
          </div>
          <div className="form-group checkbox-group">
            <label>Can delete submission ?</label>
            <div className="custom-checkbox display-inline">
              <RadioElement
                label="Yes"
                name="delete"
                changeHandler={this.handleRadioChange}
                value={true}
                checked={isDelete == true}
              />
              <RadioElement
                label="No"
                name="delete"
                changeHandler={this.handleRadioChange}
                value={false}
                checked={isDelete == false}
              />
            </div>
          </div> */}

          <div className="form-group pull-right no-margin">
            <button type="submit" className="fieldsight-btn">
              <FormattedMessage id="app.save" defaultMessage="Save" />
            </button>
          </div>
        </form>
      </>
    );
  }
}
export default AddSubstageForm;

import React, { Component, Fragment } from "react";
import uuid from "uuid/v4";
import PerfectScrollbar from "react-perfect-scrollbar";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import Table from "../common/Table";
import Modal from "../common/Modal";
import RightContentCard from "../common/RightContentCard";
import InputElement from "../common/InputElement";
import SelectElement from "../common/SelectElement";
import CheckBox from "../common/CheckBox";
import findQuestion from "../../utils/findQuestion";

import isEmpty from "../../utils/isEmpty";
import { errorToast } from "../../utils/toastHandler";
import SortableSiteInfo from "./SortableSiteInfo";

const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const INITIAL_STATE = {
  showModal: false,
  label: "",
  type: "Text",
  placeholder: "",
  helpText: "",
  showOptions: false,
  editMode: false,
  options: {},
  optInputField: [],
  selectedId: null,
  selectedForm: null,
  selectedQuestion: {},
  filteredQuestions: [],
  filteredMetaAttributes: [],
  selectedProject: {},
  tableQuestions: [],
  publicChecked: false,
  dashboardChecked: false,
  reOrder: false,
  isReorderCancel: true
};

const questionTypes = [
  { id: "Text", name: "Text" },
  { id: "Number", name: "Number" },
  { id: "Date", name: "Date" },
  { id: "MCQ", name: "Select one" },
  { id: "Link", name: "Draw from another project" },
  { id: "Form", name: "Draw answer from a form" },
  { id: "FormSubStat", name: "Form submission" },
  { id: "FormSubCountQuestion", name: "Form submissions count" },
  { id: "FormQuestionAnswerStatus", name: "Form question answer status" }
];

class SiteInformationTable extends Component {
  state = INITIAL_STATE;

  componentWillReceiveProps(nextProps) {
    if (nextProps.jsonQuestions) {
      this.setState({
        tableQuestions: [...nextProps.jsonQuestions]
      });
    }
  }

  closeModal = () => {
    this.setState({
      ...INITIAL_STATE,
      tableQuestions: [...this.state.tableQuestions]
    });
  };

  generateOptField = () => {
    const maxVal = Math.max(
      ...this.state.optInputField.map(field => field.val),
      0
    );

    const optInputField = [
      ...this.state.optInputField,
      { tag: InputElement, val: maxVal + 1 }
    ];

    this.setState({
      optInputField
    });
  };

  onSelectChangeHandler = e => {
    const { value } = e.target;

    if (value === "MCQ") {
      return this.setState({
        type: "MCQ",
        showOptions: true
      });
    }
    this.setState({
      type: value,
      showOptions: false
    });
  };

  handleCheckboxChange = (e, type) => {
    if (typeof type === "object") {
      const newMetaAttributes = this.state.filteredMetaAttributes.map(
        attribute => ({ ...attribute })
      );
      const selectedAttribute = newMetaAttributes.find(
        attribute => attribute.question_name === type.question_name
      );
      selectedAttribute.checked = e.target.checked;
      return this.setState({
        filteredMetaAttributes: newMetaAttributes
      });
    }

    this.setState({ [`${type}Checked`]: e.target.checked });
  };

  handleMultiChange = option => {
    this.setState(state => {
      return {
        multiValue: option
      };
    });
  };

  onInputChangeHandler = (e, option) => {
    const { name, value } = e.target;
    if (option) {
      return this.setState({
        options: {
          ...this.state.options,
          [name]: value
        }
      });
    }
    this.setState({
      [name]: value
    });
  };

  removeInputHandler = val => {
    const filteredOptInputField = this.state.optInputField.filter(
      (field, i) => field.val !== val
    );
    const filteredOptions = { ...this.state.options };
    delete filteredOptions[`option${val}`];
    this.setState({
      optInputField: filteredOptInputField,
      options: filteredOptions
    });
  };

  formChangeHandler = e => {
    const { value } = e.target;
    const { type } = this.state;

    // if (value === "--Select Project--" || value === "--Select Form--") {
    //   return;
    // }

    if (type === "Link") {
      if (this.state.selectedProject === value) {
        return;
      }
      const filteredMetaAttributes = this.props.projects.find(
        project => project.id === +value
      );

      if (filteredMetaAttributes) {
        const modifiedMetaAttributes = filteredMetaAttributes.site_meta_attributes.map(
          meta => ({
            ...meta,
            checked: false
          })
        );

        this.setState({
          selectedProject: value,
          filteredMetaAttributes: modifiedMetaAttributes
        });
      }
    } else {
      const selectedForm = this.props.forms.find(form => form.id === +value);

      if (selectedForm) {
        const filteredQuestions = selectedForm
          ? findQuestion(selectedForm.json.children)
          : [];
        this.setState({
          selectedForm: value,
          filteredQuestions
        });
      }
    }
  };

  questionChangeHandler = e => {
    const { value } = e.target;
    const selectedQuestion = this.state.filteredQuestions.find(
      question => question.name === value
    );

    if (selectedQuestion.type) {
      this.setState({ selectedQuestion });
    }
  };

  checkSelectedLength = filteredMetaAttributes => {
    return filteredMetaAttributes.filter(attribute => attribute.checked).length;
  };

  validationHandler = () => {
    const {
      state: {
        type,
        options,
        selectedForm,
        selectedQuestion,
        selectedProject,
        filteredMetaAttributes
      }
    } = this;

    if (type === "MCQ") {
      if (Object.keys(options).length <= 0) {
        errorToast("Please add options for this type.");
        return false;
      }
    }

    if (
      type === "Form" ||
      type === "FormSubStat" ||
      type === "FormSubCountQuestion" ||
      type === "FormQuestionAnswerStatus"
    ) {
      if (!selectedForm) {
        errorToast("Please select a form.");
        return false;
      }
    }

    if (type === "Form" || type === "FormQuestionAnswerStatus") {
      if (Object.keys(selectedQuestion).length <= 0) {
        errorToast("Please select a question.");
        return false;
      }
    }

    if (type === "Link") {
      if (!selectedProject) {
        errorToast("Please select a project.");
        return false;
      }
    }

    if (this.checkSelectedLength(filteredMetaAttributes) <= 0) {
      errorToast("Please select a attribute.");
      return false;
    }

    return true;
  };

  onSubmitHandler = e => {
    e.preventDefault();
    const isValid = this.validationHandler();

    if (!isValid) return;

    const {
      state: {
        label,
        type,
        placeholder,
        helpText,
        options,
        optInputField,
        editMode,
        selectedForm,
        selectedQuestion,
        selectedProject,
        filteredMetaAttributes,
        selectedId,
        tableQuestions,
        publicChecked,
        dashboardChecked
      }
    } = this;

    const { bind, children, ...restQuestion } = selectedQuestion;

    const question = {
      ...(!editMode && { id: uuid() }),

      ...(editMode && { id: pattern.test(selectedId) ? selectedId : uuid() }),

      question_name: label.replace(/ /g, "_"),

      question_text: label,
      question_type: type,

      ...(type === "MCQ" && { mcq_options: options }),

      ...(type === "MCQ" && { optInputField }),

      ...((type === "Form" ||
        type === "FormQuestionAnswerStatus" ||
        type === "FormSubStat" ||
        type === "FormSubCountQuestion") && { form_id: selectedForm }),

      ...((type === "Form" || type === "FormQuestionAnswerStatus") && {
        question: restQuestion
      }),

      ...(type === "Link" && {
        project_id: selectedProject
      }),

      ...(type === "Link" && {
        metas: filteredMetaAttributes.filter(
          attribute => attribute.checked === true
        )
      }),

      ...((type === "Text" || type === "Number" || type === "Date") && {
        question_placeholder: placeholder
      }),

      ...((type === "Text" ||
        type === "Number" ||
        type === "Date" ||
        type === "MCQ" ||
        type === "Link") && { question_help: helpText })
      // share_to_dashboard: dashboardChecked,
      // share_to_public: publicChecked
    };

    if (editMode) {
      let selectedQuestionIndex = tableQuestions.findIndex(question =>
        question.id
          ? question.id == selectedId
          : question.question_text == selectedId
      );

      let newTableQuestions = tableQuestions.map(question => ({ ...question }));

      newTableQuestions[selectedQuestionIndex] = question;

      this.setState(
        {
          ...INITIAL_STATE,
          tableQuestions: newTableQuestions
        },
        () => this.props.siteInfoHandler(this.state.tableQuestions)
      );
    } else {
      this.setState(
        {
          ...INITIAL_STATE,
          tableQuestions: [...tableQuestions, question]
        },
        () => this.props.siteInfoHandler(this.state.tableQuestions)
      );
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  };

  editQuestionHandler = value => {
    let filteredMetaAttributes = [];
    let filteredQuestions = this.state.filteredQuestions;
    const selectedTableQuestion = this.state.tableQuestions.find(
      question => question.id === value || question.question_text === value
    );

    if (selectedTableQuestion && selectedTableQuestion.project_id) {
      const siteMetaAttributes = this.props.projects.find(
        project => project.id === +selectedTableQuestion.project_id
      );

      if (siteMetaAttributes) {
        const selectedMetaAttributes = new Set(
          selectedTableQuestion.metas.map(({ question_name }) => question_name)
        );
        const nonSelectedMetaAttribute = siteMetaAttributes.site_meta_attributes
          .filter(
            ({ question_name }) => !selectedMetaAttributes.has(question_name)
          )
          .map(attr => ({
            ...attr,
            checked: false
          }));

        filteredMetaAttributes = [
          ...selectedTableQuestion.metas,
          ...nonSelectedMetaAttribute
        ];
      }
    }

    const question = {
      label: selectedTableQuestion.question_text,

      type: selectedTableQuestion.question_type,
      ...(selectedTableQuestion.question_type === "MCQ" && {
        options: selectedTableQuestion.mcq_options
      }),
      ...(selectedTableQuestion.question_type === "MCQ" && {
        optInputField: selectedTableQuestion.optInputField
      }),
      ...((selectedTableQuestion.question_type === "Form" ||
        selectedTableQuestion.question_type === "FormQuestionAnswerStatus" ||
        selectedTableQuestion.question_type === "FormSubStat" ||
        selectedTableQuestion.question_type === "FormSubCountQuestion") && {
        selectedForm: selectedTableQuestion.form_id
      }),
      ...((selectedTableQuestion.question_type === "Form" ||
        selectedTableQuestion.question_type === "FormQuestionAnswerStatus") && {
        selectedQuestion: selectedTableQuestion.question
      }),
      ...(selectedTableQuestion.question_type === "Link" && {
        selectedProject: selectedTableQuestion.project_id
      }),
      ...(selectedTableQuestion.question_type === "Link" && {
        filteredMetaAttributes
      }),
      ...((selectedTableQuestion.question_type === "Text" ||
        selectedTableQuestion.question_type === "Number" ||
        selectedTableQuestion.question_type === "Date") && {
        placeholder: selectedTableQuestion.question_placeholder
      }),
      ...((selectedTableQuestion.question_type === "Text" ||
        selectedTableQuestion.question_type === "Number" ||
        selectedTableQuestion.question_type === "Date" ||
        selectedTableQuestion.question_type === "MCQ" ||
        selectedTableQuestion.question_type === "Link") && {
        helpText: selectedTableQuestion.question_help
      })
      // ...(selectedTableQuestion.share_to_dashboard && {
      //   dashboardChecked: selectedTableQuestion.share_to_dashboard
      // }),
      // ...(selectedTableQuestion.share_to_public && {
      //   publicChecked: selectedTableQuestion.share_to_public
      // })
    };

    if (selectedTableQuestion.form_id) {
      const selectedForm = this.props.forms.find(
        form => form.id === +selectedTableQuestion.form_id
      );
      if (selectedForm && selectedForm.length > 0) {
        filteredQuestions = findQuestion(selectedForm.json.children);
      }
    }

    this.setState({
      showModal: true,
      selectedId: value,
      editMode: true,
      filteredQuestions,
      ...question
    });
  };

  removeQuestionHandler = value => {
    const filteredTableQuestions = this.state.tableQuestions.filter(question =>
      question.id ? question.id !== value : question.question_text !== value
    );

    this.setState(
      {
        tableQuestions: filteredTableQuestions
      },
      () => this.props.siteInfoHandler(this.state.tableQuestions)
    );
  };
  handleReorderToogle = () => {
    this.setState(
      {
        reOrder: !this.state.reOrder,
        isReorderCancel: !this.state.isReorderCancel
      },
      () => {
        if (this.state.isReorderCancel) {
          this.setState({ tableQuestions: this.props.jsonQuestions });
        }
      }
    );
  };
  handleSave = () => {
    this.props.handleSaveReorder(this.state.tableQuestions);
    this.handleReorderToogle();
  };
  handleReOrder = list => {
    this.setState({ tableQuestions: list });
  };
  render() {
    const {
      props: { forms, terms, projects, jsonQuestions },
      state: {
        label,
        type,
        placeholder,
        helpText,
        editMode,
        selectedForm,
        selectedQuestion,
        selectedProject,
        optInputField,
        filteredQuestions,
        filteredMetaAttributes,
        tableQuestions,
        showModal,
        reOrder,
        isReorderCancel
      },
      removeQuestionHandler,
      editQuestionHandler,
      toggleModal
    } = this;
    const title = !isEmpty(terms)
      ? `${terms.site} Information`
      : "Site Information";

    return (
      <>
        <div className="card">
          <div className="card-header main-card-header">
            <h5>{title}</h5>
            <div className="add-btn outline-btn">
              {tableQuestions && tableQuestions.length > 1 && (
                <a
                  className="pending"
                  data-tab="addSubStage-popup"
                  onClick={this.handleReorderToogle}
                >
                  {!reOrder ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Reorder</Tooltip>}
                    >
                      <span className="reorder">
                        <i className="la la-ellipsis-v" />
                        <i className="la la-ellipsis-v" />
                      </span>
                    </OverlayTrigger>
                  ) : (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Cancel</Tooltip>}
                    >
                      <span>
                        <i className="la la-close" />
                      </span>
                    </OverlayTrigger>
                  )}
                </a>
              )}
              {reOrder && (
                <a data-tab="addSubStage-popup" onClick={this.handleSave}>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Save</Tooltip>}
                  >
                    <span>
                      <i className="la la-save" />
                    </span>
                  </OverlayTrigger>
                </a>
              )}
              <a onClick={toggleModal}>
                <span>
                  <i className="la la-plus" />
                </span>
              </a>
            </div>
          </div>
          <div className="card-body">
            <SortableSiteInfo
              rowData={tableQuestions}
              page="siteInfo"
              removeHandler={removeQuestionHandler}
              editHandler={editQuestionHandler}
              forms={forms}
              reOrder={reOrder}
              isReorderCancel={isReorderCancel}
              handleSaveReorder={this.handleReOrder}
            />
          </div>
        </div>
        {showModal && (
          <Modal title="Add Information" toggleModal={this.closeModal}>
            <form className="floating-form" onSubmit={this.onSubmitHandler}>
              <InputElement
                tag="input"
                type="text"
                required={true}
                label="Input Label"
                formType="floatingForm"
                htmlFor="label"
                value={label}
                name="label"
                changeHandler={this.onInputChangeHandler}
              />
              <SelectElement
                className="form-control"
                label="Type"
                options={questionTypes}
                value={type ? type : null}
                changeHandler={this.onSelectChangeHandler}
              />
              {(type === "Text" || type === "Number" || type === "Date") && (
                <InputElement
                  tag="input"
                  type="text"
                  required={true}
                  label="Placeholder"
                  formType="floatingForm"
                  htmlFor="placeholder"
                  name="placeholder"
                  value={placeholder}
                  changeHandler={this.onInputChangeHandler}
                />
              )}

              {type === "MCQ" &&
                optInputField &&
                optInputField.length > 0 &&
                optInputField.map((el, i) => (
                  <el.tag
                    key={el.val}
                    tag="input"
                    type="text"
                    label={`option${el.val}`}
                    formType="floatingForm"
                    htmlFor={`option${el.val}`}
                    required={true}
                    removeBtn
                    removeHandler={() => this.removeInputHandler(el.val)}
                    name={`option${el.val}`}
                    value={this.state.options[`option${el.val}`] || ""}
                    changeHandler={e => this.onInputChangeHandler(e, "option")}
                  />
                ))}
              {type === "MCQ" && (
                <div className="form-group">
                  <button
                    className="fieldsight-btn"
                    onClick={this.generateOptField}
                  >
                    Option+
                  </button>
                </div>
              )}

              {(type === "Text" ||
                type === "Number" ||
                type === "Date" ||
                type === "MCQ") && (
                <InputElement
                  tag="textarea"
                  required={true}
                  label="Help Text"
                  formType="floatingForm"
                  htmlFor="helpText"
                  name="helpText"
                  value={helpText}
                  changeHandler={this.onInputChangeHandler}
                />
              )}

              {type === "Link" && (
                <SelectElement
                  className="form-control"
                  options={projects}
                  changeHandler={this.formChangeHandler}
                  value={selectedProject ? selectedProject : null}
                />
              )}
              {type === "Link" && (
                <div style={{ position: "relative", height: "250px" }}>
                  <PerfectScrollbar>
                    {this.state.filteredMetaAttributes.map(attribute => {
                      return (
                        <div className="form-group" key={attribute.id}>
                          <CheckBox
                            checked={attribute.checked}
                            label={attribute.question_name}
                            changeHandler={e =>
                              this.handleCheckboxChange(e, attribute)
                            }
                          />
                        </div>
                      );
                    })}
                  </PerfectScrollbar>
                </div>
              )}
              {(type === "Form" ||
                type === "FormSubStat" ||
                type === "FormSubCountQuestion" ||
                type === "FormQuestionAnswerStatus") && (
                <SelectElement
                  className="form-control"
                  options={forms}
                  value={selectedForm ? selectedForm : null}
                  changeHandler={this.formChangeHandler}
                />
              )}

              {(type === "Form" || type === "FormQuestionAnswerStatus") &&
                filteredQuestions.length > 0 && (
                  <SelectElement
                    className="form-control"
                    options={filteredQuestions}
                    value={selectedQuestion.name ? selectedQuestion.name : null}
                    changeHandler={this.questionChangeHandler}
                  />
                )}
              {/* <div className="form-group display-inline text-center">
                <CheckBox
                  checked={this.state.dashboardChecked}
                  label="Share To Dashboard"
                  onChange={e => this.handleCheckboxChange(e, "dashboard")}
                />

                <CheckBox
                  checked={this.state.publicChecked}
                  label="Share To Public"
                  onChange={e => this.handleCheckboxChange(e, "public")}
                />
              </div> */}
              <div className="form-group pull-right no-margin">
                <button type="submit" className="fieldsight-btn">
                  Save
                </button>
              </div>
            </form>
          </Modal>
        )}
      </>
    );
  }
}

export default SiteInformationTable;

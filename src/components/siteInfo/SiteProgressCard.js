import React, { Component, Fragment } from "react";
import SelectElement from "../common/SelectElement";
import InputElement from "../common/InputElement";
import { DotLoader } from "../common/Loader";
import Modal from "../common/Modal.js";
import isEmpty from "../../utils/isEmpty";
import findQuestionWithGroup from "../../utils/findQuestionWithGroup";

const typeOptions = {
  siteProgressCard: [
    { id: "0", name: "Stages Approved / Total Stages" },
    { id: "1", name: "Most Advanced Approved Stage" },
    { id: "2", name: "Pull Progress Value from a Form" },
    { id: "3", name: "Total Number of Submissions / Target Number" },
    { id: "4", name: "Number of Submissions for a Form / Target Number" },
    { id: "5", name: "Update Manually" }
  ]
};

const INITIAL_STATE = {
  showForm: false,
  showQuestion: false,
  showTargetNum: false,
  filteredQuestions: [],
  selectedForm: {},
  selectedQuestion: {},
  source: "0",
  targetNum: "",
  showDeleteConfirmation: false
};

class SiteProgressCard extends Component {
  state = INITIAL_STATE;

  componentWillReceiveProps(nextProps) {
    let selectedForm = {};
    let selectedQuestion = {};
    let source = "0";
    let showForm;

    let showQuestion = false;
    let showTargetNum = false;
    let filteredQuestions = [];

    if (nextProps.projectSettings && nextProps.projectSettings.source) {
      source = nextProps.projectSettings.source;
    }
    if (
      nextProps.projectSettings &&
      (nextProps.projectSettings.pull_integer_form ||
        nextProps.projectSettings.no_submissions_form)
    ) {
      selectedForm = nextProps.forms.find(
        form =>
          form.id ===
          (nextProps.projectSettings.pull_integer_form ||
            nextProps.projectSettings.no_submissions_form)
      );
    }

    if (!isEmpty(selectedForm)) {
      if (selectedForm.json) {
        filteredQuestions = findQuestionWithGroup(
          selectedForm.json.children,
          "integer"
        );

        selectedQuestion = filteredQuestions.find(
          question =>
            question.name ===
            nextProps.projectSettings.pull_integer_form_question
        );
      }
    }

    if (!isEmpty(selectedForm)) {
      showForm = true;
    }

    if (source == "2") {
      showQuestion = true;
    }

    if (source == "3" || source == "4") {
      showTargetNum = true;
    }

    this.setState({
      source,
      selectedForm,
      selectedQuestion: selectedQuestion ? selectedQuestion : {},
      filteredQuestions,
      showTargetNum,
      showQuestion,
      ...(showForm && { showForm })
    });
  }

  dataChangeHandler = () => {
    const {
      state: { source, selectedForm, selectedQuestion, targetNum }
    } = this;

    this.props.siteProgressHandler({
      pull_integer_form: source == "2" ? selectedForm.id : null,
      no_submissions_form: source == "4" ? selectedForm.id : null,
      no_submissions_total_count: targetNum ? +targetNum : null,
      pull_integer_form_question: selectedQuestion.name,
      // ? selectedQuestion.name
      // : // : selectedQuestion.name
      //   // ? selectedQuestion.name
      //   null,
      source: source,
      deployed: true
    });
  };

  onChangeHandler = e => {
    const { value } = e.target;
    if (value == "2") {
      this.setState(
        {
          ...INITIAL_STATE,
          showForm: true,
          showQuestion: true,
          source: value
        },
        this.dataChangeHandler
      );
    } else if (value == "3") {
      this.setState(
        {
          ...INITIAL_STATE,
          showTargetNum: true,
          source: value
        },
        this.dataChangeHandler
      );
    } else if (value == "4") {
      this.setState(
        {
          ...INITIAL_STATE,
          showForm: true,
          showTargetNum: true,
          source: value
        },
        this.dataChangeHandler
      );
    } else {
      this.setState(
        { ...INITIAL_STATE, source: value },
        this.dataChangeHandler
      );
    }
  };

  formChangeHandler = e => {
    const { value } = e.target;
    const selectedForm = this.props.forms.find(form => form.id == value);

    if (selectedForm) {
      const filteredQuestions = findQuestionWithGroup(
        selectedForm.json.children,
        "integer"
      );

      this.setState(
        {
          selectedForm,
          filteredQuestions,
          selectedQuestion: {}
        },
        this.dataChangeHandler
      );
    }
  };

  questionChangeHandler = e => {
    const { value } = e.target;
    const selectedQuestion = this.state.filteredQuestions.find(
      question => question.name === value
    );

    if (selectedQuestion.type) {
      this.setState({ selectedQuestion }, this.dataChangeHandler);
    }
  };

  inputChangeHandler = e => {
    this.setState({ targetNum: e.target.value }, this.dataChangeHandler);
  };

  deployModalHandler = () => {
    this.setState({
      showDeleteConfirmation: true
    });
  };

  render() {
    const { siteProgressCard } = typeOptions;
    const {
      state: {
        targetNum,
        source,
        showForm,
        showQuestion,
        showTargetNum,
        selectedForm,
        selectedQuestion,
        filteredQuestions,
        showDeleteConfirmation
      },
      props: { title, forms },
      onChangeHandler,
      formChangeHandler,
      questionChangeHandler,
      deployModalHandler
    } = this;
    return (
      <Fragment>
        <div className="card">
          <div className="card-header sub-card-header">
            <h5>{title}</h5>
            {/* <button className="fieldsight-btn" onClick={deployModalHandler}>
              Deploy
            </button> */}
          </div>
          <div className="card-body">
            <form>
              <SelectElement
                className="form-control"
                options={siteProgressCard}
                changeHandler={onChangeHandler}
                value={source}
              />

              {(showForm || showTargetNum) && forms.length <= 0 && (
                <DotLoader />
              )}

              {showForm && forms.length > 0 && (
                <SelectElement
                  className="form-control"
                  options={forms}
                  changeHandler={formChangeHandler}
                  value={!isEmpty(selectedForm) && selectedForm.id}
                />
              )}

              {showQuestion && forms.length > 0 && selectedForm.id && (
                <SelectElement
                  className="form-control"
                  options={filteredQuestions}
                  changeHandler={questionChangeHandler}
                  value={!isEmpty(selectedQuestion) && selectedQuestion.name}
                />
              )}

              {showTargetNum && forms.length > 0 && (
                <InputElement
                  tag="input"
                  type="number"
                  required={true}
                  label="Target"
                  formType="editForm"
                  htmlFor="target"
                  name="target"
                  value={targetNum}
                  changeHandler={this.inputChangeHandler}
                />
              )}
            </form>
          </div>
        </div>

        {showDeleteConfirmation && (
          <Modal
            title="Deployment"
            toggleModal={() => this.setState({ showDeleteConfirmation: false })}
          >
            <div className="warning">
              <i className="la la-exclamation-triangle" />

              <p>
                Progress on all site of this project will be updated. Are you
                sure you want to deploy the progress settings?
              </p>
            </div>
            <div className="warning-footer text-center">
              <a
                className="fieldsight-btn rejected-btn"
                onClick={() => this.setState({ showDeleteConfirmation: false })}
              >
                cancel
              </a>
              <a className="fieldsight-btn" onClick={() => {}}>
                confirm
              </a>
            </div>
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default SiteProgressCard;

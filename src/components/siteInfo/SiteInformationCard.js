import React, { Component, Fragment } from "react";
import SelectElement from "../common/SelectElement";
import { DotLoader } from "../common/Loader";
import findQuestion from "../../utils/findQuestion";
import isEmpty from "../../utils/isEmpty";

const typeOptions = {
  sitePictureTypes: [
    { id: "choose", name: "Upload / Choose From Gallery" },
    { id: "Form", name: "Choose From A Form" }
  ],
  siteLocationTypes: [
    { id: "choose", name: "Enter A Location/ Choose On Map" },
    { id: "Form", name: "Choose From A Form" }
  ]
};

const INITIAL_STATE = {
  showForm: false,
  type: "choose",
  selectedForm: {},
  selectedQuestion: {},
  filteredQuestions: []
};
class SiteInformationCard extends Component {
  state = INITIAL_STATE;

  componentWillReceiveProps(nextProps) {
    let selectedForm = {};
    let selectedQuestion = {};
    let type = "choose";
    let showForm;
    let filteredQuestions = [];

    if (nextProps.siteInfo && nextProps.siteInfo.form_id) {
      selectedForm = nextProps.forms.find(
        form => form.id === nextProps.siteInfo.form_id
      );
    }

    if (nextProps.siteInfo && !isEmpty(nextProps.siteInfo.question)) {
      selectedQuestion = nextProps.siteInfo.question;
    }

    if (nextProps.siteInfo && nextProps.siteInfo.question_type) {
      type = nextProps.siteInfo.question_type;
    }

    if (selectedForm && !isEmpty(selectedForm)) {
      showForm = true;
      filteredQuestions = findQuestion(
        selectedForm.json.children,
        nextProps.infoType
      );
    }

    this.setState({
      selectedForm,
      selectedQuestion,
      filteredQuestions,
      type,
      ...(showForm && { showForm })
    });
  }

  dataChangeHandler = () => {
    const {
      state: { selectedForm, selectedQuestion, type },
      props: { infoType }
    } = this;
    if (type === "Form") {
      if (infoType === "photo") {
        return this.props.siteIdentityHandler({
          site_picture: {
            question_type: type,
            form_id: selectedForm.id ? selectedForm.id : 0,
            question: selectedQuestion
          }
        });
      } else {
        return this.props.siteIdentityHandler({
          site_location: {
            question_type: type,
            form_id: selectedForm.id ? selectedForm.id : 0,
            question: selectedQuestion
          }
        });
      }
    }

    if (infoType === "photo") {
      this.props.siteIdentityHandler({
        site_picture: {
          question_type: type,
          form_id: 0,
          question: {}
        }
      });
    } else {
      this.props.siteIdentityHandler({
        site_location: {
          question_type: type,
          form_id: 0,
          question: {}
        }
      });
    }
  };

  onChangeHandler = e => {
    const { value } = e.target;

    if (value === "Form") {
      return this.setState(
        { type: value, showForm: true },
        this.dataChangeHandler
      );
    }
    this.setState(
      {
        type: value,
        showForm: false
      },
      this.dataChangeHandler
    );
  };

  formChangeHandler = (e, type) => {
    const { value } = e.target;

    const selectedForm = this.props.forms.find(form => form.id == value);

    if (selectedForm) {
      const filteredQuestions = findQuestion(selectedForm.json.children, type);

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

  render() {
    const {
      state: {
        showForm,
        showProgressInput,
        filteredQuestions,
        selectedForm,
        selectedQuestion,
        type
      },
      props: { title, infoType, forms, siteInfo },
      onChangeHandler,
      formChangeHandler,
      questionChangeHandler
    } = this;

    const { sitePictureTypes, siteLocationTypes } = typeOptions;

    return (
      <div className="card">
        <div className="card-header sub-card-header">
          <h5>{title}</h5>
        </div>
        <div className="card-body">
          <form>
            <SelectElement
              className="form-control"
              options={
                infoType === "photo" ? sitePictureTypes : siteLocationTypes
              }
              changeHandler={onChangeHandler}
              value={type}
            />

            {showForm && forms.length <= 0 && <DotLoader />}

            {showForm && forms.length > 0 && (
              <Fragment>
                <SelectElement
                  className="form-control"
                  options={forms}
                  changeHandler={e => formChangeHandler(e, infoType)}
                  value={!isEmpty(selectedForm) && selectedForm.id}
                />

                {selectedForm.id && (
                  <SelectElement
                    className="form-control"
                    options={filteredQuestions}
                    changeHandler={questionChangeHandler}
                    value={!isEmpty(selectedQuestion) && selectedQuestion.name}
                  />
                )}
              </Fragment>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default SiteInformationCard;

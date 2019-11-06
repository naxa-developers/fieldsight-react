import React, { Component } from "react";
import uuid from "uuid/v4";
import FeaturedPicturesCard from "./FeaturedPicturesCard";
import Modal from "../common/Modal";
import InputElement from "../common/InputElement";
import SelectElement from "../common/SelectElement";
import findQuestion from "../../utils/findQuestion";
import { errorToast } from "../../utils/toastHandler";

const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const INITIAL_STATE = {
  showModal: false,
  label: "",
  type: "choose",
  selectedForm: null,
  selectedQuestion: {},
  filteredQuestions: [],
  featuredPics: [],
  selectedId: null,
  editMode: false
};

const siteFeaturedTypes = [
  { id: "choose", name: "Choose from Gallery" },
  { id: "Form", name: "Choose from a form" }
];

// const typeOptions = {
//   GALLERY: "Choose From Gallery",
//   FORM: "Choose From Form"
// };

class FeaturedPictures extends Component {
  state = INITIAL_STATE;

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteFeaturedImages) {
      this.setState({
        featuredPics: [...nextProps.siteFeaturedImages]
      });
    }
  }

  closeModal = () => {
    this.setState({
      ...INITIAL_STATE,
      featuredPics: [...this.state.featuredPics]
    });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  };

  onInputChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  onSelectChangeHandler = e => {
    const { value } = e.target;
    this.setState({
      type: value
    });
  };

  validationHandler = () => {
    const {
      state: {
        label,
        type,
        editMode,
        selectedForm,
        selectedQuestion,
        selectedId,
        featuredPics
      },
      props: { sitePicHandler }
    } = this;

    if (type === "Form") {
      if (!selectedForm) {
        errorToast("Please select a form.");
        return false;
      }

      if (Object.keys(selectedQuestion).length <= 0) {
        errorToast("Please select a question.");
        return false;
      }
    }

    return true;
  };

  onSubmitHandler = e => {
    e.preventDefault();
    const {
      state: {
        label,
        type,
        editMode,
        selectedForm,
        selectedQuestion,
        selectedId,
        featuredPics
      },
      props: { sitePicHandler }
    } = this;

    const isValid = this.validationHandler();

    if (!isValid) return;

    const picture = {
      ...(!editMode && { id: uuid() }),
      ...(editMode && { id: pattern.test(selectedId) ? selectedId : uuid() }),
      question_name: label,
      question_text: label,
      question_type: type,
      ...(type === "Form" && { form_id: selectedForm }),
      ...(type === "Form" && { question: selectedQuestion })
    };

    if (editMode) {
      let filteredFeaturedPics = featuredPics.filter(pic =>
        pic.id ? pic.id !== selectedId : pic.question_name !== selectedId
      );

      this.setState(
        {
          ...INITIAL_STATE,
          featuredPics: [
            ...filteredFeaturedPics,
            { ...picture, id: selectedId }
          ]
        },
        () => this.props.sitePicHandler(this.state.featuredPics)
      );
    } else {
      this.setState(
        {
          ...INITIAL_STATE,
          featuredPics: [...featuredPics, picture]
        },
        () => this.props.sitePicHandler(this.state.featuredPics)
      );
    }
  };
  formChangeHandler = e => {
    const { value } = e.target;
    const selectedForm = this.props.forms.find(form => form.id === +value);
    if (selectedForm) {
      const filteredQuestions = findQuestion(
        selectedForm.json.children,
        "photo"
      );
      this.setState({
        selectedForm: value,
        filteredQuestions
      });
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

  removePicHandler = value => {
    const filteredFeaturedPics = this.state.featuredPics.filter(pic =>
      pic.id ? pic.id !== value : pic.question_name !== value
    );

    this.setState(
      {
        featuredPics: filteredFeaturedPics
      },
      () => this.props.sitePicHandler(this.state.featuredPics)
    );
  };

  editPicHandler = value => {
    const selectedFeaturedPic = this.state.featuredPics.find(
      pic => pic.id === value || pic.question_name === value
    );

    const picture = {
      label: selectedFeaturedPic.question_name,
      type: selectedFeaturedPic.question_type,
      ...(selectedFeaturedPic.question_type === "Form" && {
        selectedForm: selectedFeaturedPic.form_id
      }),
      ...(selectedFeaturedPic.question_type === "Form" && {
        selectedQuestion: selectedFeaturedPic.question
      })
    };

    const filteredQuestions = selectedFeaturedPic.form_id
      ? findQuestion(
          this.props.forms.find(
            form => form.id === +selectedFeaturedPic.form_id
          ).json.children,
          "photo"
        )
      : this.state.filteredQuestions;

    this.setState({
      showModal: true,
      selectedId: value,
      editMode: true,
      filteredQuestions,
      ...picture
    });
  };

  render() {
    const {
      props: { forms },
      state: {
        showModal,
        label,
        type,
        selectedForm,
        selectedQuestion,
        editMode,
        filteredQuestions,
        featuredPics
      },
      closeModal,
      toggleModal,
      formChangeHandler,
      questionChangeHandler,
      onInputChangeHandler,
      onSelectChangeHandler,
      editPicHandler,
      removePicHandler,
      onSubmitHandler
    } = this;

    return (
      <div className="card mrt-15 no-boxshadow">
        <div className="card-header main-card-header">
          <h5>featured pictures</h5>
          <div className="add-btn">
            <a onClick={toggleModal}>
              Add new{" "}
              <span>
                <i className="la la-plus" />
              </span>
            </a>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            {featuredPics.map(pic => (
              <FeaturedPicturesCard
                key={pic.id}
                picture={pic}
                editPicHandler={editPicHandler}
                removePicHandler={removePicHandler}
                forms={forms}
              />
            ))}
          </div>
        </div>

        {showModal && (
          <Modal
            title="Add Pictures"
            toggleModal={closeModal}
            submitHandler={onSubmitHandler}
          >
            <form className="floating-form" onSubmit={onSubmitHandler}>
              <InputElement
                tag="input"
                type="text"
                required={true}
                label="Input Label"
                formType="floatingForm"
                htmlFor="input"
                name="label"
                value={label}
                changeHandler={onInputChangeHandler}
              />

              <SelectElement
                className="form-control"
                label="Type"
                options={siteFeaturedTypes}
                value={type ? type : null}
                changeHandler={onSelectChangeHandler}
              />

              {type === "Form" && (
                <SelectElement
                  className="form-control"
                  options={forms}
                  value={selectedForm ? selectedForm : null}
                  changeHandler={formChangeHandler}
                />
              )}

              {type === "Form" && filteredQuestions.length > 0 && (
                <SelectElement
                  className="form-control"
                  options={filteredQuestions}
                  value={selectedQuestion.name ? selectedQuestion.name : null}
                  changeHandler={questionChangeHandler}
                />
              )}
              <div className="form-group pull-right no-margin">
                <button type="submit" className="fieldsight-btn">
                  Save
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  }
}

export default FeaturedPictures;

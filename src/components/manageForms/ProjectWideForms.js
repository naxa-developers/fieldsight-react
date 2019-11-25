import React, { Component } from 'react';
import axios from 'axios';

import { DotLoader } from '../myForm/Loader';
import Modal from '../common/Modal';
import RightContentCard from '../common/RightContentCard';
import GlobalModalForm from './GlobalModalForm';
import { errorToast, successToast } from '../../utils/toastHandler';
import EditFormGuide from './EditFormGuide';
import AddForm from './AddForm';
import GeneralFormTable from './GeneralFormTable';
import ManageModal from './ManageModal';

class ProjectWideForms extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params ? this.props.match.params.id : '',
      data: [],
      deployStatus: false,
      editGuide: false,
      guideData: {},
      editFormId: '',
      showFormModal: false,
      activeTab: 'myForms',
      formData: {},
      xf: '',
      loader: false,
      loaded: 0,
      formId: '',
      formTitle: '',
      isProjectForm: '',
      myFormList: [],
      projectFormList: [],
      sharedFormList: [],
      isEditForm: false,
      isProjectWide: false,
      // settingId: "",
    };
  }

  requestGeneralForm(id) {
    axios
      .get(`fv3/api/manage-forms/survey/?project_id=${id}`)
      .then(res => {
        if (this._isMounted) {
          this.setState({ data: res.data, loader: false });
        }
      })
      .catch(err => {});
  }

  componentDidMount() {
    this._isMounted = true;
    const {
      match: {
        url,
        params: { id },
      },
    } = this.props;
    const splitArr = url.split('/');
    const isProjectForm = splitArr.includes('project');
    const isProjectWide = splitArr.includes('wide');

    if (isProjectForm) {
      this.setState(
        {
          loader: true,
          isProjectForm,
          isProjectWide: isProjectWide && isProjectWide,
        },
        this.requestGeneralForm(id),
      );
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.myForms != this.props.myForms) {
      this.setState({
        myFormList: this.props.myForms,
      });
    } else if (nextProps.projectForms != this.props.projectForms) {
      this.setState({
        projectFormList: this.props.projectForms,
      });
    } else if (nextProps.sharedForms != this.props.sharedForms) {
      this.setState({
        sharedFormList: this.props.sharedForms,
      });
    }
  }

  changeDeployStatus = (formId, isDeploy) => {
    const { id } = this.state;
    axios
      .post(
        `fv3/api/manage-forms/deploy/?project_id=${id}&type=general&id=${formId}`,
        { is_deployed: !isDeploy },
      )
      .then(res => {
        this.setState(
          state => {
            const newData = this.state.data;
            newData.map(each => {
              const arrItem = { ...each };

              if (each.id == formId) {
                each.is_deployed = !isDeploy;
              }
              return arrItem;
            });
            return { data: newData };
          },
          () => {
            successToast('Deploy Status', 'updated');
          },
        );
      })
      .catch(err => {});
  };

  deleteItem = (formId, isDeploy) => {
    const { id } = this.state;
    axios
      .post(
        `fv3/api/manage-forms/delete/?project_id=${id}&type=general&id=${formId}`,
        { is_deployed: isDeploy },
      )
      .then(res => {
        this.setState(
          {
            data: this.state.data.filter(each => each.id != formId),
          },
          () => {
            successToast('Form', 'deleted');
          },
        );
      })
      .catch(err => {});
  };

  handleEditGuide = (data, formId) => {
    this.setState({
      editGuide: !this.state.editGuide,
      guideData: data ? data : {},
      editFormId: formId,
    });
  };

  handleUpdateGuide = data => {
    const { id, editFormId } = this.state;
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.text) formData.append('text', data.text);
    if (data.pdf) formData.append('pdf', data.pdf);
    if (data.is_pdf) formData.append('is_pdf', data.is_pdf);
    if (editFormId) formData.append('fsxf', editFormId);
    if (data.images && data.images.length > 0) {
      data.images.map((each, i) => {
        if (!each.image) formData.append(`new_images_${i + 1}`, each);
        editFormId;
      });
    }
    if (data.id) {
      formData.append('id', data.id);
    }
    axios
      .post(`forms/api/save_educational_material/`, formData)
      .then(res => {
        this.setState(
          {
            editGuide: false,
          },
          () => {
            this.requestGeneralForm(id);
            successToast('updated', 'successfully');
          },
        );
      })
      .catch(err => {
        errorToast(err);
      });
  };

  handleClosePopup = () => {
    this.setState({
      formTitle: '',
      formId: '',
      showFormModal: false,
      activeTab: 'myForms',
      myFormList: [],
      projectFormList: [],
      sharedFormList: [],
      xf: '',
      isEditForm: false,
    });
    this.props.closePopup();
  };

  toggleFormModal = () => {
    this.setState({ showFormModal: !this.state.showFormModal });
  };

  toggleTab = tab => {
    this.setState({
      activeTab: tab,
      myFormList: this.props.myForms,
      sharedFormList: this.props.sharedForms,
      projectFormList: this.props.projectForms,
    });
  };

  onChangeHandler = async e => {
    const { activeTab } = this.state;
    const searchValue = e.target.value;

    if (searchValue) {
      if (activeTab == 'myForms') {
        const filteredData = await this.props.myForms.filter(form => {
          return (
            form.title
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            form.owner
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        });

        this.setState({
          myFormList: filteredData,
        });
      } else if (activeTab == 'projectForms') {
        const awaitedData = await this.props.projectForms.map(
          project => {
            const filteredData = project.forms.filter(form => {
              return (
                form.title
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                form.owner
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              );
            });
            return { ...project, forms: filteredData };
          },
        );
        this.setState({
          projectFormList: awaitedData,
        });
      } else if (activeTab == 'sharedForms') {
        const filteredData = await this.props.sharedForms.filter(
          form => {
            return (
              form.title
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              form.owner
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            );
          },
        );

        this.setState({
          sharedFormList: filteredData,
        });
      }
    } else {
      this.setState({
        myFormList: this.props.myForms,
        sharedFormList: this.props.sharedForms,
        projectFormList: this.props.projectForms,
      });
    }
  };

  handleCreateGeneralForm = data => {
    const { id, xf, isEditForm } = this.state;

    if (isEditForm) {
      const payload = {
        id: data.id,
        default_submission_status: data.status,
        responses_count: 0,
        em: data.em,
        is_deployed: data.isDeploy,
        setting: {
          id: data.settingId,

          can_edit: data.isEdit,
          donor_visibility: data.isDonor,
        },
      };
      axios
        .put(
          `fv3/api/manage-forms/survey/${data.id}/?project_id=${id}`,
          payload,
        )
        .then(res => {
          this.setState(
            state => {
              const data = this.state.data;
              const newArr = data.map(each => {
                if (each.id == res.data.id) {
                  return (each = res.data);
                } else {
                  return each;
                }
              });
              return {
                data: newArr,
              };
            },
            () => {
              this.handleClosePopup();
              successToast('form', 'updated');
            },
          );
        })
        .catch(err => {
          errorToast(err);
        });
    } else {
      const payload = {
        xf: xf,
        default_submission_status: data.status,
        setting: {
          donor_visibility: data.isDonor,
          can_edit: data.isEdit,
          can_delete: data.isDelete,
        },
      };

      axios
        .post(
          `fv3/api/manage-forms/survey/?project_id=${id}`,
          payload,
        )
        .then(res => {
          this.setState(
            {
              data: [...this.state.data, res.data],
            },
            () => {
              this.props.closePopup();
              successToast('form ', 'added');
            },
          );
        })
        .catch(err => {
          errorToast(err);
        });
    }
  };

  handleMyFormChange = (e, title) => {
    this.setState({
      formId: e.target.value,
      formTitle: title,
    });
  };

  handleSaveForm = () => {
    this.setState({
      xf: this.state.formId,
      showFormModal: !this.state.showFormModal,
    });
  };

  editForm = data => {
    this.setState(
      {
        formData: data,
        isEditForm: true,
        formTitle: data.xf.title,
      },
      () => {
        this.props.commonPopupHandler();
      },
    );
  };

  render() {
    const {
      state: {
        loader,
        data,
        editGuide,
        guideData,
        showFormModal,
        activeTab,
        formData,
        formTitle,
        optionRegion,
        myFormList,
        projectFormList,
        sharedFormList,
        isProjectWide,
        isEditForm,
      },
      props: { typeOptions, regionOptions },
      handleClosePopup,
    } = this;

    return (
      <div className="col-xl-9 col-lg-8">
        <RightContentCard
          title="app.generate-forms"
          addButton={true}
          toggleModal={this.props.commonPopupHandler}
          showText={true}
        >
          {loader && <DotLoader />}
          {!loader && (
            <GeneralFormTable
              data={data}
              loader={loader}
              handleEditGuide={this.handleEditGuide}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              handleEditForm={this.editForm}
              formTable="project"
            />
          )}
          {this.props.popupModal && (
            <Modal
              title="Add General Form"
              toggleModal={handleClosePopup}
              classname="md-body"
              // handleSubmit={this.handleCreateGeneralForm}
            >
              <GlobalModalForm
                formType="general"
                regionOptions={regionOptions}
                typeOptions={typeOptions}
                toggleFormModal={this.toggleFormModal}
                handleToggleForm={handleClosePopup}
                formTitle={formTitle}
                handleCreateForm={this.handleCreateGeneralForm}
                formData={isEditForm && formData}
                isEditForm={isEditForm}
                isProjectWide={isProjectWide}
              />
            </Modal>
          )}
          {editGuide && (
            <Modal
              title="Form Guide"
              toggleModal={this.handleEditGuide}
            >
              <EditFormGuide
                data={guideData}
                handleCancel={this.handleEditGuide}
                handleUpdateGuide={this.handleUpdateGuide}
              />
            </Modal>
          )}
          {showFormModal && (
            <ManageModal
              title="Add Form"
              toggleModal={this.toggleFormModal}
              showButton={true}
              showText="Create Form"
              url="/forms/create/"
              classname="dark md-body manage-body"
              handleSubmit={this.handleSaveForm}
            >
              <AddForm
                activeTab={activeTab}
                toggleTab={this.toggleTab}
                onChangeHandler={this.onChangeHandler}
                formList={myFormList}
                projectList={projectFormList}
                sharedList={sharedFormList}
                handleRadioChange={this.handleMyFormChange}
                // handleSaveForm={this.handleSaveForm}
              />
            </ManageModal>
          )}
        </RightContentCard>
      </div>
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}
export default ProjectWideForms;

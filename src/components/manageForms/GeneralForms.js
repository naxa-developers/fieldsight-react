import React, { Component } from 'react';
import axios from 'axios';
// import { FormattedMessage } from "react-intl";
import { DotLoader } from '../myForm/Loader';
import Modal from '../common/Modal';
import RightContentCard from '../common/RightContentCard';
import GlobalModalForm from './GlobalModalForm';
import { errorToast, successToast } from '../../utils/toastHandler';
import EditFormGuide from './EditFormGuide';
import AddForm from './AddForm';
import GeneralFormTable from './GeneralFormTable';
import ManageModal from './ManageModal';
import Loader from '../common/Loader';

class GeneralForms extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params ? props.match.params.id : '',
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
      loadReq: false,
      loaded: 0,
      formId: '',
      formTitle: '',
      isProjectForm: '',
      myFormList: props.myForms,
      projectFormList: props.projectForms,
      sharedFormList: props.sharedForms,
      isEditForm: false,
    };
  }

  requestGeneralForm(id, checkUrl) {
    const apiUrl = checkUrl
      ? `fv3/api/manage-forms/general/?project_id=${id}`
      : `fv3/api/manage-forms/general/?site_id=${id}`;

    axios
      .get(apiUrl)
      .then(res => {
        if (this._isMounted) {
          this.setState({ data: res.data, loader: false });
        }
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors.data.error);
      });
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
    const isSiteForm = splitArr.includes('site');
    if (isProjectForm) {
      this.setState(
        {
          loader: true,
          isProjectForm,
        },
        this.requestGeneralForm(id, true),
      );
    } else if (isSiteForm) {
      this.setState(
        {
          loader: true,
          isProjectForm: false,
        },
        this.requestGeneralForm(id, false),
      );
    }
  }

  componentDidUpdate(nextProps) {
    const { props } = this;
    if (nextProps.myForms != props.myForms) {
      this.setState({
        myFormList: props.myForms,
      });
    } else if (nextProps.projectForms != props.projectForms) {
      this.setState({
        projectFormList: props.projectForms,
      });
    } else if (nextProps.sharedForms != props.sharedForms) {
      this.setState({
        sharedFormList: props.sharedForms,
      });
    }
  }

  changeDeployStatus = (formId, isDeploy) => {
    const { id, isProjectForm } = this.state;
    this.setState(
      {
        loadReq: true,
      },
      () => {
        const deployUrl = !!isProjectForm
          ? `fv3/api/manage-forms/deploy/?project_id=${id}&type=general&id=${formId}`
          : `fv3/api/manage-forms/deploy/?site_id=${id}&type=general&id=${formId}`;
        axios
          .post(deployUrl, { is_deployed: !isDeploy })
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
                return { data: newData, loadReq: false };
              },
              () => {
                successToast('Deploy Status', 'updated');
              },
            );
          })
          .catch(err => {
            this.setState({ loadReq: false }, () => {
              const errors = err.response;
              errorToast(errors.data.error);
            });
          });
      },
    );
  };

  deleteItem = (formId, isDeploy) => {
    const { id, isProjectForm } = this.state;
    this.setState(
      {
        loadReq: true,
      },
      () => {
        const deleteUrl = !!isProjectForm
          ? `fv3/api/manage-forms/delete/?project_id=${id}&type=general&id=${formId}`
          : `fv3/api/manage-forms/delete/?site_id=${id}&type=general&id=${formId}`;
        axios
          .post(deleteUrl, { is_deployed: isDeploy })
          .then(res => {
            this.setState(
              {
                data: this.state.data.filter(
                  each => each.id != formId,
                ),
                loadReq: false,
              },
              () => {
                successToast('Form', 'deleted');
              },
            );
          })
          .catch(err => {
            this.setState({ loadReq: false }, () => {
              const errors = err.response;
              errorToast(errors.data.error);
            });
          });
      },
    );
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
    this.setState(
      {
        loadReq: true,
      },
      () => {
        const formData = new FormData();
        if (data.title) formData.append('title', data.title);
        if (data.text) formData.append('text', data.text);
        if (data.pdf) formData.append('pdf', data.pdf);
        if (data.is_pdf) formData.append('is_pdf', data.is_pdf);
        if (editFormId) formData.append('fsxf', editFormId);
        if (data.images && data.images.length > 0) {
          data.images.map((each, i) => {
            if (!each.image)
              formData.append(`new_images_${i + 1}`, each);
          });
        }
        if (data.id) {
          formData.append('id', data.id);
        }
        axios
          .post(`forms/api/save_educational_material/`, formData)
          .then(res => {
            if (res.data) {
              this.setState(
                state => {
                  const item = this.state.data;
                  item.map(each => {
                    const newItem = { ...each };
                    if (each.id == editFormId) {
                      each.em = res.data;
                    }
                    return newItem;
                  });

                  return {
                    editGuide: false,
                    data: item,
                    loadReq: false,
                  };
                },
                () => {
                  successToast('form', 'updated');
                },
              );
            }
          })
          .catch(err => {
            this.setState({ loadReq: false }, () => {
              const errors = err.response;
              errorToast(errors.data.error);
            });
          });
      },
    );
  };

  handleClosePopup = () => {
    const { props } = this;
    this.setState(
      {
        formTitle: '',
        formId: '',
        showFormModal: false,
        activeTab: 'myForms',
        myFormList: props.myForms,
        projectFormList: props.projectForms,
        sharedFormList: props.sharedForms,
        xf: '',
        isEditForm: false,
      },
      () => {
        props.closePopup();
      },
    );
  };

  handleCreateGeneralForm = data => {
    const {
      state: { id, xf, isEditForm, isProjectForm },
      props,
    } = this;
    this.setState(
      {
        loadReq: true,
      },
      () => {
        if (!isEditForm) {
          const postUrl = !!isProjectForm
            ? `fv3/api/manage-forms/general/?project_id=${id}`
            : `fv3/api/manage-forms/general/?site_id=${id}`;
          const payload = {
            xf: xf,
            default_submission_status: data.status,
            setting: {
              types:
                !!data.typeSelected && data.typeSelected.length > 0
                  ? data.typeSelected.map(each => each.id)
                  : [],
              regions:
                !!data.regionSelected &&
                data.regionSelected.length > 0
                  ? data.regionSelected.map(each => each.id)
                  : [],
              donor_visibility: data.isDonor,
              can_edit: data.isEdit,
              can_delete: data.isDelete,
            },
          };
          axios
            .post(postUrl, payload)
            .then(res => {
              this.setState(
                {
                  data: [...this.state.data, res.data],
                  loadReq: false,
                },
                () => {
                  props.closePopup();
                  successToast('form ', 'added');
                },
              );
            })
            .catch(err => {
              this.setState({ loadReq: false }, () => {
                const errors = err.response;
                errorToast(errors.data.error);
              });
            });
        } else {
          const updateUrl = !!isProjectForm
            ? `fv3/api/manage-forms/general/${data.id}/?project_id=${id}`
            : `fv3/api/manage-forms/general/${data.id}/?site_id=${id}`;

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
              regions:
                !!data.regionSelected &&
                data.regionSelected.length > 0
                  ? data.regionSelected.map(each => each.id)
                  : [],
              can_delete: data.isDelete,
              types:
                !!data.typeSelected && data.typeSelected.length > 0
                  ? data.typeSelected.map(each => each.id)
                  : [],
            },
          };

          axios
            .put(updateUrl, payload)
            .then(res => {
              this.setState(
                state => {
                  const arr = this.state.data;
                  const newArr = arr.map(item => {
                    if (item.id == res.data.id) {
                      return res.data;
                    } else {
                      return item;
                    }
                  });
                  return {
                    data: newArr,
                    loadReq: false,
                  };
                },
                () => {
                  this.handleClosePopup();
                  successToast('form', 'updated');
                },
              );
            })
            .catch(err => {
              this.setState({ loadReq: false }, () => {
                const errors = err.response;
                errorToast(errors.data.error);
              });
            });
        }
      },
    );
  };

  handleEditGeneralForm = data => {
    const { props } = this;
    this.setState(
      {
        formData: data,
        isEditForm: true,
        formTitle: data.xf.title,
      },
      () => {
        props.commonPopupHandler();
      },
    );
  };

  toggleFormModal = () => {
    this.setState({ showFormModal: !this.state.showFormModal });
  };

  toggleTab = tab => {
    const { props } = this;
    this.setState({
      activeTab: tab,
      myFormList: props.myForms,
      sharedFormList: props.sharedForms,
      projectFormList: props.projectForms,
    });
  };

  onChangeHandler = async e => {
    const { activeTab } = this.state;
    const { props } = this;

    const searchValue = e.target.value;

    if (searchValue) {
      if (activeTab == 'myForms') {
        const filteredData = await props.myForms.filter(form => {
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
        const awaitedData = await props.projectForms.map(project => {
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
        });
        this.setState({
          projectFormList: awaitedData,
        });
      } else if (activeTab == 'sharedForms') {
        const filteredData = await props.sharedForms.filter(form => {
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
          sharedFormList: filteredData,
        });
      }
    } else {
      this.setState({
        myFormList: props.myForms,
        sharedFormList: props.sharedForms,
        projectFormList: props.projectForms,
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
        myFormList,
        projectFormList,
        sharedFormList,
        isEditForm,
        isProjectForm,
      },
      props: {
        typeOptions,
        regionOptions,
        commonPopupHandler,
        popupModal,
      },
      handleClosePopup,
    } = this;

    return (
      <div className="col-xl-9 col-lg-8">
        <RightContentCard
          title="app.generate-forms"
          addButton={true}
          toggleModal={commonPopupHandler}
          showText={true}
        >
          {loader && <DotLoader />}
          {!loader && !!isProjectForm && (
            <GeneralFormTable
              data={data}
              loader={loader}
              handleEditGuide={this.handleEditGuide}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              handleEditForm={this.handleEditGeneralForm}
              formTable="project"
            />
          )}
          {!loader && !isProjectForm && (
            <GeneralFormTable
              data={data}
              loader={loader}
              handleEditGuide={this.handleEditGuide}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              handleEditForm={this.handleEditGeneralForm}
              formTable="site"
            />
          )}
          {props.popupModal && (
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
                formData={!!isEditForm && formData}
                isEditForm={isEditForm}
                isProjectWide={false}
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
                handleCreateGuide={this.handleCreateGuide}
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
              classname="manage-body md-body"
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
                loader={formLoader}
              />
            </ManageModal>
          )}
          {this.state.loadReq && <Loader />}
        </RightContentCard>
      </div>
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}
export default GeneralForms;

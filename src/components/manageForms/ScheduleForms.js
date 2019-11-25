import React, { Component } from 'react';
import axios from 'axios';
import { DotLoader } from '../myForm/Loader';
import Modal from '../common/Modal';
import RightContentCard from '../common/RightContentCard';
import GlobalModalForm from './GlobalModalForm';
import { errorToast, successToast } from '../../utils/toastHandler';
import ScheduleFormTable from './ScheduleFormTable';
import EditFormGuide from './EditFormGuide';
import AddForm from './AddForm';
import ManageModal from './ManageModal';
import Loader from '../common/Loader';

const formatDate = date => {
  const dateIdx = date.getDate();
  const monthIndex = date.getMonth() + 1;
  const year = date.getFullYear();
  return year + '-' + monthIndex + '-' + dateIdx;
};

class ScheduleForms extends Component {
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
      loaded: 0,
      formId: '',
      formTitle: '',
      isProjectForm: '',
      myFormList: props.myForms,
      projectFormList: props.projectForms,
      sharedFormList: props.sharedForms,
      isEditForm: false,
      fsxf: '',
      loadReq: false,
    };
  }

  requestScheduleForm(id, checkUrl) {
    const apiUrl = checkUrl
      ? `fv3/api/manage-forms/schedule/?project_id=${id}`
      : `fv3/api/manage-forms/schedule/?site_id=${id}`;

    axios
      .get(apiUrl)
      .then(res => {
        if (this._isMounted && res.data) {
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
        this.requestScheduleForm(id, true),
      );
    } else if (isSiteForm) {
      this.setState(
        {
          loader: true,
          isProjectForm: false,
        },
        this.requestScheduleForm(id, false),
      );
    }
  }

  onChangeHandler = async e => {
    const {
      state: { activeTab },
      props: { myForms, projectForms, sharedForms },
    } = this;
    const searchValue = e.target.value;

    if (searchValue) {
      if (activeTab == 'myForms') {
        const filteredData = await myForms.filter(form => {
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
        const awaitedData = await projectForms.map(project => {
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
        const filteredData = await sharedForms.filter(form => {
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
        myFormList: myForms,
        sharedFormList: sharedForms,
        projectFormList: projectForms,
      });
    }
  };

  changeDeployStatus = (formId, isDeploy) => {
    const { id, isProjectForm } = this.state;
    this.setState({ loadReq: true }, () => {
      const deployUrl = !!isProjectForm
        ? `fv3/api/manage-forms/deploy/?project_id=${id}&type=schedule&id=${formId}`
        : `fv3/api/manage-forms/deploy/?site_id=${id}&type=schedule&id=${formId}`;
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
    });
  };

  deleteItem = (formId, isDeploy) => {
    const { id, isProjectForm } = this.state;
    this.setState({ loadReq: true }, () => {
      const deleteUrl = !!isProjectForm
        ? `fv3/api/manage-forms/delete/?project_id=${id}&type=schedule&id=${formId}`
        : `fv3/api/manage-forms/delete/?site_id=${id}&type=schedule&id=${formId}`;
      axios
        .post(deleteUrl, { is_deployed: isDeploy })
        .then(res => {
          this.setState(
            {
              data: this.state.data.filter(each => each.id != formId),
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
    });
  };

  handleEditGuide = (data, formId, fsxf) => {
    this.setState({
      editGuide: !this.state.editGuide,
      guideData: data ? data : {},
      editFormId: formId,
      fsxf: fsxf,
    });
  };

  handleUpdateGuide = data => {
    const { fsxf, editFormId } = this.state;
    this.setState({ loadReq: true }, () => {
      const formData = new FormData();

      if (data.title) formData.append('title', data.title);
      if (data.text) formData.append('text', data.text);
      if (data.pdf) formData.append('pdf', data.pdf);
      if (data.is_pdf) formData.append('is_pdf', data.is_pdf);
      if (fsxf) formData.append('fsxf', fsxf);
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
          if (res.data)
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
        })
        .catch(err => {
          this.setState({ loadReq: false }, () => {
            const errors = err.response;
            errorToast(errors.data.error);
          });
        });
    });
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

  handleClosePopup = () => {
    const {
      myForms,
      projectForms,
      sharedForms,
      closePopup,
    } = this.props;
    this.setState({
      formTitle: '',
      formId: '',
      showFormModal: false,
      activeTab: 'myForms',
      myFormList: myForms,
      projectFormList: projectForms,
      sharedFormList: sharedForms,
      xf: '',
      isEditForm: false,
    });
    closePopup();
  };

  handleScheduleForm = data => {
    const { id, xf, isEditForm, isProjectForm } = this.state;
    this.setState({ loadReq: true }, () => {
      if (!isEditForm) {
        const postUrl = !!isProjectForm
          ? `fv3/api/manage-forms/schedule/?project_id=${id}`
          : `fv3/api/manage-forms/schedule/?site_id=${id}`;
        const payload = {
          xf: xf,
          default_submission_status: data.status,
          schedule_level_id: data.scheduleType,
          frequency: data.frequency,
          selected_days: data.selectedDays,
          date_range_start: formatDate(data.startDate),
          ...(!!data.endDate && {
            date_range_end: formatDate(data.endDate),
          }),
          setting: {
            notify_incomplete_schedule: data.notifyIncomplete,
            can_edit: data.isEdit,
            donor_visibility: data.isDonor,
            regions:
              !!data.regionSelected && data.regionSelected.length > 0
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
          .post(postUrl, payload)
          .then(res => {
            this.setState(
              {
                data: [...this.state.data, res.data],
                loadReq: false,
              },
              () => {
                this.handleClosePopup();
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
          ? `fv3/api/manage-forms/schedule/${data.id}/?project_id=${id}`
          : `fv3/api/manage-forms/schedule/${data.id}/?site_id=${id}`;
        const payload = {
          id: data.id,
          default_submission_status: data.status,
          schedule_level_id: data.scheduleType,
          frequency: data.frequency,
          selected_days: data.selectedDays,
          date_range_start: formatDate(data.startDate),
          ...(!!data.endDate && {
            date_range_end: formatDate(data.endDate),
          }),
          setting: {
            id: data.settingId,
            types:
              !!data.typeSelected && data.typeSelected.length > 0
                ? data.typeSelected.map(each => each.id)
                : [],
            regions:
              !!data.regionSelected && data.regionSelected.length > 0
                ? data.regionSelected.map(each => each.id)
                : [],
            notify_incomplete_schedule: data.notifyIncomplete,
            can_edit: data.isEdit,
            donor_visibility: data.isDonor,
            can_delete: data.isDelete,
            form: xf,
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
    });
  };

  handleEditScheduleForm = data => {
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
        myFormList,
        projectFormList,
        sharedFormList,
        isEditForm,
        isProjectForm,
      },
      props: {
        typeOptions,
        regionOptions,
        formLoader,
        commonPopupHandler,
        popupModal,
      },
      handleClosePopup,
    } = this;

    return (
      <div className="col-xl-9 col-lg-8">
        <RightContentCard
          title="app.scheduled-form"
          addButton={true}
          toggleModal={commonPopupHandler}
          showText={true}
        >
          {loader && <DotLoader />}

          {!loader && !!isProjectForm && (
            <ScheduleFormTable
              data={data}
              loader={loader}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              handleEditGuide={this.handleEditGuide}
              handleEditForm={this.handleEditScheduleForm}
              formTable="project"
            />
          )}
          {!loader && !isProjectForm && (
            <ScheduleFormTable
              data={data}
              loader={loader}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              handleEditGuide={this.handleEditGuide}
              handleEditForm={this.handleEditScheduleForm}
              formTable="site"
            />
          )}
          {popupModal && (
            <Modal
              title="Add Scheduled Form"
              toggleModal={handleClosePopup}
              classname="manage-body md-body"
              // handleSubmit={this.handleScheduleForm}
            >
              <GlobalModalForm
                formType="schedule"
                regionOptions={regionOptions}
                typeOptions={typeOptions}
                toggleFormModal={this.toggleFormModal}
                handleToggleForm={handleClosePopup}
                formTitle={formTitle}
                handleCreateForm={this.handleScheduleForm}
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
}
export default ScheduleForms;

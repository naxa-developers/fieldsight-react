import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";

import { DotLoader } from "../myForm/Loader";
import Modal from "../common/Modal";
import RightContentCard from "../common/RightContentCard";
import GlobalModalForm from "./GlobalModalForm";
import { errorToast, successToast } from "../../utils/toastHandler";
import ScheduleFormTable from "./ScheduleFormTable";
import EditFormGuide from "./EditFormGuide";
import AddForm from "./AddForm";

const formatDate = date => {
  const dateIdx = date.getDate();
  const monthIndex = date.getMonth() + 1;
  const year = date.getFullYear();
  return year + "-" + monthIndex + "-" + dateIdx;
};

class ScheduleForms extends Component {
  _isMounted = false;
  state = {
    id: this.props.match.params ? this.props.match.params.id : "",
    data: [],
    deployStatus: false,
    editGuide: false,
    guideData: {},
    editFormId: "",
    showFormModal: false,
    activeTab: "myForms",
    formData: {},
    xf: "",
    loader: false,
    loaded: 0,
    formId: "",
    formTitle: "",
    isProjectForm: "",
    myFormList: [],
    projectFormList: [],
    sharedFormList: [],
    isEditForm: false
  };

  requestScheduleForm(id) {
    axios
      .get(`fv3/api/manage-forms/schedule/?project_id=${id}`)
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
        params: { id }
      }
    } = this.props;
    const splitArr = url.split("/");
    const isProjectForm = splitArr.includes("project");

    if (isProjectForm) {
      this.setState(
        {
          loader: true,
          isProjectForm
        },
        this.requestScheduleForm(id)
      );
    }
  }

  changeDeployStatus = (formId, isDeploy) => {
    const { id } = this.state;
    axios
      .post(
        `fv3/api/manage-forms/deploy/?project_id=${id}&type=schedule&id=${formId}`,
        { is_deployed: !isDeploy }
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
            successToast("Form", "updated");
          }
        );
      })
      .catch(err => {});
  };
  deleteItem = (formId, isDeploy) => {
    const { id } = this.state;
    axios
      .post(
        `fv3/api/manage-forms/delete/?project_id=${id}&type=schedule&id=${formId}`,
        { is_deployed: isDeploy }
      )
      .then(res => {
        this.setState(
          {
            data: this.state.data.filter(each => each.id != formId)
          },
          () => {
            successToast("Form", "deleted");
          }
        );
      })
      .catch(err => {});
  };

  handleEditGuide = (data, formId) => {
    this.setState({
      editGuide: !this.state.editGuide,
      guideData: data ? data : {},
      editFormId: formId
    });
  };
  handleUpdateGuide = data => {
    const { id } = this.state;
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.text) formData.append("text", data.text);
    if (data.pdf) {
      formData.append("is_pdf", data.pdf ? true : false);
      formData.append("pdf", data.pdf);
    }
    if (data.fsxf) formData.append("fsxf", data.fsxf);
    if (data.images && data.images.length > 0) {
      data.images.map((each, i) => {
        if (!each.image) formData.append(`new_images_${i + 1}`, each);
      });
    }
    if (data.id) {
      formData.append("id", data.id);
    }
    axios
      .post(`forms/api/save_educational_material/`, formData)
      .then(res => {
        this.setState(
          {
            editGuide: false
          },
          () => {
            this.requestGeneralForm(id);
            successToast("update", "successfully");
          }
        );
      })
      .catch(err => {
        errorToast(err);
      });
  };

  handleMyFormChange = (e, title) => {
    this.setState({
      formId: e.target.value,
      formTitle: title
    });
  };
  handleSaveForm = () => {
    this.setState({
      xf: this.state.formId,
      showFormModal: !this.state.showFormModal
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
      projectFormList: this.props.projectForms
    });
  };
  handleClosePopup = () => {
    this.setState({
      formTitle: "",
      formId: "",
      showFormModal: false,
      activeTab: "myForms",
      myFormList: [],
      projectFormList: [],
      sharedFormList: [],
      xf: ""
    });
    this.props.closePopup();
  };
  handleScheduleForm = data => {
    const { id, xf, isEditForm } = this.state;
    if (!isEditForm) {
      const payload = {
        xf: xf,
        default_submission_status: data.status,
        schedule_level_id: data.scheduleType,
        frequency: data.frequency,

        selected_days: data.selectedDays,
        date_range_start: formatDate(data.startDate),
        ...(!!data.endDate && { date_range_end: formatDate(data.endDate) }),
        setting: {
          notify_incomplete_schedule: data.notifyIncomplete,
          can_edit: data.isEdit,
          donor_visibility: data.isDonor,
          regions:
            data.regionSelected.length > 0
              ? data.regionSelected.map(each => each.id)
              : [],
          can_delete: data.isDelete,
          types:
            data.typeSelected.length > 0
              ? data.typeSelected.map(each => each.id)
              : []
        }
      };

      axios
        .post(`fv3/api/manage-forms/schedule/?project_id=${id}`, payload)
        .then(res => {
          this.setState(
            {
              data: [...this.state.data, res.data]
            },
            () => {
              this.handleClosePopup();
              successToast("form ", "added");
            }
          );
        })
        .catch(err => {
          errorToast(err);
        });
    } else {
      const payload = {
        id: data.id,

        default_submission_status: data.status,
        schedule_level_id: data.scheduleType,
        frequency: data.frequency,
        selected_days: data.selectedDays,
        date_range_start: formatDate(data.startDate),
        ...(!!data.endDate && { date_range_end: formatDate(data.endDate) }),
        setting: {
          id: data.settingId,
          types:
            data.typeSelected.length > 0
              ? data.typeSelected.map(each => each.id)
              : [],
          regions:
            data.regionSelected.length > 0
              ? data.regionSelected.map(each => each.id)
              : [],
          notify_incomplete_schedule: data.notifyIncomplete,
          can_edit: data.isEdit,
          donor_visibility: data.isDonor,
          can_delete: data.isDelete,
          form: xf
        }
      };

      axios
        .put(
          `fv3/api/manage-forms/schedule/${data.id}/?project_id=${id}`,
          payload
        )
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
                data: newArr
              };
            },
            () => {
              this.handleClosePopup();
              successToast("form", "updated");
            }
          );
        })
        .catch(err => {
          errorToast(err);
        });
    }
  };
  handleEditScheduleForm = data => {
    this.setState(
      {
        formData: data,
        isEditForm: true,
        formTitle: data.xf.title
      },
      () => {
        this.props.commonPopupHandler();
      }
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
        isEditForm
      },
      props: { typeOptions, regionOptions },
      handleClosePopup
    } = this;
    // console.log("props", this.props);

    return (
      <div className="col-xl-9 col-lg-8">
        <RightContentCard
          title="Schedule Forms"
          addButton={true}
          toggleModal={this.props.commonPopupHandler}
          showText={true}
        >
          {loader && <DotLoader />}
          {!loader && (
            <ScheduleFormTable
              data={data}
              loader={loader}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              handleEditGuide={this.handleEditGuide}
              handleEditForm={this.handleEditScheduleForm}
            />
          )}

          {this.props.popupModal && (
            <Modal
              title="Add Schedule Form"
              toggleModal={handleClosePopup}
              classname="manage-body md-body"
            >
              <GlobalModalForm
                formType="schedule"
                regionOptions={regionOptions}
                typeOptions={typeOptions}
                myForms={this.props.myForms}
                projectForms={this.props.projectForms}
                sharedForms={this.props.sharedForms}
                toggleFormModal={this.toggleFormModal}
                handleToggleForm={handleClosePopup}
                formTitle={formTitle}
                handleCreateForm={this.handleScheduleForm}
                formData={formData}
                isEditForm={isEditForm}
                isProjectWide={false}
              />
            </Modal>
          )}
          {editGuide && (
            <Modal title="Form Guide" toggleModal={this.handleEditGuide}>
              <EditFormGuide
                data={guideData}
                handleCancel={this.handleEditGuide}
                handleUpdateGuide={this.handleUpdateGuide}
                handleCreateGuide={this.handleCreateGuide}
              />
            </Modal>
          )}
          {showFormModal && (
            <Modal
              title="Add Form"
              toggleModal={this.toggleFormModal}
              showButton={true}
              showText="Create Form"
              url="/forms/create/"
              classname="manage-body md-body"
            >
              <AddForm
                activeTab={activeTab}
                toggleTab={this.toggleTab}
                onChangeHandler={this.onChangeHandler}
                formList={myFormList}
                projectList={projectFormList}
                sharedList={sharedFormList}
                handleRadioChange={this.handleMyFormChange}
                handleSaveForm={this.handleSaveForm}
              />
            </Modal>
          )}
        </RightContentCard>
      </div>
    );
  }
}
export default ScheduleForms;

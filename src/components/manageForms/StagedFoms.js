import React, { Component } from "react";
import axios from "axios";

import { DotLoader } from "../myForm/Loader";
import Modal from "../common/Modal";
import AddSubstageForm from "./AddSubstageForm";
import AddForm from "./AddForm";
import { errorToast, successToast } from "../../utils/toastHandler";
import EditFormGuide from "./EditFormGuide";
import SortableStage from "./SortableStage";
import AddStageForm from "./AddStageForm";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ManageModal from "./ManageModal";
import Loader from "../common/Loader";

class StagedForms extends Component {
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
    myFormList: this.props.myForms,
    projectFormList: this.props.projectForms,
    sharedFormList: this.props.sharedForms,
    isEditForm: false,
    subStageData: [],
    showSubstageForm: false,
    selectedStage: {},
    loadSubStage: false,
    stageId: "",
    substageId: "",
    isStageReorder: false,
    newStageOrder: [],
    isStageReorderCancel: true,
    isSubstageReorder: false,
    isSubstageReorderCancel: true,
    newSubstageOrder: [],
    reOrderDisable: true,
    subStageReorderDisable: true,
    stagedRegions: [],
    stagedTypes: [],
    loadReq: false
  };

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
    const isSiteForm = splitArr.includes("site");
    if (isProjectForm) {
      this.setState(
        {
          loader: true,
          isProjectForm: true
        },
        () => {
          this.requestStagedData(id, true);
        }
      );
    } else if (isSiteForm) {
      this.setState(
        {
          loader: true,
          isProjectForm: false
        },
        () => {
          this.requestStagedData(id, false);
        }
      );
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.myForms != this.props.myForms) {
      this.setState({
        myFormList: this.props.myForms
      });
    } else if (nextProps.projectForms != this.props.projectForms) {
      this.setState({
        projectFormList: this.props.projectForms
      });
    } else if (nextProps.sharedForms != this.props.sharedForms) {
      this.setState({
        sharedFormList: this.props.sharedForms
      });
    }
  }

  requestStagedData = (id, checkUrl) => {
    const apiUrl = checkUrl
      ? `fv3/api/manage-forms/stages/?project_id=${id}`
      : `fv3/api/manage-forms/stages/?site_id=${id}`;

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
  };

  handleSubmitStageForm = data => {
    const { name, desc, selectedRegion, selectedType, order, id } = data;
    this.setState({ loadReq: true }, () => {
      const mapRegion =
        !!selectedRegion && !!selectedRegion.length > 0
          ? selectedRegion.map(each => each.id)
          : [];
      const mapType =
        !!selectedType && !!selectedType.length > 0
          ? selectedType.map(each => each.id)
          : [];
      const newOrder =
        typeof order == "number" ? order : this.state.data.length + 1;
      if (this.props.popupModal && order == newOrder) {
        const updateStageApi = !!this.state.isProjectForm
          ? `fv3/api/manage-forms/stages/${id}/?project_id=${this.state.id}`
          : `fv3/api/manage-forms/stages/${id}/?site_id=${this.state.id}`;
        const body = {
          name: name,
          tags: mapType,
          regions: mapRegion,
          order: newOrder,
          description: desc,
          id: id
        };
        axios
          .put(updateStageApi, body)
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
                  stagedRegions: res.data.regions,
                  stagedTypes: res.data.tags,
                  loadReq: false
                };
              },
              () => {
                this.handleClearStageForm();
                successToast("form", "updated");
              }
            );
          })
          .catch(err => {
            this.setState({ loadReq: false }, () => {
              const errors = err.response;
              errorToast(errors.data.error);
            });
          });
      } else {
        const postStageApi = !!this.state.isProjectForm
          ? `fv3/api/manage-forms/stages/?project_id=${this.state.id}`
          : `fv3/api/manage-forms/stages/?site_id=${this.state.id}`;
        const body = {
          name: name,
          tags: mapType,
          regions: mapRegion,
          order: newOrder,
          description: desc
        };
        axios
          .post(postStageApi, body)
          .then(res => {
            this.setState(
              {
                data: [...this.state.data, res.data],
                stageRegions: res.data.regions,
                stagedTypes: res.data.tags,
                loadReq: false
              },
              () => {
                this.handleClearStageForm();
                successToast("form", "added");
              }
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

  handleClickEdit = stageData => {
    this.setState(
      {
        selectedStage: stageData
      },
      () => {
        this.props.commonPopupHandler();
      }
    );
  };
  handleClearStageForm = () => {
    this.setState(
      {
        selectedStage: {}
      },
      () => {
        this.props.closePopup();
      }
    );
  };
  handleStageReorder = () => {
    this.setState({
      isStageReorder: !this.state.isStageReorder,
      isStageReorderCancel: !this.state.isStageReorderCancel
    });
  };
  handleNewStageOrder = list => {
    this.setState({
      newStageOrder: list,
      reOrderDisable: false
    });
  };

  handleSaveStageReorder = () => {
    axios
      .post(`fv3/api/forms/reorder/stage/`, this.state.newStageOrder)
      .then(res => {
        this.setState(
          {
            data: res.data.data,
            isStageReorder: false,
            reOrderDisable: true
            // isStageReorderCancel: true
          },
          () => {
            successToast("reorder", "updated");
          }
        );
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors.data.error);
      });
  };
  handleSubStageForm = () => {
    this.setState({
      showSubstageForm: !this.state.showSubstageForm
    });
  };
  handleClosePopup = () => {
    this.setState({
      formTitle: "",
      formId: "",
      showFormModal: false,
      activeTab: "myForms",
      myFormList: this.props.myForms,
      projectFormList: this.props.projectForms,
      sharedFormList: this.props.sharedForms,
      xf: "",
      isEditForm: false
    });
    this.handleSubStageForm();
  };

  handleCreateForm = data => {
    const { stageId, substageId, xf } = this.state;
    this.setState({ loadReq: true }, () => {
      if (!!substageId) {
        const body = {
          id: substageId,
          weight: JSON.parse(data.weight),
          name: data.substageTitle,
          description: data.substageDesc,
          order: data.order,
          xf: !!xf == true ? JSON.parse(xf) : "",
          default_submission_status: data.status,
          setting: {
            types:
              !!data.typeSelected && data.typeSelected.length > 0
                ? data.typeSelected.map(each => each.id)
                : [],
            regions:
              !!data.regionSelected && data.regionSelected.length > 0
                ? data.regionSelected.map(each => each.id)
                : [],
            donor_visibility: data.isDonor,
            can_edit: data.isEdit,
            can_delete: data.isDelete,
            id: data.settingId && data.settingId
          }
        };

        axios
          .put(
            `fv3/api/manage-forms/sub-stages/${substageId}/?stage_id=${stageId}`,
            body
          )
          .then(res => {
            this.setState(
              state => {
                const data = this.state.subStageData;
                const newArr = data.map(each => {
                  if (each.id == res.data.id) {
                    return (each = res.data);
                  } else {
                    return each;
                  }
                });
                return {
                  subStageData: newArr,
                  loadReq: false
                };
              },
              () => {
                this.handleClosePopup();

                successToast("form", "updated");
              }
            );
          })
          .catch(err => {
            this.setState({ loadReq: false }, () => {
              const errors = err.response;
              errorToast(errors.data.error);
            });
          });
      } else {
        const body = {
          weight: JSON.parse(data.weight),
          name: data.substageTitle,
          description: data.substageDesc,
          order: this.state.subStageData.length + 1,
          xf: !!xf == true ? JSON.parse(xf) : "",
          default_submission_status: data.status,
          setting: {
            types:
              !!data.typeSelected && data.typeSelected.length > 0
                ? data.typeSelected.map(each => each.id)
                : [],
            regions:
              !!data.regionSelected && data.regionSelected.length > 0
                ? data.regionSelected.map(each => each.id)
                : [],
            donor_visibility: data.isDonor,
            can_edit: data.isEdit,
            can_delete: data.isDelete
          }
        };

        axios
          .post(`fv3/api/manage-forms/sub-stages/?stage_id=${stageId}`, body)
          .then(res => {
            this.setState(
              {
                subStageData: [...this.state.subStageData, res.data],
                loadReq: false
              },
              () => {
                this.handleClosePopup();
                successToast("form", "created");
              }
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

  handleRequestSubStage = stage => {
    if (stage.id != this.state.stageId) {
      this.setState(
        {
          loadSubStage: true,
          order: stage.order,
          stageId: stage.id,
          isSubstageReorder: false,
          isSubstageReorderCancel: true,
          stagedRegions: stage.regions,
          stagedTypes: stage.tags
        },
        () => {
          axios
            .get(`fv3/api/manage-forms/sub-stages/?stage_id=${stage.id}`)
            .then(res => {
              this.setState({
                loadSubStage: false,
                subStageData: res.data
              });
            })
            .catch(err => {
              const errors = err.response;
              errorToast(errors.data.error);
            });
        }
      );
    }
  };

  handleSubstageReorder = () => {
    this.setState({
      isSubstageReorder: !this.state.isSubstageReorder,
      isSubstageReorderCancel: !this.state.isSubstageReorderCancel
    });
  };

  handleNewSubstageOrder = list => {
    this.setState({
      newSubstageOrder: list,
      subStageReorderDisable: false
    });
  };

  handleSaveSubstageReorder = () => {
    axios
      .post(`fv3/api/forms/reorder/substage/`, this.state.newSubstageOrder)
      .then(res => {
        this.setState(
          {
            subStageData: res.data.data,
            isSubstageReorder: false
            // isStageReorderCancel: true
          },
          () => {
            successToast("reorder", "updated");
          }
        );
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors.data.error);
      });
  };

  changeDeployStatus = (formId, isDeploy) => {
    const { id, isProjectForm } = this.state;
    this.setState({ loadReq: true }, () => {
      const deployUrl = !!isProjectForm
        ? `fv3/api/manage-forms/deploy/?project_id=${id}&type=substage&id=${formId}`
        : `fv3/api/manage-forms/deploy/?site_id=${id}&type=substage&id=${formId}`;
      axios
        .post(deployUrl, { is_deployed: !isDeploy })
        .then(res => {
          this.setState(
            state => {
              const newData = this.state.subStageData;
              newData.map(each => {
                const arrItem = { ...each };

                if (each.id == formId) {
                  each.is_deployed = !isDeploy;
                }
                return arrItem;
              });
              return { subStageData: newData, loadReq: false };
            },
            () => {
              successToast("Deploy Status", "updated");
            }
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
      const deployUrl = !!isProjectForm
        ? `fv3/api/manage-forms/delete/?project_id=${id}&type=substage&id=${formId}`
        : `fv3/api/manage-forms/delete/?site_id=${id}&type=substage&id=${formId}`;

      axios
        .post(deployUrl, { is_deployed: isDeploy })
        .then(res => {
          this.setState(
            {
              subStageData: this.state.subStageData.filter(
                each => each.id != formId
              ),
              loadReq: false
            },
            () => {
              successToast("Form", "deleted");
            }
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

  handleEditGuide = (data, formId) => {
    this.setState({
      editGuide: !this.state.editGuide,
      guideData: data ? data : {},
      editFormId: formId
    });
  };

  handleUpdateGuide = data => {
    const { editFormId } = this.state;
    this.setState({ loadReq: true }, () => {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.text) formData.append("text", data.text);
      if (data.pdf) formData.append("pdf", data.pdf);
      if (data.is_pdf) formData.append("is_pdf", data.is_pdf);
      // if (editFormId) formData.append("fsxf", editFormId);
      if (data.images && data.images.length > 0) {
        data.images.map((each, i) => {
          if (!each.image) formData.append(`new_images_${i + 1}`, each);
        });
      }
      if (data.id) {
        formData.append("id", data.id);
      }
      formData.append("stage", editFormId);
      axios
        .post(`forms/api/save_educational_material/`, formData)
        .then(res => {
          if (res.data)
            this.setState(
              state => {
                const item = this.state.subStageData;
                item.map(each => {
                  const newItem = { ...each };
                  if (each.id == editFormId) {
                    each.em = res.data;
                  }
                  return newItem;
                });

                return {
                  editGuide: false,
                  subStageData: item,
                  loadReq: false
                };
              },
              () => {
                successToast("form", "updated");
              }
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

  onChangeHandler = async e => {
    const { activeTab } = this.state;
    const searchValue = e.target.value;

    if (searchValue) {
      if (activeTab == "myForms") {
        const filteredData = await this.props.myForms.filter(form => {
          return (
            form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            form.owner.toLowerCase().includes(searchValue.toLowerCase())
          );
        });

        this.setState({
          myFormList: filteredData
        });
      } else if (activeTab == "projectForms") {
        const awaitedData = await this.props.projectForms.map(project => {
          const filteredData = project.forms.filter(form => {
            return (
              form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
              form.owner.toLowerCase().includes(searchValue.toLowerCase())
            );
          });
          return { ...project, forms: filteredData };
        });
        this.setState({
          projectFormList: awaitedData
        });
      } else if (activeTab == "sharedForms") {
        const filteredData = await this.props.sharedForms.filter(form => {
          return (
            form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            form.owner.toLowerCase().includes(searchValue.toLowerCase())
          );
        });

        this.setState({
          sharedFormList: filteredData
        });
      }
    } else {
      this.setState({
        myFormList: this.props.myForms,
        sharedFormList: this.props.sharedForms,
        projectFormList: this.props.projectForms
      });
    }
  };

  editSubStageForm = formData => {
    this.setState(
      {
        formData: formData,
        xf: formData.xf && formData.xf.id,
        formId: formData.xf && formData.xf.id,
        formTitle: formData.xf && formData.xf.title,
        substageId: formData.id,
        isEditForm: true
      },
      () => {
        this.handleSubStageForm();
      }
    );
  };

  handleDeployAllSubstages = toDeploy => {
    const { id, stageId, subStageData, isProjectForm } = this.state;
    this.setState({ loadReq: true }, () => {
      const deployAllSubstageUrl = !!isProjectForm
        ? `fv3/api/manage-forms/deploy/?project_id=${id}&type=stage&id=${stageId}`
        : `fv3/api/manage-forms/deploy/?site_id=${id}&type=stage&id=${stageId}`;
      axios
        .post(deployAllSubstageUrl, {
          is_deployed: toDeploy
        })
        .then(res => {
          if (res.data && !!res.data.message)
            this.setState(
              state => {
                const data = subStageData;
                data.map(sub => {
                  const arrItem = { ...sub };
                  sub.is_deployed = toDeploy;
                  return arrItem;
                });
                return {
                  subStageData: data,
                  loadReq: false
                };
              },
              () => {
                successToast("Deploy Status", "updated");
              }
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

  handleDeleteStage = () => {
    const { id, stageId, isProjectForm } = this.state;
    this.setState({ loadReq: true }, () => {
      const deleteAllSubstageUrl = !!isProjectForm
        ? `fv3/api/manage-forms/delete/?project_id=${id}&type=stage&id=${stageId}`
        : `fv3/api/manage-forms/delete/?site_id=${id}&type=stage&id=${stageId}`;
      axios
        .post(deleteAllSubstageUrl)
        .then(res => {
          this.setState(
            state => {
              const data = this.state.data;
              if (res.data.message == "success") {
                return {
                  data: data.filter(each => each.id != stageId),
                  loadReq: false
                };
              }
            },
            () => {
              successToast("Deleted", "successfully");
            }
          );

          // if (!!res.data)
          //   this.setState(
          //     {
          //       subStageData: [],
          //       loadReq: false
          //     },
          //     () => {
          //       successToast("Deleted", "successfully");
          //     }
          //   );
        })
        .catch(err => {
          this.setState({ loadReq: false }, () => {
            const errors = err.response;
            errorToast(errors.data.error);
          });
        });
    });
  };

  handleDeployAllStages = toDeploy => {
    const { id, isProjectForm } = this.state;
    this.setState({ loadReq: true }, () => {
      const deployAllUrl = !!isProjectForm
        ? `fv3/api/manage-forms/deploy/?project_id=${id}&type=all&id=${id}`
        : `fv3/api/manage-forms/deploy/?site_id=${id}&type=all&id=${id}`;
      axios
        .post(deployAllUrl, {
          is_deployed: toDeploy
        })
        .then(res => {
          this.setState(
            {
              loadReq: false
            },
            () => {
              if (!!isProjectForm) this.requestStagedData(id, true);
              else this.requestStagedData(id, false);
              successToast("form", "updated");
            }
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

  handleDeleteAllStages = toDeploy => {
    const { id, isProjectForm } = this.state;
    const deleteAllUrl = !!isProjectForm
      ? `fv3/api/manage-forms/delete/?project_id=${id}&type=all&id=${id}`
      : `fv3/api/manage-forms/delete/?site_id=${id}&type=all&id=${id}`;

    axios
      .post(deleteAllUrl, {
        is_deployed: toDeploy
      })
      .then(res => {
        if (!!res.data)
          this.setState(
            {
              data: []
            },
            () => {
              successToast("form", "deleted");
            }
          );
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors.data.error);
      });
  };

  render() {
    const {
      props: { regionOptions, typeOptions },
      state: {
        data,
        loader,
        subStageData,
        loadSubStage,
        showSubstageForm,
        selectedStage,
        formTitle,
        formData,
        showFormModal,
        activeTab,
        myFormList,
        projectFormList,
        sharedFormList,
        editGuide,
        guideData,
        isStageReorder,
        isStageReorderCancel,
        isSubstageReorder,
        isSubstageReorderCancel,
        isProjectForm,
        reOrderDisable,
        subStageReorderDisable,
        isEditForm,
        stagedRegions,
        stagedTypes
      }
    } = this;
    let deployCount = 0;
    let canReorder = "";
    let canDeleteStage = "";

    data.map(each => {
      deployCount += each.undeployed_count;
    });

    const arrToReorder = data.map(each => {
      if (!!each.site) {
        return true;
      } else {
        return false;
      }
    });
    canReorder =
      arrToReorder.length > 0
        ? arrToReorder.indexOf(false) > -1
          ? false
          : true
        : "";

    const arrDelete =
      subStageData.length > 0 &&
      subStageData.map(sub => {
        if (sub.is_deployed) {
          return true;
        } else {
          return false;
        }
      });
    canDeleteStage =
      arrDelete.length > 0 ? (arrDelete.indexOf(true) > -1 ? false : true) : "";
    return (
      <div className="col-xl-9 col-lg-8">
        <div className="card">
          <div className="card-header main-card-header">
            <h5>Staged Forms</h5>
            {!!isProjectForm && (
              <div className="add-btn">
                <a onClick={this.handleStageReorder}>
                  {!isStageReorder ? (
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
                      overlay={<Tooltip> Cancel Reorder</Tooltip>}
                    >
                      <span className="reorder">
                        <i className="la la-close" />
                      </span>
                    </OverlayTrigger>
                  )}
                </a>
                {isStageReorder && (
                  <a
                    onClick={this.handleSaveStageReorder}
                    className={`${reOrderDisable ? "disabled" : ""}`}
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip> Save</Tooltip>}
                    >
                      <span>
                        <i className="la la-save" />
                      </span>
                    </OverlayTrigger>
                  </a>
                )}
                {/* {deployCount > 0 && ( */}
                <a
                  className={`${
                    deployCount > 0 ? "deploy-active" : "deploy-inactive"
                  }`}
                  onClick={() => this.handleDeployAllStages(true)}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip> Deploy All Stages</Tooltip>}
                  >
                    <span className="">
                      <i className="la la-rocket" />
                    </span>
                  </OverlayTrigger>
                </a>
                {/* )} */}
              </div>
            )}
            {!isProjectForm && canReorder && (
              <div className="add-btn">
                <a onClick={this.handleStageReorder}>
                  {!isStageReorder ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Reorder Stages</Tooltip>}
                    >
                      <span className="reorder">
                        <i className="la la-ellipsis-v" />
                        <i className="la la-ellipsis-v" />
                      </span>
                    </OverlayTrigger>
                  ) : (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip> Cancel Reorder</Tooltip>}
                    >
                      <span className="reorder">
                        <i className="la la-close" />
                      </span>
                    </OverlayTrigger>
                  )}
                </a>
                {isStageReorder && (
                  <a
                    onClick={this.handleSaveStageReorder}
                    className={`${reOrderDisable ? "disabled" : ""}`}
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip> Save</Tooltip>}
                    >
                      <span>
                        <i className="la la-save" />
                      </span>
                    </OverlayTrigger>
                  </a>
                )}

                <a
                  className={`${
                    deployCount > 0 ? "deploy-active" : "deploy-inactive"
                  }`}
                  onClick={() => this.handleDeployAllStages(true)}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip> Deploy All Stages</Tooltip>}
                  >
                    <span className="">
                      <i className="la la-rocket" />
                    </span>
                  </OverlayTrigger>
                </a>
              </div>
            )}
          </div>
          {loader && <DotLoader />}
          {!loader && (
            <>
              <SortableStage
                stage={data}
                handleRequestSubStage={this.handleRequestSubStage}
                handleClickEdit={this.handleClickEdit}
                loadSubStage={loadSubStage}
                subStageData={subStageData}
                handleEditGuide={this.handleEditGuide}
                changeDeployStatus={this.changeDeployStatus}
                deleteItem={this.deleteItem}
                editSubStageForm={this.editSubStageForm}
                handleSubStageForm={this.handleSubStageForm}
                reorder={isStageReorder}
                isStageReorderCancel={isStageReorderCancel}
                handleNewStageOrder={this.handleNewStageOrder}
                reorderSubstage={isSubstageReorder}
                isSubstageReorderCancel={isSubstageReorderCancel}
                handleSubstageReorder={this.handleSubstageReorder}
                handleSaveSubstageReorder={this.handleSaveSubstageReorder}
                handleNewSubstageOrder={this.handleNewSubstageOrder}
                handleDeployAll={this.handleDeployAllSubstages}
                // handleDeleteAll={this.handleDeleteStage}
                isProjectForm={isProjectForm}
                subStageReorderDisable={subStageReorderDisable}
              />
              <div className="card-body pdt-0">
                <div className="add-btn  stage-add">
                  <a onClick={this.props.commonPopupHandler}>
                    Add Stage
                    <span>
                      <i className="la la-plus" />
                    </span>
                  </a>
                </div>
              </div>
            </>
          )}
          {this.props.popupModal && (
            <Modal
              title="Stage Form"
              toggleModal={this.handleClearStageForm}
              classname="manage-body md-body"
              // handleSubmit={this.handleSubmitStageForm}
            >
              <AddStageForm
                regionOptions={regionOptions}
                typeOptions={typeOptions}
                handleSubmit={this.handleSubmitStageForm}
                stageData={selectedStage}
                canDeleteStage={canDeleteStage}
                handleDeleteStage={this.handleDeleteStage}
              />
            </Modal>
          )}
          {showSubstageForm && (
            <Modal
              title="SubStage Form"
              toggleModal={this.handleClosePopup}
              classname="manage-body md-body"
              // handleSubmit={this.handleCreateForm}
            >
              <AddSubstageForm
                regionOptions={regionOptions}
                typeOptions={typeOptions}
                toggleFormModal={this.toggleFormModal}
                handleToggleForm={this.handleClosePopup}
                formTitle={formTitle}
                handleCreateForm={this.handleCreateForm}
                formData={!!isEditForm && formData}
                isEditForm={isEditForm}
                stagedRegions={stagedRegions}
                stagedTypes={stagedTypes}
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
                loader={this.props.formLoader}
              />
            </ManageModal>
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
          {this.state.loadReq && <Loader />}
        </div>
      </div>
    );
  }
}
export default StagedForms;

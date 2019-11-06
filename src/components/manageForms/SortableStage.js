import React, { Component } from "react";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { Accordion, Card, Button } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import SubStageTable from "./subStageTable";
import { DotLoader } from "../myForm/Loader";

const DragHandle = sortableHandle(({ name, order }) => (
  <Card.Header>
    <span className="drag-icon">
      <i className="la la-ellipsis-v"></i>
      <i className="la la-ellipsis-v"></i>
    </span>
    <h5>
      <Accordion.Toggle
        as={Button}
        variant="link"
        // eventKey={`${order}`}
        // style={{ pointerEvents: "none" }}
      >
        {name}
      </Accordion.Toggle>
    </h5>
  </Card.Header>
));

const SortableItem = sortableElement(({ name, order }) => (
  <div className="dragable-stage">
    <DragHandle name={name} order={order} />
  </div>
));

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <Accordion
      defaultActiveKey={0}
      className="accordion stage-accordion card-body"
    >
      {children}
    </Accordion>
  );
});

class SortableStage extends Component {
  state = {
    data: this.props.stage
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.stage != this.props.stage) {
      this.setState({
        data: nextProps.stage
      });
    }
    if (nextProps.isStageReorderCancel != this.props.isStageReorderCancel) {
      this.setState(state => {
        if (nextProps.isStageReorderCancel) {
          return { data: this.props.stage };
        }
      });
    }
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(
      ({ data }) => ({
        data: arrayMove(data, oldIndex, newIndex)
      }),
      () => {
        this.props.handleNewStageOrder(this.state.data);
      }
    );
  };

  render() {
    const {
      state: { data },
      props: {
        handleRequestSubStage,
        handleClickEdit,
        loadSubStage,
        handleEditGuide,
        changeDeployStatus,
        deleteItem,
        editSubStageForm,
        subStageData,
        handleSubStageForm,
        reorder,
        reorderSubstage,
        handleSubstageReorder,
        handleSaveSubstageReorder,
        handleDeployAll,
        isProjectForm
      }
    } = this;
    let toDeploy = "";
    let toDelete = "";
    const arrDeploy =
      subStageData.length > 0 &&
      subStageData.map(sub => {
        if (sub.is_deployed) {
          return false;
        } else {
          return true;
        }
      });
    const arrDelete =
      subStageData.length > 0 &&
      subStageData.map(sub => {
        if (sub.is_deployed) {
          return true;
        } else {
          return false;
        }
      });

    toDeploy =
      arrDeploy.length > 0 ? (arrDeploy.indexOf(true) > -1 ? true : false) : "";
    toDelete =
      arrDelete.length > 0 ? (arrDelete.indexOf(true) > -1 ? false : true) : "";

    return (
      <>
        {data.length == 0 ? (
          <div>No Stage added yet.</div>
        ) : (
          <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
            {data.length > 0 &&
              data.map((each, index) => (
                <Card key={`key_${index}`} className=" no-boxshadow mrb-15">
                  {!!reorder ? (
                    <SortableItem
                      key={`item-${each.id}`}
                      index={index}
                      name={each.name}
                      order={each.order}
                    />
                  ) : (
                    <Card.Header>
                      <h5>
                        {!!isProjectForm && (
                          <span
                            className="edit-stage"
                            data-tab="addSubStage-popup"
                            onClick={() => handleClickEdit(each)}
                          >
                            <i className="la la-edit"></i>
                          </span>
                        )}
                        {!isProjectForm && !!each.site && (
                          <span
                            className="edit-stage"
                            data-tab="addSubStage-popup"
                            onClick={() => handleClickEdit(each)}
                          >
                            <i className="la la-edit"></i>
                          </span>
                        )}
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey={`${each.id}`}
                          onClick={() => {
                            handleRequestSubStage(each);
                          }}
                        >
                          <div>{each.name}</div>
                        </Accordion.Toggle>
                      </h5>
                    </Card.Header>
                  )}

                  <Accordion.Collapse eventKey={`${each.id}`}>
                    <Card.Body>
                      {!!isProjectForm && (
                        <div className="add-btn  outline-btn">
                          {subStageData && subStageData.length > 1 && (
                            <a
                              className="pending"
                              data-tab="addSubStage-popup"
                              onClick={handleSubstageReorder}
                            >
                              {!reorderSubstage ? "" : ""}
                              {!reorderSubstage ? (
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
                          {reorderSubstage && (
                            <a
                              data-tab="addSubStage-popup"
                              onClick={handleSaveSubstageReorder}
                              className={`${
                                this.props.subStageReorderDisable
                                  ? "disabled"
                                  : ""
                              }`}
                            >
                              {/* Save Order */}
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
                          {subStageData && subStageData.length > 0 && toDeploy && (
                            <a
                              data-tab="addSubStage-popup"
                              onClick={() => handleDeployAll(true)}
                            >
                              {/* Deploy Substages */}
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>Deploy All Substages</Tooltip>
                                }
                              >
                                <span className="active deploy">
                                  <i className="la la-rocket" />
                                </span>
                              </OverlayTrigger>
                            </a>
                          )}

                          {subStageData &&
                            subStageData.length > 0 &&
                            !toDeploy && (
                              <a
                                data-tab="addSubStage-popup"
                                onClick={() => handleDeployAll(false)}
                              >
                                {/* Undeploy Substages */}
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>Undeploy All Substages</Tooltip>
                                  }
                                >
                                  <span>
                                    <i className="undeployed la la-rocket" />
                                  </span>
                                </OverlayTrigger>
                              </a>
                            )}
                        </div>
                      )}
                      {!isProjectForm && !!each.site && (
                        <div className="add-btn  outline-btn">
                          {subStageData && subStageData.length > 1 && (
                            <a
                              className="pending"
                              data-tab="addSubStage-popup"
                              onClick={handleSubstageReorder}
                            >
                              {!reorderSubstage ? "" : ""}
                              {!reorderSubstage ? (
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
                          {reorderSubstage && (
                            <a
                              data-tab="addSubStage-popup"
                              onClick={handleSaveSubstageReorder}
                            >
                              {/* Save Order */}
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
                          {subStageData && subStageData.length > 0 && toDeploy && (
                            <a
                              data-tab="addSubStage-popup"
                              onClick={() => handleDeployAll(true)}
                            >
                              {/* Deploy Substages */}
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>Deploy All Substages</Tooltip>
                                }
                              >
                                <span className="active deploy">
                                  <i className="la la-rocket" />
                                </span>
                              </OverlayTrigger>
                            </a>
                          )}
                          {subStageData &&
                            subStageData.length > 0 &&
                            !toDeploy && (
                              <a
                                data-tab="addSubStage-popup"
                                onClick={() => handleDeployAll(false)}
                              >
                                {/* Undeploy Substages */}
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>Undeploy All Substages</Tooltip>
                                  }
                                >
                                  <span>
                                    <i className="undeployed la la-rocket" />
                                  </span>
                                </OverlayTrigger>
                              </a>
                            )}
                        </div>
                      )}

                      {!!loadSubStage && <DotLoader />}
                      {!loadSubStage && !!isProjectForm && !!subStageData && (
                        <SubStageTable
                          data={subStageData}
                          handleEditGuide={handleEditGuide}
                          changeDeployStatus={changeDeployStatus}
                          deleteItem={deleteItem}
                          editSubStageForm={editSubStageForm}
                          reorderSubstage={this.props.reorderSubstage}
                          isSubstageReorderCancel={
                            this.props.isSubstageReorderCancel
                          }
                          handleNewSubstageOrder={
                            this.props.handleNewSubstageOrder
                          }
                          formTable="project"
                        />
                      )}
                      {!loadSubStage && !isProjectForm && !!subStageData && (
                        <SubStageTable
                          data={subStageData}
                          handleEditGuide={handleEditGuide}
                          changeDeployStatus={changeDeployStatus}
                          deleteItem={deleteItem}
                          editSubStageForm={editSubStageForm}
                          reorderSubstage={this.props.reorderSubstage}
                          isSubstageReorderCancel={
                            this.props.isSubstageReorderCancel
                          }
                          handleNewSubstageOrder={
                            this.props.handleNewSubstageOrder
                          }
                          formTable="site"
                        />
                      )}
                      {!!isProjectForm && (
                        <div className="add-btn stage-add">
                          <a
                            data-tab="addSubStage-popup"
                            onClick={handleSubStageForm}
                          >
                            Add Substage
                            <span>
                              <i className="la la-plus"></i>
                            </span>
                          </a>
                        </div>
                      )}
                      {!isProjectForm && !!each.site && (
                        <div className="add-btn stage-add">
                          <a
                            data-tab="addSubStage-popup"
                            onClick={handleSubStageForm}
                          >
                            Add Substage
                            <span>
                              <i className="la la-plus"></i>
                            </span>
                          </a>
                        </div>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ))}
          </SortableContainer>
        )}
      </>
    );
  }
}
export default SortableStage;

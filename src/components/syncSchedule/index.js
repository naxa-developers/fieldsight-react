import React, { Component, Fragment } from "react";
import Axios from "axios";

import { DotLoader } from "../myForm/Loader";
import Modal from "../common/Modal";
import SyncScheduleForm from "./form";
import ReportTable from "./reportTable";
import StandardReportTable from "./standardReportTable";
import StageReportTable from "./stageReportTable";

const getScheduleType = schedule => {
  if (schedule === "Manual") {
    return 0;
  }
  if (schedule === "Daily") {
    return 1;
  }
  if (schedule === "Weekly") {
    return 2;
  }
  if (schedule === "Monthly") {
    return 3;
  }
  return null;
};

const getReportName = report => {
  const split = report.split("_");
  const newStr = split.map(str => str.replace(/^\w/, c => c.toUpperCase()));
  return newStr.join(" ");
};

export default class SyncSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reportList: [],
      loader: false,
      showForm: false,
      data: {},
      standardReports: [],
      generalReports: [],
      scheduledReports: [],
      surveyReports: [],
      stagedReports: []
    };
  }

  componentWillMount() {
    const {
      match: {
        params: { projectId }
      }
    } = this.props;
    this.setState({ loader: true }, () => {
      Axios.get(`/fv3/api/report-sync-settings-list/?project_id=${projectId}`)
        .then(res => {
          if (res.data) {
            const resData = Object.entries(res.data);
            const standardReports = [];
            const generalReports = [];
            const scheduledReports = [];
            const surveyReports = [];
            const stagedReports = [];
            resData.map(each => {
              if (each[0] === "standard_reports") {
                standardReports.push(each);
              }
              if (each[0] === "general_reports") {
                generalReports.push(each);
              }
              if (each[0] === "schedule_reports") {
                scheduledReports.push(each);
              }
              if (each[0] === "survey_reports") {
                surveyReports.push(each);
              }
              if (each[0] === "stage_reports") {
                stagedReports.push(each);
              }
            });
            this.setState({
              reportList: resData,
              standardReports,
              generalReports,
              scheduledReports,
              surveyReports,
              stagedReports,
              loader: false
            });
          }
        })
        .catch(() => {
          this.setState({ loader: false });
          // console.log("err", err);
        });
    });
  }

  handleToggleFlag = () => {
    this.setState(state => ({ showForm: !state.showForm }));
  };

  updateListOnSuccess = data => {
    // console.log("success", data);

    this.setState(state => ({
      // reportList: [data, ...state.reportList],
      showForm: false
    }));
  };

  handleEdit = data => {
    this.setState({
      showForm: true,
      data
    });
  };

  render() {
    const {
      state: {
        loader,
        showForm,
        data,
        standardReports,
        generalReports,
        scheduledReports,
        surveyReports,
        stagedReports
      },
      props: {
        match: {
          params: { projectId }
        }
      }
    } = this;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a>Setting</a>
            </li>
          </ol>
        </nav>
        <div className="card">
          <div className="card-header main-card-header">
            <h5>
              <i className="la la-building" />
              Project Schedule List
            </h5>
          </div>

          <div className="card-body">
            {loader && <DotLoader />}
            {standardReports.length > 0 &&
              standardReports.map(standard => (
                <Fragment key={`report_${standard[0]}`}>
                  <StandardReportTable
                    loader={loader}
                    data={standard[1]}
                    editAction={this.handleEdit}
                    scheduleType={getReportName(standard[0])}
                    getReportName={getReportName}
                  />
                </Fragment>
              ))}
            {generalReports.length > 0 &&
              generalReports.map(general => (
                <Fragment key={`report_${general[0]}`}>
                  <ReportTable
                    loader={loader}
                    data={general[1]}
                    editAction={this.handleEdit}
                    scheduleType={getReportName(general[0])}
                  />
                </Fragment>
              ))}
            {scheduledReports.length > 0 &&
              scheduledReports.map(schedule => (
                <Fragment key={`report_${schedule[0]}`}>
                  <ReportTable
                    loader={loader}
                    data={schedule[1]}
                    editAction={this.handleEdit}
                    scheduleType={getReportName(schedule[0])}
                  />
                </Fragment>
              ))}
            {surveyReports.length > 0 &&
              surveyReports.map(survey => (
                <Fragment key={`report_${survey[0]}`}>
                  <ReportTable
                    loader={loader}
                    data={survey[1]}
                    editAction={this.handleEdit}
                    scheduleType={getReportName(survey[0])}
                  />
                </Fragment>
              ))}
            {stagedReports.length > 0 &&
              stagedReports.map(stage => {
                return (
                  <Fragment key={`report_${stage[0]}`}>
                    <div style={{ display: "flex" }}>
                      <h6>{getReportName(stage[0])}</h6>
                    </div>

                    <StageReportTable
                      loader={loader}
                      stages={stage[1]}
                      editAction={this.handleEdit}
                      scheduleType={getReportName(stage[0])}
                    />
                  </Fragment>
                );
              })}
            {showForm && (
              <Modal
                title="Edit Project Schedule Settings"
                toggleModal={this.handleToggleFlag}
                classname="md-body"
              >
                <SyncScheduleForm
                  projectId={projectId}
                  handleSuccess={this.updateListOnSuccess}
                  data={data}
                  getScheduleType={getScheduleType}
                  getReportName={getReportName}
                  // onCancel={this.handleToggleFlag}
                />
              </Modal>
            )}
          </div>
        </div>
      </>
    );
  }
}

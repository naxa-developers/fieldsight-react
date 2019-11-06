import React, { Component } from "react";
import { connect } from "react-redux";

import SubmissionSiteDetail from "./SubmissionSiteDetail";
import SubmissionSiteInfo from "./SubmissionSiteInfo";
import RightSidebar from "./RightSidebar";
import Submission from "./Submission";
import SubmissionError from "./SubmissionError";
import Loader from "../common/Loader";

import {
  getSubmissionDetail,
  postSubmissionDetail,
  toggleSubmission
} from "../../actions/submissionDetailActions";

const submissionId = window.submission_id ? window.submission_id : 66202;

class SubmissionDetail extends Component {
  componentDidMount() {
    this.props.getSubmissionDetail(submissionId);
  }

  render() {
    const {
      props: {
        submissionDetail: {
          site,
          date_created,
          submitted_by,
          submission_data,
          submission_history,
          status_data,
          fieldsight_instance,
          edit_url,
          download_url,
          form_name,
          has_review_permission,
          loading,
          initialLoader,
          submission_err,
          hideNullValues
        },
        postSubmissionDetail,
        getSubmissionDetail,
        toggleSubmission
      }
    } = this;
    return (
      <>
        {!loading && !submission_err && (
          <>
            <div className="row">
              <div className="col-xl-8 col-lg-8">
                <div className="right-content no-bg">
                  <div className="row">
                    <SubmissionSiteDetail site={site} />

                    <SubmissionSiteInfo
                      siteInformation={site.site_information}
                    />
                  </div>

                  <Submission
                    formName={form_name}
                    dateCreated={date_created}
                    submittedBy={submitted_by}
                    submissionData={submission_data}
                    site={site}
                  />
                </div>
              </div>

              <div className="col-xl-4 col-lg-4">
                <RightSidebar
                  statusData={status_data}
                  submissionHistory={submission_history}
                  fieldSightInstance={fieldsight_instance}
                  postSubmissionDetail={postSubmissionDetail}
                  getSubmissionDetail={getSubmissionDetail}
                  editUrl={edit_url}
                  downloadUrl={download_url}
                  hasReviewPermission={has_review_permission}
                  toggleSubmission={toggleSubmission}
                  hideNullValues={hideNullValues}
                />
              </div>
            </div>
            {/* {loading && <Loader />} */}
          </>
        )}

        {submission_err && <SubmissionError submissionErr={submission_err} />}
        {loading && <Loader />}
      </>
    );
  }
}

const mapStateToProps = ({ submissionDetail }) => ({
  submissionDetail
});

export default connect(
  mapStateToProps,
  { getSubmissionDetail, postSubmissionDetail, toggleSubmission }
)(SubmissionDetail);

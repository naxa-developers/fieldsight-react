import React, { Component } from 'react';
import { connect } from 'react-redux';

import SubmissionSiteDetail from './SubmissionSiteDetail';
import SubmissionSiteInfo from './SubmissionSiteInfo';
import RightSidebar from './RightSidebar';
import Submission from './Submission';
import SubmissionError from './SubmissionError';
import Loader from '../common/Loader';

import {
  getSubmissionDetail,
  postSubmissionDetail,
  toggleSubmission,
} from '../../actions/submissionDetailActions';

/* eslint-disable react/prop-types  */
/* eslint-disable camelcase */

const submissionId = window.submission_id
  ? window.submission_id
  : 66259;

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
          submission_err,
          hideNullValues,
          breadcrumb,
          is_survey,
        },
      },
    } = this;
    return (
      <>
        {!loading && !submission_err && (
          <>
            <nav aria-label="breadcrumb" role="navigation">
              {Object.keys(breadcrumb).length > 0 && (
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href={breadcrumb.name_url}>
                      {breadcrumb.name}
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    {breadcrumb.current_page}
                  </li>
                </ol>
              )}
              {/* <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a>Forms</a>
            </li>
          </ol> */}
            </nav>
            <div className="row">
              <div className="col-xl-8 col-lg-8">
                <div className="right-content no-bg">
                  {!is_survey && (
                    <div className="row">
                      <SubmissionSiteDetail site={site} />

                      <SubmissionSiteInfo
                        siteInformation={site.site_information}
                      />
                    </div>
                  )}
                  <Submission
                    formName={form_name}
                    dateCreated={date_created}
                    submittedBy={submitted_by}
                    submissionData={submission_data}
                    site={site}
                    is_survey={is_survey}
                  />
                </div>
              </div>

              <div className="col-xl-4 col-lg-4">
                <RightSidebar
                  statusData={status_data}
                  submissionHistory={submission_history}
                  fieldSightInstance={fieldsight_instance}
                  postSubmissionDetail={
                    this.props.postSubmissionDetail
                  }
                  getSubmissionDetail={this.props.getSubmissionDetail}
                  editUrl={edit_url}
                  downloadUrl={download_url}
                  hasReviewPermission={has_review_permission}
                  toggleSubmission={this.props.toggleSubmission}
                  hideNullValues={hideNullValues}
                />
              </div>
            </div>
            {/* {loading && <Loader />} */}
          </>
        )}

        {submission_err && (
          <SubmissionError submissionErr={submission_err} />
        )}
        {loading && <Loader />}
      </>
    );
  }
}

const mapStateToProps = ({ submissionDetail }) => ({
  submissionDetail,
});

export default connect(mapStateToProps, {
  getSubmissionDetail,
  postSubmissionDetail,
  toggleSubmission,
})(SubmissionDetail);

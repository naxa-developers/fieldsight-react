import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import HistoryTab from './HistoryTab';
import StatusTab from './StatusTab';
/* eslint-disable react/prop-types  */
/* eslint-disable camelcase */

const base_url = window.base_url
  ? window.base_url
  : 'https://fieldsight.naxa.com.np';

class RightSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showStatus: true,
    };
  }

  render() {
    const {
      props: {
        statusData,
        submissionHistory,
        fieldSightInstance,
        editUrl,
        downloadUrl,
        hasReviewPermission,
        postSubmissionDetail,
        getSubmissionDetail,
        toggleSubmission,
        hideNullValues,
      },
      state: { showStatus },
    } = this;
    return (
      <div className="new-sidebar submission-sidebar sticky-top">
        <div className="card">
          <div className="card-body">
            <div className="submission-header">
              <ul className="nav nav-tabs " id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    role="button"
                    onKeyDown={this.handleKeyDown}
                    tabIndex="0"
                    className={`nav-link 
                    ${showStatus ? 'active' : ''}`}
                    onClick={() => {
                      this.setState({ showStatus: true });
                    }}
                  >
                    <FormattedMessage
                      id="app.status"
                      defaultMessage="Status"
                    />
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    role="button"
                    onKeyDown={this.handleKeyDown}
                    tabIndex="0"
                    className={`nav-link 
                    ${!showStatus ? 'active' : ''}`}
                    onClick={() => {
                      this.setState({ showStatus: false });
                    }}
                  >
                    <FormattedMessage
                      id="app.history"
                      defaultMessage="History"
                    />
                  </a>
                </li>
              </ul>
              <div className="head-icon">
                {hasReviewPermission && editUrl && (
                  <a
                    href={`${base_url}${editUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          <FormattedMessage
                            id="app.edit-submission"
                            defaultMessage="Edit Submission"
                          />
                        </Tooltip>
                      }
                    >
                      <i className="la la-edit" />
                    </OverlayTrigger>
                  </a>
                )}

                <a
                  role="button"
                  onKeyDown={this.handleKeyDown}
                  tabIndex="0"
                  onClick={toggleSubmission}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {/*`${
                        hideNullValues ? "Show" : "Hide"
                      } Null Values`*/}
                        {hideNullValues ? (
                          <FormattedMessage
                            id="app.showNullValues"
                            defaultMessage="Show Null Values"
                          />
                        ) : (
                          <FormattedMessage
                            id="app.hideNullValues"
                            defaultMessage="Hide Null Values"
                          />
                        )}
                      </Tooltip>
                    }
                  >
                    <i
                      className={`la la-${
                        hideNullValues ? 'eye' : 'eye-slash'
                      }`}
                    />
                  </OverlayTrigger>
                </a>

                {Object.keys(downloadUrl).length > 0 && (
                  <a
                    href={`${base_url}${
                      hideNullValues
                        ? downloadUrl.null
                        : downloadUrl.main
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          <FormattedMessage
                            id="app.download-as-PDF"
                            defaultMessage="Download as PDF"
                          />
                        </Tooltip>
                      }
                    >
                      <i className="la la-download" />
                    </OverlayTrigger>
                  </a>
                )}
              </div>
            </div>

            <div className="tab-content">
              {showStatus && (
                <StatusTab
                  statusData={statusData}
                  fieldSightInstance={fieldSightInstance}
                  postSubmissionDetail={postSubmissionDetail}
                  hasReviewPermission={hasReviewPermission}
                />
              )}
              {!showStatus && (
                <HistoryTab
                  submissionHistory={submissionHistory}
                  getSubmissionDetail={getSubmissionDetail}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RightSidebar;

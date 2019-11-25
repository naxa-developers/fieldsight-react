import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PreviewModal from './PreviewModal';
/* eslint-disable react/prop-types  */

class SharedFormShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareOption: false,
    };
  }

  shareToggle = () => {
    this.setState(state => ({
      shareOption: !state.shareOption,
    }));
  };

  render() {
    const { item, commonPopupHandler, OpenTabHandler } = this.props;
    return (
      <tr key={item.id_string}>
        <td>{item.title}</td>
        <td>{item.owner}</td>
        <td>
          <i className="fa fa-clock-o" />
          <span>{item.date_created}</span>
        </td>
        <td>
          <i className="fa fa-clock-o" />
          <span>{item.date_modified}</span>
        </td>
        <td>
          <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">
                <FormattedMessage
                  id="app.preview"
                  defaultMessage="Preview"
                />
              </Tooltip>
            }
          >
            <a
              onClick={e => {
                commonPopupHandler(
                  e,
                  PreviewModal,
                  item.preview_url,
                  'Preview Form',
                  'preview',
                  null,
                );
              }}
              className="td-view-btn td-btn"
              tabIndex="0"
              role="button"
              onKeyDown={e => {
                commonPopupHandler(
                  e,
                  PreviewModal,
                  item.preview_url,
                  'Preview Form',
                  'preview',
                  null,
                );
              }}
            >
              <i className="la la-eye" />
            </a>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">
                <FormattedMessage
                  id="app.edit"
                  defaultMessage="Edit"
                />
              </Tooltip>
            }
          >
            <a
              onClick={e => {
                OpenTabHandler(e, item.edit_url);
              }}
              className="td-edit-btn td-btn"
              tabIndex="0"
              role="button"
              onKeyDown={e => {
                OpenTabHandler(e, item.edit_url);
              }}
            >
              <i className="la la-edit" />
            </a>
          </OverlayTrigger>

          {/* <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">Replace</Tooltip>
            }
          >
          <a
            onClick={e =>
              this.props.commonPopupHandler(
                e,
                ReplaceModal,
                null,
                "Replace Form",
                "replace",
                null
              )
            }
            className="td-edit-btn td-btn"
          >
            {" "}
            <i className="la la-refresh"> </i>{" "}
          </a>
          </OverlayTrigger> */}
          <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">
                <FormattedMessage
                  id="app.download"
                  defaultMessage="download"
                />
              </Tooltip>
            }
          >
            <a
              onClick={e => {
                OpenTabHandler(e, item.download_url);
              }}
              className="td-edit-btn td-btn"
              data-toggle="tooltip"
              data-placement="top"
              title="Edit"
              tabIndex="0"
              role="button"
              onKeyDown={e => {
                OpenTabHandler(e, item.download_url);
              }}
            >
              <i className="la la-download" />
            </a>
          </OverlayTrigger>

          {/* <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">Make a copy</Tooltip>
                            }
                          >
                            <a
                              onClick={e =>
                                this.props.cloneHandler(
                                  e,
                                  item.clone_form_url,
                                  item.id_string,
                                  item.id
                                )
                              }
                              className="td-edit-btn td-btn"
                            >
                              {" "}
                              <i className="la la-clone"> </i>{" "}
                            </a>
                          </OverlayTrigger> */}

          {/* <a  onClick={(e) => this.props.togglePopup(e, 'share')} className="td-edit-btn td-btn" data-toggle="tooltip" data-placement="top" title="Share"> <i className="la la-share-alt"> </i> </a>
                <a  onClick={(e) => this.props.globashare(item.share_global_url,item.id_string)} className="td-edit-btn td-btn" data-toggle="tooltip" data-placement="top" title="globals Share"> <i className="la la-globe"> </i> </a> */}

          {/* <span className="share-icon">
          <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">Share</Tooltip>
            }
          >
            <a
              onClick={e => this.shareToggle(e)}
              className="td-share-btn td-btn"
            >
              {" "}
              <i className="la la-share-alt"> </i>
            </a>
            </OverlayTrigger>

            {this.state.shareOption && (
              <ul className="share-drop">
                <h5>Share to</h5>
                <li>
                  <a
                    onClick={e =>
                      this.props.commonPopupHandler(
                        e,
                        ShareModal,
                        item.id_string,
                        "Select User",
                        "users",
                        item.share_users_url
                      )
                    }
                    data-tab="user-share"
                  >
                    User
                  </a>
                </li>
                <li>
                  <a
                    onClick={e =>
                      this.props.commonPopupHandler(
                        e,
                        ShareModal,
                        item.id_string,
                        "Select Projects",
                        "projects",
                        item.share_project_url
                      )
                    }
                    data-tab="project-share"
                  >
                    Project
                  </a>
                </li>
                <li>
                  <a
                    onClick={e =>
                      this.props.commonPopupHandler(
                        e,
                        ShareModal,
                        item.id_string,
                        "Select Teams",
                        "teams",
                        item.share_team_url
                      )
                    }
                    data-tab="team-share"
                  >
                    Team
                  </a>
                </li>

                <li>
                  <a
                    onClick={e =>
                      this.props.commonPopupHandler(
                        e,
                        GlobalModel,
                        item.id_string,
                        " Select Global",
                        "global",
                        item.share_global_url
                      )
                    }
                    data-tab="global-share"
                  >
                    Globle
                  </a>
                </li>
              </ul>
            )}
          </span>
          <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">Delete</Tooltip>
            }
          >
          <a
            className="td-delete-btn td-btn"
          >
            {" "}
            <i className="la la-trash" />{" "}
          </a>
          </OverlayTrigger> */}
        </td>
      </tr>
    );
  }
}

export default SharedFormShare;

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import InputElement from '../common/InputElement';
import RadioElement from '../common/RadioElement';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/label-has-associated-control  */
/* eslint-disable consistent-return  */

const checkStatus = statusData => {
  if (statusData.status_display === 'Pending') {
    return 0;
  }
  if (statusData.status_display === 'Rejected') {
    return 1;
  }
  if (statusData.status_display === 'Flagged') {
    return 2;
  }
  if (statusData.status_display === 'Approved') {
    return 3;
  }
};

class StatusTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: '',
      comment: '',
      status: props.statusData.status_display
        ? checkStatus(props.statusData).toString()
        : '3',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.statusData.status_display !==
      this.props.statusData.status_display
    ) {
      this.setState({
        file: '',
        comment: '',
        status: nextProps.statusData.status_display
          ? checkStatus(nextProps.statusData).toString()
          : '3',
      });
    }
  }

  onChangeHandler = (e, file) => {
    if (file) {
      return this.setState({
        file: e.target.files[0],
      });
    }
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  submitHandler = e => {
    e.preventDefault();
    const {
      state: { comment, status, file },
      props: { fieldSightInstance, statusData, postSubmissionDetail },
    } = this;

    const oldStatus = checkStatus(statusData);
    const formData = new FormData();
    formData.append('image_1', file);
    formData.append('finstance', fieldSightInstance);
    formData.append('new_status', status);
    formData.append('old_status', oldStatus);
    formData.append('message', comment);

    postSubmissionDetail(formData);
  };

  render() {
    const {
      props: { statusData, hasReviewPermission },
      state: { comment, file, status },
      onChangeHandler,
      submitHandler,
    } = this;
    let icon;
    if (statusData.status_display === 'Rejected') {
      icon = 'la-close';
    } else if (statusData.status_display === 'Approved') {
      icon = 'la-check';
    } else if (statusData.status_display === 'Flagged') {
      icon = 'la-flag';
    } else if (statusData.status_display === 'Pending') {
      icon = 'la-hourglass-2';
    }
    return (
      <div
        className="tab-pane fade show active"
        id="status"
        role="tabpanel"
        aria-labelledby="status_tab"
      >
        <div className="status-view">
          <a
            href="#"
            className={
              statusData.status_display &&
              statusData.status_display.toLowerCase()
            }
          >
            {statusData.status_display}
            <i className={`la ${icon}`} />
          </a>
        </div>
        {hasReviewPermission && (
          <div className="status">
            <form className="edit-form" onSubmit={submitHandler}>
              <InputElement
                tag="textarea"
                label="app.comment"
                htmlFor="comment"
                name="comment"
                placeholder="Please put your comment here."
                value={comment}
                changeHandler={onChangeHandler}
                translation={true}
              />
              <div className="form-group">
                <label>
                  <FormattedMessage
                    id="app.attach-file"
                    defaultMessage="Attach File"
                  />
                </label>
                <div className="upload-form">
                  <div className="fieldsight-btn">
                    <label htmlFor="upload-btn">
                      <FormattedMessage
                        id="app.upload"
                        defaultMessage="Upload"
                      />
                      <i className="la la-cloud-upload" />
                    </label>
                    <input
                      type="file"
                      id="upload-btn"
                      onChange={e => onChangeHandler(e, 'file')}
                    />
                  </div>
                </div>
                <p>{file.name}</p>
              </div>
              <div className="form-group flexrow">
                <div className="custom-checkbox display-inline">
                  <RadioElement
                    label="app.approve"
                    name="status"
                    value="3"
                    className="approved"
                    checked={status === '3'}
                    changeHandler={onChangeHandler}
                    translation={true}
                  />
                  <RadioElement
                    label="app.flag"
                    name="status"
                    value="2"
                    className="flagged"
                    checked={status === '2'}
                    changeHandler={onChangeHandler}
                    translation={true}
                  />

                  <RadioElement
                    label="app.reject"
                    name="status"
                    value="1"
                    className="rejected"
                    checked={status === '1'}
                    changeHandler={onChangeHandler}
                    translation={true}
                  />
                </div>
              </div>
              <div className="form-group pull-right">
                <button type="submit" className="fieldsight-btn">
                  <FormattedMessage
                    id="app.save"
                    defaultMessage="Save"
                  />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default StatusTab;

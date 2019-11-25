import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

/* eslint-disable react/prop-types  */
/* eslint-disable  jsx-a11y/label-has-associated-control  */

class FeaturedPicturesCard extends Component {
  renderName = id => {
    const selectedForm = this.props.forms.find(
      form => form.id === +id,
    );
    return selectedForm && selectedForm.name;
    // if (selectedForm) {
    //   return selectedForm.name;
    // }
  };

  render() {
    const {
      props: { picture, editPicHandler, removePicHandler },
      renderName,
    } = this;
    return (
      <div className="col-lg-6 col-md-6">
        <div className="card">
          <div className="card-header sub-card-header">
            <h5>{picture.question_name}</h5>
            <div className="add-btn">
              <a
                role="button"
                onKeyDown={this.handleKeyDown}
                tabIndex="0"
                onClick={() => {
                  editPicHandler(picture.id || picture.question_name);
                }}
                className="td-edit-btn"
              >
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      <FormattedMessage
                        id="app.edit"
                        defaultMessage="Edit"
                      />
                    </Tooltip>
                  }
                >
                  <i className="la la-edit" />
                </OverlayTrigger>
              </a>
              <a
                role="button"
                onKeyDown={this.handleKeyDown}
                tabIndex="0"
                onClick={() => {
                  removePicHandler(
                    picture.id || picture.question_name,
                  );
                }}
                className="td-delete-btn"
              >
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      <FormattedMessage
                        id="app.delete"
                        defaultMessage="Delete"
                      />
                    </Tooltip>
                  }
                >
                  <i className="la la-trash-o" />
                </OverlayTrigger>
              </a>
            </div>
          </div>
          <div className="card-body">
            <div className="before-content">
              <ul>
                <li>
                  <label>
                    <FormattedMessage
                      id="app.type"
                      defaultMessage="Type"
                    />
                    :
                  </label>{' '}
                  <span>{picture.question_type}</span>
                </li>
                {picture.form_id && (
                  <li>
                    <label>
                      <FormattedMessage
                        id="app.form"
                        defaultMessage="Form"
                      />
                      :
                    </label>{' '}
                    <span>{renderName(picture.form_id)}</span>
                  </li>
                )}
                {picture.question && (
                  <li>
                    <label>
                      <FormattedMessage
                        id="app.question"
                        defaultMessage="Question"
                      />{' '}
                      :
                    </label>{' '}
                    <span>{picture.question.name}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeaturedPicturesCard;

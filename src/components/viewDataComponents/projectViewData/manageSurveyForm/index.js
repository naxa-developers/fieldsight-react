import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import ResponseTable from '../../responded/SurveyFormResponseTable';
import DeleteTable from '../deleteTable';
import { getProjectViewData } from '../../../../actions/viewDataActions';
/* eslint-disable camelcase */

class ManageSurveyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: true,
    };
  }

  componentDidMount() {
    if (this.props.id !== '') {
      this.props.getProjectViewData(this.props.id, 'survey');
    }
  }

  toggleHide = () => {
    this.setState(state => ({
      hide: !state.hide,
    }));
  };

  render() {
    const {
      props: {
        showViewData,
        data,
        survey_forms,
        deleted_forms,
        survey_forms_loader,
        url,
        id,
      },
    } = this;
    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          <h5>
            {' '}
            {!data ? (
              <FormattedMessage
                id="app.generate-form"
                defaultMessage="General Forms"
              />
            ) : (
              <FormattedMessage
                id="app.rejected-submissions"
                defaultMessage="Rejected Submission"
              />
            )}
          </h5>
          <Link to={url}>
            <button
              type="button"
              onClick={showViewData}
              className="fieldsight-btn"
            >
              {data ? (
                <FormattedMessage
                  id="app.view-by-form"
                  defaultMessage="View By Form"
                />
              ) : (
                <FormattedMessage
                  id="app.view-by-status"
                  defaultMessage="View By Status"
                />
              )}
            </button>
          </Link>
        </div>
        <div className="card-body">
          {!data && (
            <ResponseTable
              survey_forms={survey_forms}
              id={id}
              loader={survey_forms_loader}
            />
          )}
        </div>
        {deleted_forms.length > 0 && !data && (
          <div className="card no-boxshadow">
            <div className="card-header main-card-header sub-card-header">
              <h5>
                <FormattedMessage
                  id="app.deleted-forms"
                  defaultMessage="Deleted Forms"
                />
              </h5>
              <div className="dash-btn">
                {this.state.hide ? (
                  <button
                    type="button"
                    className="btn-toggle"
                    onClick={this.toggleHide}
                  >
                    <FormattedMessage
                      id="app.show"
                      defaultMessage="Show"
                    />
                    <div className="handle" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-toggle"
                    onClick={this.toggleHide}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      textAlign: 'left',
                    }}
                  >
                    <FormattedMessage
                      id="app.hide"
                      defaultMessage="Hide"
                    />
                    <div
                      className="handle"
                      style={{ left: 'auto', right: '0.1875rem' }}
                    />
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {!this.state.hide && (
                <DeleteTable
                  id={id}
                  deleted_forms={deleted_forms}
                  loader={survey_forms_loader}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = ({ projectViewData }) => {
  const {
    survey_forms,
    deleted_forms,
    survey_forms_loader,
  } = projectViewData;

  return {
    survey_forms,
    deleted_forms,
    survey_forms_loader,
  };
};
ManageSurveyForm.propTypes = {
  deleted_forms: PropTypes.arrayOf.isRequired,
  showViewData: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  getProjectViewData: PropTypes.func.isRequired,
  data: PropTypes.string.isRequired,
  survey_forms: PropTypes.arrayOf.isRequired,
  url: PropTypes.string.isRequired,
  survey_forms_loader: PropTypes.bool.isRequired,
};
export default compose(
  connect(mapStateToProps, {
    getProjectViewData,
  }),
)(ManageSurveyForm);

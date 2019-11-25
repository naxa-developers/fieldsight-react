import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { getsiteViewData } from '../../../../actions/siteViewDataAction';
import DeleteTable from '../deleteTable';
import ResponseTable from '../../responded/StagedFormResponseTable';
/* eslint-disable camelcase */

class ResponseStageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: true,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    if (id !== '') {
      this.props.getsiteViewData(id, 'stage');
    }
  }

  toggleHide = () => {
    this.setState(prevState => ({
      hide: !prevState.hide,
    }));
  };

  render() {
    const {
      props: {
        showViewData,
        data,
        stage_forms,
        deleted_forms,
        stage_forms_loading,
        id,
      },
    } = this;

    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          <h5>
            {!data ? (
              <FormattedMessage
                id="app.staged-form"
                defaultMessage="Stage Forms"
              />
            ) : (
              <FormattedMessage
                id="app.rejected-submissions"
                defaultMessage="Rejected Submission"
              />
            )}
          </h5>
          <Link to={`/site-responses/${id}/rejected`}>
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
              stage_forms={stage_forms}
              table="site"
              id={id}
              loader={stage_forms_loading}
            />
          )}
        </div>

        {deleted_forms && deleted_forms.length > 0 && !data && (
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
                  deleted_forms={deleted_forms}
                  id={id}
                  loader={stage_forms_loading}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

ResponseStageForm.propTypes = {
  id: PropTypes.string.isRequired,
  getsiteViewData: PropTypes.func.isRequired,
  showViewData: PropTypes.bool.isRequired,
  data: PropTypes.objectOf.isRequired,
  stage_forms: PropTypes.arrayOf.isRequired,
  deleted_forms: PropTypes.arrayOf.isRequired,
  stage_forms_loading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ siteViewData }) => {
  const {
    stage_forms_loading,
    deleted_forms,
    stage_forms,
  } = siteViewData;

  return {
    stage_forms_loading,
    deleted_forms,
    stage_forms,
  };
};

export default compose(
  connect(mapStateToProps, {
    getsiteViewData,
  }),
)(ResponseStageForm);

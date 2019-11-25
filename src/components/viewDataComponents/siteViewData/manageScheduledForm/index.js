import React, { Component } from 'react';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ResponseTable from '../../responded/ResponseTable';
import DeleteTable from '../deleteTable';
import { getsiteViewData } from '../../../../actions/siteViewDataAction';
import { DotLoader } from '../../../myForm/Loader';
/* eslint-disable camelcase */

class ManageScheduledForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: true,
    };
  }

  componentDidMount() {
    if (this.props.id !== '') {
      this.props.getsiteViewData(this.props.id, 'scheduled');
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
        scheduled_forms,
        deleted_forms,
        scheduled_loading,
        id,
      },
    } = this;

    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          <h5>
            {!data ? (
              <FormattedMessage
                id="app.scheduled-form"
                defaultMessage="Scheduled Forms"
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
          {!data &&
            (scheduled_loading ? (
              <ResponseTable
                generals_forms={scheduled_forms}
                table="site"
                id={id}
                survey="true"
              />
            ) : (
              <DotLoader />
            ))}
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
                  deleted_forms={deleted_forms}
                  id={id}
                  loader={scheduled_loading}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

ManageScheduledForm.propTypes = {
  id: PropTypes.string.isRequired,
  showViewData: PropTypes.bool.isRequired,
  data: PropTypes.objectOf.isRequired,
  scheduled_forms: PropTypes.arrayOf.isRequired,
  deleted_forms: PropTypes.arrayOf.isRequired,
  getsiteViewData: PropTypes.func.isRequired,
  scheduled_loading: PropTypes.bool.isRequired,
};
const mapStateToProps = ({ siteViewData }) => {
  const {
    scheduled_forms,
    deleted_forms,
    scheduled_loading,
  } = siteViewData;

  return {
    scheduled_forms,
    deleted_forms,
    scheduled_loading,
  };
};
export default compose(
  connect(mapStateToProps, {
    getsiteViewData,
  }),
)(ManageScheduledForm);

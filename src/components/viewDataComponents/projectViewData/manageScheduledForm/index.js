import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ResponseTable from '../../responded/ResponseTable';
import DeleteTable from '../deleteTable';
import { getProjectViewData } from '../../../../actions/viewDataActions';
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
      this.props.getProjectViewData(this.props.id, 'scheduled');
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
        scheduled_loader,
        scheduled_forms,
        deleted_forms,
        url,
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
          {!data &&
            (scheduled_loader ? (
              <ResponseTable
                generals_forms={scheduled_forms}
                survey="true"
                id={id}
              />
            ) : (
              <DotLoader />
            ))}
        </div>
        {deleted_forms.length > 0 && !data && (
          <div className="card no-boxshadow">
            <div className="card-header main-card-header sub-card-header">
              <h5>
                {' '}
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
                  loader={scheduled_loader}
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
    scheduled_forms,
    deleted_forms,
    scheduled_loader,
  } = projectViewData;

  return {
    scheduled_forms,
    deleted_forms,
    scheduled_loader,
  };
};
ManageScheduledForm.propTypes = {
  deleted_forms: PropTypes.arrayOf.isRequired,
  showViewData: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  getProjectViewData: PropTypes.func.isRequired,
  data: PropTypes.string.isRequired,
  scheduled_forms: PropTypes.arrayOf.isRequired,
  url: PropTypes.string.isRequired,
  scheduled_loader: PropTypes.bool.isRequired,
};
export default compose(
  connect(mapStateToProps, {
    getProjectViewData,
  }),
)(ManageScheduledForm);

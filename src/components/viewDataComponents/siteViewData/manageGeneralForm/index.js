import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ResponseTable from '../../responded/ResponseTable';
import DeleteTable from '../deleteTable';
import { getsiteViewData } from '../../../../actions/siteViewDataAction';
import { DotLoader } from '../../../myForm/Loader';
/* eslint-disable camelcase */

class ManageGeneralForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: true,
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      id: props.id,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    if (id !== '') {
      this.props.getsiteViewData(id, 'general');
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
        data,
        showViewData,
        generals_forms,
        deleted_forms,
        generals_loading,
        id,
      },
      state: { hide },
    } = this;

    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          {/*<h5>General Forms</h5>*/}
          <h5>
            <FormattedMessage
              id="app.generate-form"
              defaultMessage="General Forms"
            />
          </h5>
          <div className="dash-btn">
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
        </div>
        <div className="card-body">
          {!data &&
            (generals_loading ? (
              <ResponseTable
                generals_forms={generals_forms}
                table="site"
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
                {hide ? (
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
              {!hide && (
                <DeleteTable
                  deleted_forms={deleted_forms}
                  id={id}
                  loader={generals_loading}
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

ManageGeneralForm.propTypes = {
  id: PropTypes.string.isRequired,
  showViewData: PropTypes.bool.isRequired,
  data: PropTypes.objectOf.isRequired,
  generals_forms: PropTypes.arrayOf.isRequired,
  deleted_forms: PropTypes.arrayOf.isRequired,
  getsiteViewData: PropTypes.func.isRequired,
  generals_loading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ siteViewData }) => {
  const {
    generals_forms,
    deleted_forms,
    generals_loading,
  } = siteViewData;

  return {
    generals_forms,
    deleted_forms,
    generals_loading,
  };
};
export default compose(
  connect(mapStateToProps, {
    getsiteViewData,
  }),
)(ManageGeneralForm);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Logs from '../common/Logs';
import { getProjectLogs } from '../../actions/projectLogsActions';
/* eslint-disable react/prop-types  */
/* eslint-disable camelcase */

const user_id = window.user_id ? window.user_id : 1;

class ProjectLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteId: '',
      // siteLogs: {},
      // siteLogsLoader: true,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    getProjectLogs(id);
    this.setState({
      siteId: id,
    });
  }

  render() {
    const { siteLogs, siteLogsLoader } = this.props.projectLogs;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href={`/fieldsight/application/#/project-dashboard/${this.state.siteId}`}
              >
                <FormattedMessage
                  id="app.project"
                  defaultMessage="Project"
                />
              </a>
            </li>
            <li className="breadcrumb-item">
              <FormattedMessage id="app.logs" defaultMessage="Logs" />
            </li>
          </ol>
        </nav>

        <div className="new-dashboard">
          <Logs
            siteId={this.state.siteId}
            type="site"
            user_id={user_id}
            siteLogs={siteLogs}
            showContentLoader={siteLogsLoader}
            fullPage
            projectlogs
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ projectLogs }) => {
  return {
    projectLogs,
  };
};

export default connect(mapStateToProps, {
  getProjectLogs,
})(ProjectLogs);

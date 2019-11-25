import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getProjectList } from '../../actions/projectListAction';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/label-has-associated-control  */

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      masterprojects: [],
      breadcrumbs: [],
      id: '',
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    getProjectList(id);
    this.setState({
      id,
    });
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      projects: nextprops.projectList.projects,
      masterprojects: nextprops.projectList.projects,
      breadcrumbs: nextprops.projectList.breadcrumbs,
    });
  }

  handleChange = async e => {
    const {
      target: { value },
    } = e;
    const { projects, masterprojects } = this.state;
    if (value) {
      const search = await projects.filter(project => {
        return project.name
          .toLowerCase()
          .includes(value.toLowerCase());
      });

      this.setState({
        projects: search,
      });
    } else {
      this.setState({
        projects: masterprojects,
      });
    }
  };

  render() {
    const { breadcrumbs, projects, id } = this.state;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href={breadcrumbs.team_url}>{breadcrumbs.team}</a>
            </li>
            <li className="breadcrumb-item">{breadcrumbs.name}</li>
          </ol>
        </nav>
        <main id="main-content">
          <div className="card">
            <div className="card-header main-card-header sub-card-header">
              <h5>Project List</h5>
              <div className="dash-btn">
                <form className="floating-form">
                  <div className="form-group mr-0">
                    <input
                      type="search"
                      className="form-control"
                      onChange={e => this.handleChange(e)}
                      required
                    />
                    <label htmlFor="input">
                      <FormattedMessage
                        id="app.teams-search"
                        defaultMessage="Search"
                      />
                    </label>
                    <i className="la la-search" />
                  </div>
                </form>
                <a
                  href={`/fieldsight/application/#/project-add/${id}`}
                  className="fieldsight-btn"
                >
                  <i className="la la-plus" />
                </a>
              </div>
            </div>
            <div className="card-body">
              <div style={{ position: 'relative', height: '800px' }}>
                <PerfectScrollbar>
                  <Table
                    id="manage_table"
                    className="table  table-bordered  dataTable"
                  >
                    <thead>
                      <tr>
                        <th>
                          <FormattedMessage
                            id="app.project-name"
                            defaultMessage="Project Name"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="app.address"
                            defaultMessage="Address"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="app.regions"
                            defaultMessage="Regions"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="app.sites"
                            defaultMessage="Sites"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="app.users"
                            defaultMessage="Users"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="app.total-submissions"
                            defaultMessage="Total Submissions"
                          />
                        </th>
                        <th>
                          {' '}
                          <FormattedMessage
                            id="app.action"
                            defaultMessage="Action"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, key) => {
                        return (
                          <tr key={key}>
                            <td>
                              <a
                                href={`/fieldsight/application/#/project-dashboard/${project.id}`}
                                className="pending table-profile"
                              >
                                <figure>
                                  <img
                                    src={project.logo}
                                    alt="site-logo"
                                  />
                                </figure>
                                <h5>{project.name}</h5>
                              </a>
                            </td>
                            <td>{project.address}</td>
                            <td>{project.total_regions}</td>
                            <td>{project.total_sites}</td>
                            <td>{project.total_users}</td>
                            <td>{project.total_submissions}</td>
                            <td>
                              <a
                                href={`/fieldsight/application/#/project-dashboard/${project.id}`}
                                className="td-view-btn td-btn"
                              >
                                <i className="la la-eye" />
                              </a>
                              <a
                                href={`/fieldsight/application/?project=${project.id}#/project-settings`}
                                className="td-edit-btn td-btn"
                              >
                                <i className="la la-edit" />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </PerfectScrollbar>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

const mapStateToProps = ({ projectList }) => {
  return {
    projectList,
  };
};
export default compose(
  connect(mapStateToProps, {
    getProjectList,
  }),
)(ProjectList);

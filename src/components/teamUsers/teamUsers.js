import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class TeamUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      breadcrumb: [],
      masteruser: [],
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    axios
      .get(`fv3/api/users/?team=${id}`)
      .then(res => {
        this.setState({
          users: res.data.users,
          breadcrumb: res.data.breadcrumbs,
          masteruser: res.data.users,
        });
      })
      .catch(err => {
        return err;
      });
  }

  handleChange = async e => {
    const {
      target: { value },
    } = e;
    const { users } = this.state;
    if (value) {
      const search = await users.filter(user => {
        return (
          user.full_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          user.username.toLowerCase().includes(value.toLowerCase())
        );
      });
      this.setState({
        users: search,
      });
    } else {
      this.setState(state => ({
        users: state.masteruser,
      }));
    }
  };

  render() {
    const { users, breadcrumb } = this.state;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          {Object.keys(breadcrumb).length > 0 && (
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href={breadcrumb.team_url}>{breadcrumb.team}</a>
              </li>
              <li className="breadcrumb-item">{breadcrumb.name}</li>
            </ol>
          )}
        </nav>
        <main id="main-content">
          <div className="card">
            <div className="card-header main-card-header sub-card-header">
              <h5>
                {' '}
                <FormattedMessage
                  id="app.team-user"
                  defaultMessage="Team Users"
                />
              </h5>
              <div className="dash-btn">
                <form
                  className="floating-form"
                  onSubmit={this.handleSubmit}
                >
                  <div className="form-group mr-0">
                    <label htmlFor="input">
                      <FormattedMessage
                        id="app.teams-search"
                        defaultMessage="Search"
                      />
                      <input
                        type="search"
                        className="form-control"
                        onChange={e => this.handleChange(e)}
                        required
                      />
                    </label>
                    <i className="la la-search" />
                  </div>
                </form>
              </div>
            </div>
            <div className="card-body">
              <Table
                responsive="xl"
                className="table dataTable table-bordered  dataTable "
              >
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage
                        id="app.name"
                        defaultMessage="Name"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.user-name"
                        defaultMessage="User Name"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.email"
                        defaultMessage="Email"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.role"
                        defaultMessage="Role"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((users, key) => {
                    return (
                      <tr key={key}>
                        <td>
                          <a
                            href={`/users/profile/${users.id}`}
                            className="pending table-profile"
                          >
                            <figure>
                              <img
                                src={user.profile_picture}
                                alt="site-logo"
                              />
                            </figure>
                            <h5>{user.full_name}</h5>
                          </a>
                        </td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        {user.role.length > 0 ? (
                          user.role[0] ? (
                            <td>{user.role[0]}</td>
                          ) : (
                            <td>
                              {`${users.role[0]}/${users.role[1]}`}
                            </td>
                          )
                        ) : (
                          <td>{}</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </main>
      </>
    );
  }
}
TeamUser.propTypes = {
  match: PropTypes.objectOf.isRequired,
};

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { getSiteUser } from '../../actions/userDocumentActions';

class UserDocument extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      masteruser: [],
      breadcrumbs: [],
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.props.getSiteUser(id);
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      users: nextprops.userDocument.users,
      masteruser: nextprops.userDocument.users,
      breadcrumbs: nextprops.userDocument.breadcrumbs,
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
    const { users, breadcrumbs } = this.state;
    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          {Object.keys(breadcrumbs).length > 0 && (
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href={breadcrumbs.site_url}>{breadcrumbs.site}</a>
              </li>
              <li className="breadcrumb-item">{breadcrumbs.name}</li>
            </ol>
          )}
        </nav>
        <main id="main-content">
          <div className="card">
            <div className="card-header main-card-header sub-card-header">
              <h5>
                <FormattedMessage
                  id="app.users"
                  defaultMessage="Users"
                />
              </h5>
              <div className="dash-btn">
                <form className="floating-form">
                  <div className="form-group mr-0">
                    <label htmlFor="input">
                      <FormattedMessage
                        id="app.teams-search"
                        defaultMessage="Search"
                      />
                      <input
                        type="search"
                        className="form-control"
                        name="search"
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
              <table
                id="manage_table"
                className="table dataTable table-bordered  manage_table"
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
                        {user.role !== '' && user.role.length > 0 ? (
                          user.role[0] ? (
                            <td>{user.role[0]}</td>
                          ) : (
                            <td>
                              {' '}
                              {`${user.role[0] / user.role[1]}`}
                            </td>
                          )
                        ) : (
                          <td>{}</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </>
    );
  }
}

const mapStateToProps = ({ userDocument }) => {
  return {
    userDocument,
  };
};
UserDocument.propTypes = {
  match: PropTypes.objectOf.isRequired,
  getSiteUser: PropTypes.func.isRequired,
};
export default compose(
  connect(mapStateToProps, {
    getSiteUser,
  }),
)(UserDocument);

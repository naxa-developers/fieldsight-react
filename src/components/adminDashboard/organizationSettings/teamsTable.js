import React, { PureComponent } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DotLoader } from '../../myForm/Loader';

/* eslint-disable camelcase */

export default class TeamsTable extends PureComponent {
  render() {
    const {
      selected_teams,
      handleConfirm,
      openDelete,
      loader,
    } = this.props;
    return loader ? (
      <Table
        responsive="xl"
        className="table  table-bordered  dataTable "
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>address</th>
            <th>projects</th>
            <th>users</th>
            <th>sites</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selected_teams.length > 0 &&
            selected_teams.map(teams => (
              <tr key={teams.id}>
                <td>
                  <Link
                    to={`/team-dashboard/${teams.id}`}
                    className="pending table-profile"
                  >
                    <figure>
                      <img src={teams.logo} alt="site-logo" />
                    </figure>
                    <h5>{teams.name}</h5>
                  </Link>
                </td>
                <td>{teams.address}</td>

                <td>{teams.projects}</td>

                <td>{teams.users}</td>
                <td>{teams.sites}</td>
                <td>
                  <a
                    role="button"
                    onKeyDown={handleConfirm}
                    tabIndex="0"
                    className="td-delete-btn"
                    onClick={() => {
                      openDelete(teams.id);
                    }}
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Remove</Tooltip>}
                    >
                      <i className="la la-close" />
                    </OverlayTrigger>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    ) : (
      <DotLoader />
    );
  }
}

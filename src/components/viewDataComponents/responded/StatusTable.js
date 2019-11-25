import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Table from 'react-bootstrap/Table';
import PropTypes from 'prop-types';

class StatusTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submission: [],
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      submission: props.submission,
    };
  }

  render() {
    const { submission } = this.state;
    return (
      <>
        <Table
          responsive="xl"
          className="table  table-bordered  dataTable "
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
                  id="app.submitted-by"
                  defaultMessage="Submitted By"
                />
              </th>
              <th>
                {' '}
                <FormattedMessage
                  id="app.time"
                  defaultMessage="Time"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {!!submission &&
              submission.length > 0 &&
              submission.map(sub => {
                return (
                  <tr key={sub.id}>
                    <td style={{ width: '380px' }}>
                      <a href={sub.submission_url}>{sub.name}</a>
                    </td>
                    <td>
                      <a href={sub.profile_url}>{sub.submitted_by}</a>
                    </td>
                    <td>{sub.date}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </>
    );
  }
}
StatusTable.propTypes = {
  submission: PropTypes.arrayOf.isRequired,
};
export default StatusTable;

import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import { DotLoader } from '../../myForm/Loader';
/* eslint-disable camelcase */

export default class SurveyFormResponseTable extends PureComponent {
  render() {
    const { stage_forms, table, loader, id } = this.props;
    return (
      <>
        {loader === true ? (
          <div>
            {stage_forms &&
              stage_forms.map(stage => {
                return (
                  <div key={stage.id}>
                    <div style={{ display: 'flex' }}>
                      <h6>{stage.name}</h6>
                    </div>
                    <Table
                      responsive="xl"
                      className="table  table-bordered  dataTable "
                    >
                      <thead>
                        <tr>
                          <th>
                            <FormattedMessage
                              id="app.sub-stage-name"
                              defaultMessage="sub stage name"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.form-name"
                              defaultMessage="Form Name"
                            />
                          </th>
                          <th>
                            {' '}
                            <FormattedMessage
                              id="app.last-response-on"
                              defaultMessage="Last Response On"
                            />
                          </th>
                          <th>
                            {' '}
                            <FormattedMessage
                              id="app.submissions"
                              defaultMessage="Submissions"
                            />
                          </th>
                          <th>
                            <FormattedMessage
                              id="app.action"
                              defaultMessage="Action"
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stage.sub_stages &&
                          stage.sub_stages.map(sub_stages => {
                            return (
                              <tr key={sub_stages.id}>
                                <td style={{ width: '269px' }}>
                                  {sub_stages.name}
                                </td>
                                <td style={{ width: '183px' }}>
                                  {sub_stages.form_name}
                                </td>

                                <td>
                                  {sub_stages.last_response !==
                                    null &&
                                  sub_stages.last_response.length > 0
                                    ? format(
                                        sub_stages.last_response,
                                        ['MMMM Do YYYY, h:mm:ss a'],
                                      )
                                    : ''}
                                </td>
                                <td>
                                  {table === 'site' ? (
                                    <Link
                                      to={`/site-submission-data/${id}/${sub_stages.fsxf_id}`}
                                    >
                                      {sub_stages.response_count}
                                    </Link>
                                  ) : (
                                    <Link
                                      to={`/submission-data/${id}/${sub_stages.fsxf_id}`}
                                    >
                                      {sub_stages.response_count}
                                    </Link>
                                  )}
                                </td>

                                <td>
                                  {table === 'site' ? (
                                    <Link
                                      className="view-tag tag"
                                      to={`/site-submission-data/${id}/${sub_stages.fsxf_id}`}
                                    >
                                      <i className="la la-eye" />
                                    </Link>
                                  ) : (
                                    <Link
                                      className="view-tag tag"
                                      to={`/submission-data/${id}/${sub_stages.fsxf_id}`}
                                    >
                                      <i className="la la-eye" />
                                    </Link>
                                  )}

                                  {sub_stages.download_url ===
                                  null ? (
                                    <a className="edit-tag tag disable-pointer">
                                      <i className="la la-download" />
                                    </a>
                                  ) : (
                                    <a
                                      href={sub_stages.download_url}
                                      className="edit-tag tag"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <i className="la la-download" />
                                    </a>
                                  )}
                                  {table === 'site' ? (
                                    <Link
                                      className="pending-tag tag"
                                      to={`/site-version-submission/${id}/${sub_stages.fsxf_id}`}
                                    >
                                      <i className="la la-clone" />
                                    </Link>
                                  ) : (
                                    <Link
                                      className="pending-tag tag"
                                      to={`/project-version-submission/${id}/${sub_stages.fsxf_id}`}
                                    >
                                      <i className="la la-clone" />
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                );
              })}
          </div>
        ) : (
          <DotLoader />
        )}
      </>
    );
  }
}

SurveyFormResponseTable.propTypes = {
  stage_forms: PropTypes.arrayOf.isRequired,
  table: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  loader: PropTypes.bool.isRequired,
};

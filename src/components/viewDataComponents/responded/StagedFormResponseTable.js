import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import { DotLoader } from "../../myForm/Loader";

export default class SurveyFormResponseTable extends Component {
  render() {
    const { stage_forms, table, loader } = this.props;
    return (
      <React.Fragment>
        {loader == true ? (
          <div>
            {stage_forms &&
              stage_forms.map((stage, key) => {
                return (
                  <div key={key}>
                    <div style={{ display: "flex" }}>
                      <h6>{stage.name}</h6>
                    </div>
                    <Table
                      responsive="xl"
                      className="table  table-bordered  dataTable "
                    >
                      <thead>
                        <tr>
                          <th>sub stage name</th>
                          <th>form name</th>
                          <th>last response on</th>
                          <th>Submissions</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stage.sub_stages &&
                          stage.sub_stages.map((sub_stages, key) => {
                            return (
                              <tr key={key}>
                                <td style={{ width: "269px" }}>
                                  {sub_stages.name}
                                </td>
                                <td style={{ width: "183px" }}>
                                  {sub_stages.form_name}
                                </td>

                                <td>
                                  {sub_stages.last_response !== null &&
                                  sub_stages.last_response.length > 0
                                    ? format(sub_stages.last_response, [
                                        "MMMM Do YYYY, h:mm:ss a"
                                      ])
                                    : ""}
                                </td>
                                <td>
                                  {table === "site" ? (
                                    <Link
                                      to={`/site-submission-data/${this.props.id}/${sub_stages.fsxf_id}`}
                                    >
                                      {sub_stages.response_count}
                                    </Link>
                                  ) : (
                                    <Link
                                      to={`/submission-data/${this.props.id}/${sub_stages.fsxf_id}`}
                                    >
                                      {sub_stages.response_count}
                                    </Link>
                                  )}
                                </td>

                                <td>
                                  {table === "site" ? (
                                    <Link
                                      className="view-tag tag"
                                      to={`/site-submission-data/${this.props.id}/${sub_stages.fsxf_id}`}
                                    >
                                      <i className="la la-eye"></i>
                                    </Link>
                                  ) : (
                                    <Link
                                      className="view-tag tag"
                                      to={`/submission-data/${this.props.id}/${sub_stages.fsxf_id}`}
                                    >
                                      <i className="la la-eye"></i>
                                    </Link>
                                  )}

                                  {sub_stages.download_url === null ? (
                                    <a className="edit-tag tag disable pointer">
                                      <i className="la la-download"></i>
                                    </a>
                                  ) : (
                                    <Link
                                      to={sub_stages.download_url}
                                      className="edit-tag tag"
                                      target="_blank"
                                    >
                                      <i className="la la-download"></i>
                                    </Link>
                                  )}
                                  {table === "site" ? (
                                    <Link
                                      className="pending-tag tag"
                                      to={`/site-version-submission/${this.props.id}/${sub_stages.fsxf_id}`}
                                    >
                                      <i className="la la-clone"></i>
                                    </Link>
                                  ) : (
                                    <Link
                                      className="pending-tag tag"
                                      to={`/project-version-submission/${this.props.id}/${sub_stages.fsxf_id}`}
                                    >
                                      <i className="la la-clone"></i>
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
      </React.Fragment>
    );
  }
}

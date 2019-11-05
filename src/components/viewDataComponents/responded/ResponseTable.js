import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import format from "date-fns/format";

class ResponseTable extends Component {
  render() {
    const { generals_forms, table, survey } = this.props;

    return (
      <React.Fragment>
        <Table responsive="xl" className="table  table-bordered  dataTable ">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>
                {survey === "true" ? "Form Name" : "Name"}{" "}
              </th>

              <th>Submissions</th>
              <th>Last Response On</th>
              <th>Created Date</th>
              <th style={{ width: "13%" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {generals_forms &&
              generals_forms.map((generals, key) => {
                return (
                  <tr key={key}>
                    {survey === "true" ? (
                      <td>{generals.form_name}</td>
                    ) : (
                      <td style={{ width: "45px" }}>{generals.name}</td>
                    )}
                    <td>
                      {table == "site" ? (
                        generals.fsxf_id ? (
                          <Link
                            to={`/site-submission-data/${this.props.id}/${generals.fsxf_id}`}
                          >
                            {generals.response_count}
                          </Link>
                        ) : (
                          <Link
                            to={`/site-submission-data/${this.props.id}/${generals.id}`}
                          >
                            {generals.response_count}
                          </Link>
                        )
                      ) : generals.fsxf_id ? (
                        <Link
                          to={`/submission-data/${this.props.id}/${generals.fsxf_id}`}
                        >
                          {generals.response_count}
                        </Link>
                      ) : (
                        <Link
                          to={`/submission-data/${this.props.id}/${generals.id}`}
                        >
                          {generals.response_count}
                        </Link>
                      )}
                    </td>
                    <td>
                      {generals.last_response &&
                      generals.last_response.length > 0
                        ? format(generals.last_response, [
                            "MMMM Do YYYY, h:mm:ss a"
                          ])
                        : ""}
                    </td>
                    <td>{generals.created_date}</td>

                    <td>
                      {table == "site" ? (
                        generals.fsxf_id ? (
                          <Link
                            className="view-tag tag"
                            to={`/site-submission-data/${this.props.id}/${generals.fsxf_id}`}
                          >
                            <i className="la la-eye view-tag tag"></i>
                          </Link>
                        ) : (
                          <Link
                            className="view-tag tag"
                            to={`/site-submission-data/${this.props.id}/${generals.id}`}
                          >
                            <i className="la la-eye view-tag tag"></i>
                          </Link>
                        )
                      ) : generals.fsxf_id ? (
                        <Link
                          className="view-tag tag"
                          to={`/submission-data/${this.props.id}/${generals.fsxf_id}`}
                        >
                          <i className="la la-eye view-tag tag"></i>
                        </Link>
                      ) : (
                        <Link
                          className="view-tag tag"
                          to={`/submission-data/${this.props.id}/${generals.id}`}
                        >
                          <i className="la la-eye view-tag tag"></i>
                        </Link>
                      )}
                      {generals.download_url === null ? (
                        <a className="edit-tag tag disable pointer">
                          <i className="la la-download"></i>
                        </a>
                      ) : (
                        <Link
                          to={generals.download_url}
                          className="edit-tag tag"
                          target="_blank"
                        >
                          <i className="la la-download "></i>
                        </Link>
                      )}
                      {table == "site" ? (
                        generals.fsxf_id ? (
                          <Link
                            className="pending-tag tag"
                            to={`/site-version-submission/${this.props.id}/${generals.fsxf_id}`}
                          >
                            <i className="la la-clone edit-tag tag"></i>
                          </Link>
                        ) : (
                          <Link
                            className="pending-tag tag"
                            to={`/site-version-submission/${this.props.id}/${generals.id}`}
                          >
                            <i className="la la-clone edit-tag tag"></i>
                          </Link>
                        )
                      ) : generals.fsxf_id ? (
                        <Link
                          className="pending-tag tag"
                          to={`/project-version-submission/${this.props.id}/${generals.fsxf_id}`}
                        >
                          <i className="la la-clone edit-tag tag"></i>
                        </Link>
                      ) : (
                        <Link
                          className="pending-tag tag"
                          to={`/project-version-submission/${this.props.id}/${generals.id}`}
                        >
                          <i className="la la-clone edit-tag tag"></i>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}
export default ResponseTable;

import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import { DotLoader } from "../../myForm/Loader";

export default class SurveyFormResponseTable extends Component {
  state = {
    survey_forms: [],
    loader: ""
  };

  static getDerivedStateFromProps(props, state) {
    return {
      survey_forms: props.survey_forms,
      loader: props.loader
    };
  }

  render() {
    const { loader, survey_forms } = this.props;
    return (
      <React.Fragment>
        {loader == true ? (
          <Table responsive="xl" className="table  table-bordered  dataTable ">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Last Response On</th>
                <th>Created Date</th>
                <th>New Submission</th>
                <th>Submission</th>
                <th style={{ width: "13%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {survey_forms.length > 0 &&
                survey_forms.map((survey, key) => {
                  return (
                    <tr key={key}>
                      <td>{survey.name}</td>
                      <td>{survey.title}</td>
                      <td>
                        {survey.last_response && survey.last_response.length > 0
                          ? format(survey.last_response, [
                              "MMMM Do YYYY, h:mm:ss a"
                            ])
                          : ""}
                      </td>
                      <td>{survey.created_date}</td>
                      <td>
                        <a target="_blank" href="/forms/new/0/297449">
                          <i className="la la-plus" aria-hidden="true"></i>
                        </a>
                      </td>
                      <td>
                        <Link
                          to={`/submission-data/${this.props.id}/${survey.id}`}
                        >
                          {survey.response_count}
                        </Link>
                      </td>
                      <td>
                        {
                          <Link
                            className="view-tag tag"
                            to={`/submission-data/${this.props.id}/${survey.id}`}
                          >
                            <i className="la la-eye"></i>
                          </Link>
                        }
                        {survey.download_url === null ? (
                          <a className="edit-tag tag disable pointer">
                            <i className="la la-download"></i>
                          </a>
                        ) : (
                          <Link
                            to={survey.download_url}
                            className="edit-tag tag"
                            target="_blank"
                          >
                            <i className="la la-download"></i>
                          </Link>
                        )}
                        {
                          <Link
                            className="pending-tag tag"
                            to={`/project-version-submission/${this.props.id}/${survey.id}`}
                          >
                            <i className="la la-clone "></i>
                          </Link>
                        }
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        ) : (
          <DotLoader />
        )}
      </React.Fragment>
    );
  }
}

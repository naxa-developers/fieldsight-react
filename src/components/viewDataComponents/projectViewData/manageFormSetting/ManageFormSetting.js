import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

const sideNavRoutes = [
  { to: "/general", path: "/general", title: "General Forms" },
  { to: "/scheduled", path: "/scheduled", title: "Scheduled Forms" },
  { to: "/stage", path: "/stage", title: "Staged Forms" }
];
const site_specific_forms = [
  { to: "/general-survey", path: "/general-survey", title: "General Forms" }
];

const viewByStatus = [
  { to: "/rejected", path: "/rejected", title: "Rejected Submissions" },
  { to: "/flagged", path: "/flagged", title: "Flagged Submissions" },
  { to: "/pending", path: "/pending", title: "Pending Submissions" },
  { to: "/approved", path: "/approved", title: "Approved Submissions" }
];

class ManageFormSetting extends Component {
  render() {
    const {
      location: { pathname }
    } = this.props;

    return (
      <>
        {!this.props.show_submission && (
          <>
            <div className="manage_group">
              <h5>Site Specific Forms</h5>
              <ul className="nav nav-tabs flex-column border-tabs">
                {sideNavRoutes.map((route, i) => (
                  <li className="nav-item" key={i}>
                    <Link
                      to={`/project-responses/${this.props.match.params.id}${route.to}`}
                      className={
                        this.props.location.pathname ==
                        `/project-responses/${this.props.match.params.id}${route.path}`
                          ? "nav-link active"
                          : "nav-link"
                      }
                    >
                      {route.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="manage_group mrt-15">
              <h5>Project wide Forms</h5>
              <ul className="nav nav-tabs flex-column border-tabs">
                {site_specific_forms.map((route, i) => (
                  <li className="nav-item" key={i}>
                    <Link
                      to={`/project-responses/${this.props.match.params.id}${route.to}`}
                      className={
                        this.props.location.pathname ==
                        `/project-responses/${this.props.match.params.id}${route.path}`
                          ? "nav-link active"
                          : "nav-link"
                      }
                    >
                      {route.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {!!this.props.show_submission && (
          <ul className="nav nav-tabs flex-column border-tabs">
            {viewByStatus.map((route, i) => (
              <li className="nav-item" key={i}>
                <Link
                  to={`/project-responses/${this.props.match.params.id}${route.to}`}
                  className={
                    this.props.location.pathname ==
                    `/project-responses/${this.props.match.params.id}${route.path}`
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  {route.title}
                </Link>
                <h5>{route.heading}</h5>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

export default withRouter(ManageFormSetting);

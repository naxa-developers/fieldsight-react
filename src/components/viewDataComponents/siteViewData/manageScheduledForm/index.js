import React, { Component } from "react";
import ResponseTable from "../../responded/ResponseTable";
import axios from "axios";
import DeleteTable from "../deleteTable";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { getsiteViewData } from "../../../../actions/siteViewDataAction";
import { DotLoader } from "../../../myForm/Loader";

class ManageScheduledForm extends Component {
  state = {
    hide: true
  };
  componentDidMount() {
    if (this.props.id != "") {
      this.props.getsiteViewData(this.props.id, "scheduled");
    }
  }
  toggleHide = () => {
    this.setState({
      hide: !this.state.hide
    });
  };

  render() {
    const {
      props: {
        showViewData,
        data,
        scheduled_forms,
        deleted_forms,
        scheduled_loading
      }
    } = this;

    return (
      <React.Fragment>
        <div className="card-header main-card-header sub-card-header">
          <h5>{!data ? "Schedule Forms" : "Rejected Submission"}</h5>
          <Link to={`/site-responses/${this.props.id}/rejected`}>
            <button onClick={showViewData} className="fieldsight-btn">
              {data ? "View By Form" : "View by Status"}
            </button>
          </Link>
        </div>
        <div className="card-body">
          {!data &&
            (scheduled_loading ? (
              <ResponseTable
                generals_forms={scheduled_forms}
                table="site"
                id={this.props.id}
                survey="true"
              />
            ) : (
              <DotLoader />
            ))}
        </div>
        {deleted_forms.length > 0
          ? !data && (
              <div className="card no-boxshadow">
                <div className="card-header main-card-header sub-card-header">
                  <h5>Deleted Forms</h5>
                  <div className="dash-btn">
                    {this.state.hide ? (
                      <button
                        type="button"
                        className="btn-toggle"
                        onClick={this.toggleHide}
                      >
                        show
                        <div className="handle"></div>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-toggle"
                        onClick={this.toggleHide}
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          textAlign: "left"
                        }}
                      >
                        hide
                        <div
                          className="handle"
                          style={{ left: "auto", right: "0.1875rem" }}
                        ></div>
                      </button>
                    )}
                  </div>
                </div>
                <div className="card-body">
                  {!this.state.hide && (
                    <DeleteTable
                      deleted_forms={deleted_forms}
                      id={this.props.id}
                      loader={loading}
                    />
                  )}
                </div>
              </div>
            )
          : ""}
      </React.Fragment>
    );
  }
}
//export default ManageScheduledForm;
const mapStateToProps = ({ siteViewData }) => {
  const { scheduled_forms, deleted_forms, scheduled_loading } = siteViewData;

  return {
    scheduled_forms,
    deleted_forms,
    scheduled_loading
  };
};
export default compose(
  connect(
    mapStateToProps,
    {
      getsiteViewData
    }
  )
)(ManageScheduledForm);

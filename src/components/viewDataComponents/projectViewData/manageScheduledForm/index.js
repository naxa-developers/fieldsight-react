import React, { Component } from "react";
import ResponseTable from "../../responded/ResponseTable";
import DeleteTable from "../deleteTable";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { getProjectViewData } from "../../../../actions/viewDataActions";
import { DotLoader } from "../../../myForm/Loader";

class ManageScheduledForm extends Component {
  state = {
    hide: true
  };
  componentDidMount() {
    if (this.props.id != "") {
      this.props.getProjectViewData(this.props.id, "scheduled");
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
        scheduled_loader,
        scheduled_forms,
        deleted_forms
      }
    } = this;

    return (
      <React.Fragment>
        <div className="card-header main-card-header sub-card-header">
          <h5>{!data ? "Schedule Forms" : "Rejected Submission"}</h5>
          <Link to={this.props.url}>
            <button onClick={showViewData} className="fieldsight-btn">
              {data ? "View By Form" : "View by Status"}
            </button>
          </Link>
        </div>
        <div className="card-body">
          {!data &&
            (scheduled_loader ? (
              <ResponseTable
                generals_forms={scheduled_forms}
                survey="true"
                id={this.props.id}
              />
            ) : (
              <DotLoader />
            ))}

          {/* {!!data && <Rejected id={this.props.id} />} */}
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
                      id={this.props.id}
                      deleted_forms={deleted_forms}
                      loader={scheduled_loader}
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
const mapStateToProps = ({ projectViewData }) => {
  const { scheduled_forms, deleted_forms, scheduled_loader } = projectViewData;

  return {
    scheduled_forms,
    deleted_forms,
    scheduled_loader
  };
};
export default compose(
  connect(
    mapStateToProps,
    {
      getProjectViewData
    }
  )
)(ManageScheduledForm);

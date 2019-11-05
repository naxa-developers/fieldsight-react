import React, { Component } from "react";
import { Link } from "react-router-dom";
import ResponseTable from "../../responded/ResponseTable";
import { connect } from "react-redux";
import { compose } from "redux";
import DeleteTable from "../deleteTable";
import { DotLoader } from "../../../myForm/Loader";
import { getProjectViewData } from "../../../../actions/viewDataActions";

class ManageGeneralForm extends Component {
  state = {
    hide: true
  };

  componentDidMount() {
    if (this.props.id !== "") {
      this.props.getProjectViewData(this.props.id, "general");
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
        data,
        showViewData,
        generals_forms,
        deleted_forms,
        generals_loader
      }
    } = this;

    return (
      <React.Fragment>
        <div className="card-header main-card-header sub-card-header">
          <h5>General Forms</h5>
          <div className="dash-btn">
            <Link to={this.props.url}>
              <button onClick={showViewData} className="fieldsight-btn">
                {data ? "View By Form" : "View by Status"}
              </button>
            </Link>
          </div>
        </div>
        <div className="card-body">
          {!data &&
            (generals_loader ? (
              <ResponseTable
                generals_forms={generals_forms}
                id={this.props.id}
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
                      loader={loader}
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

const mapStateToProps = ({ projectViewData }) => {
  const { generals_forms, deleted_forms, generals_loader } = projectViewData;

  return {
    generals_forms,
    deleted_forms,
    generals_loader
  };
};
export default compose(
  connect(
    mapStateToProps,
    {
      getProjectViewData
    }
  )
)(ManageGeneralForm);

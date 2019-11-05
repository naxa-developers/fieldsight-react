import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import ProjectDeleteTable from "../../responded/DeleteTable";
import { DotLoader } from "../../../myForm/Loader";

class DeleteTable extends Component {
  state = {
    deleted_forms: [],
    loader: ""
  };
  static getDerivedStateFromProps(props, state) {
    return {
      deleted_forms: props.deleted_forms,
      loader: props.loader
    };
  }
  render() {
    const { loader } = this.state;
    return (
      <React.Fragment>
        {loader == true ? (
          <ProjectDeleteTable
            deleted_forms={this.state.deleted_forms}
            id={this.props.id}
          />
        ) : (
          <DotLoader />
        )}
      </React.Fragment>
    );
  }
}
export default DeleteTable;

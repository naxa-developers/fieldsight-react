import React, { Component } from "react";
import SiteDeleteTable from "../../responded/DeleteTable";

class DeleteTable extends Component {
  state = {
    deleted_forms: []
  };
  static getDerivedStateFromProps(props, state) {
    return {
      deleted_forms: props.deleted_forms
    };
  }
  render() {
    return (
      <React.Fragment>
        <SiteDeleteTable
          deleted_forms={this.state.deleted_forms}
          id={this.props.id}
          table="site"
        />
      </React.Fragment>
    );
  }
}
export default DeleteTable;

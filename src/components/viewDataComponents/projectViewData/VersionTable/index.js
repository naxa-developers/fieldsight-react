import React, { Component } from "react";
import VersionTable from "../../responded/Version";
import axios from "axios";

class ProjectVersionTable extends Component {
  state = {
    id: this.props.match.params && this.props.match.params.id,
    fid: this.props.match.params && this.props.match.params.fid
  };

  render() {
    return (
      <React.Fragment>
        <VersionTable
          id={this.state.id}
          fid={this.state.fid}
          project="project"
        />
      </React.Fragment>
    );
  }
}

export default ProjectVersionTable;

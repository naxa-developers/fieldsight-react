import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import format from "date-fns/format";
import { withRouter, Link } from "react-router-dom";

const Td = ({ children, to }) => {
  return (
    <td>
      <Link to={to}>{children}</Link>
    </td>
  );
};
class TableRow extends Component {
  renderName = (dataType, id) => {
    return this.props[dataType].find(dtype => dtype.id === +id).name;
  };

  tableRowMethod = () => {
    const {
      match: { url }
    } = this.props;

    return {
      siteInfo: (row, i, editHandler, removeHandler) => (
        <tr key={i}>
          <td>{row.question_text}</td>
          <td>{row.question_type}</td>
          <td>{row.form_id && this.renderName("forms", row.form_id)}</td>
          <td>{row.question && row.question.name}</td>
          <td>
            {row.selectedProject && this.renderName("projects", row.form_id)}
          </td>
          <td>
            <a
              onClick={() => editHandler(row.id || row.question_text)}
              className="td-edit-btn"
            >
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <i className="la la-edit" />
              </OverlayTrigger>
            </a>
            <a
              onClick={() => removeHandler(row.id || row.question_text)}
              className="td-delete-btn"
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Delete</Tooltip>}
              >
                <i className="la la-trash-o" />
              </OverlayTrigger>
            </a>
          </td>
        </tr>
      ),

      siteType: (row, i, editHandler, removeHandler) => (
        <tr key={row.id}>
          <td>{row.identifier}</td>
          <td>{row.name}</td>
          <td>
            <a onClick={() => editHandler(row.id)} className="td-edit-btn">
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <i className="la la-edit" />
              </OverlayTrigger>
            </a>
            <a onClick={() => removeHandler(row.id)} className="td-delete-btn">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Delete</Tooltip>}
              >
                <i className="la la-trash-o" />
              </OverlayTrigger>
            </a>
          </td>
        </tr>
      ),

      manageRegion: (row, i, editHandler, removeHandler) => (
        <tr key={row.id}>
          <Td to={`${url}/${row.id}/sub-region`}>{row.identifier}</Td>
          <Td to={`${url}/${row.id}/sub-region`}>{row.name}</Td>
          <Td to={`${url}/${row.id}/sub-region`}>
            {format(row.date_created, ["MMMM Do YYYY, h:mm:ss a"])}
          </Td>
          <td>
            <a onClick={() => editHandler(row.id)} className="td-edit-btn">
              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                <i className="la la-edit" />
              </OverlayTrigger>
            </a>
            <a onClick={() => removeHandler(row.id)} className="td-delete-btn">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Delete</Tooltip>}
              >
                <i className="la la-trash-o" />
              </OverlayTrigger>
            </a>
          </td>
        </tr>
      ),

      termsAndLabels: row => (
        <tr key={row[0]}>
          <td style={{ textTransform: "capitalize" }}>
            {row[0].replace("_", " ")}
          </td>
          <td style={row[1] ? {} : { textTransform: "capitalize" }}>
            {row[1] || row[0].replace("_", " ")}{" "}
          </td>
        </tr>
      )
    };
  };

  render() {
    const {
      props: {
        tableRow,
        page,
        editHandler,
        removeHandler,
        selectRegionHandler
      },
      tableRowMethod
    } = this;
    return (
      <tbody>
        {tableRow.map((row, i) =>
          tableRowMethod()[page](
            row,
            i,
            editHandler,
            removeHandler,
            selectRegionHandler
          )
        )}
      </tbody>
    );
  }
}

export default withRouter(TableRow);

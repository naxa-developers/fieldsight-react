import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Table from 'react-bootstrap/Table';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import TableHeader from '../common/TableHeader';
import TableRow from '../common/TableRow';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-array-index-key  */
/* eslint-disable consistent-return  */

const tableHeader = [
  'app.attribute',
  'app.type',
  'app.forms',
  'app.question',
  'app.project',
  'app.action',
];

const DragHandle = sortableHandle(({ each, index }) => (
  <tr key={`question_${index}`}>
    <td>
      <span className="drag-icon">
        <i className="la la-ellipsis-v" />
        <i className="la la-ellipsis-v" />
      </span>
      {each.question_text}
    </td>
    <td>{each.question_type}</td>
    <td>{each.form_id && each.form_id}</td>
    <td>{each.question && each.question.name}</td>
    <td>{each.selectedProject && each.form_id}</td>
    <td>
      <a
        // onClick={() => editHandler(each.id || each.question_text)}
        className="td-edit-btn td-btn"
      >
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Edit</Tooltip>}
        >
          <i className="la la-edit" />
        </OverlayTrigger>
      </a>
      <a
        // onClick={() => removeHandler(each.id || each.question_text)}
        className="td-delete-btn td-btn"
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
));

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <Table
      responsive="xl"
      className="table  table-bordered  dataTable "
    >
      <TableHeader tableHeader={tableHeader} />
      {children}
    </Table>
  );
});

const SortableItem = sortableElement(
  ({ each, index, removeHandler, editHandler }) => (
    <DragHandle
      each={each}
      index={index}
      removeHandler={removeHandler}
      editHandler={editHandler}
    />
  ),
);

class SortableSiteInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.rowData,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rowData !== this.props.rowData) {
      this.setState({
        data: nextProps.rowData,
      });
    }
    if (nextProps.isReorderCancel !== this.props.isReorderCancel) {
      this.setState(state => {
        if (nextProps.isReorderCancel) {
          return { data: this.props.rowData };
        }
      });
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(
      ({ data }) => {
        return {
          data: arrayMove(data, oldIndex, newIndex),
        };
      },
      () => {
        this.props.handleSaveReorder(this.state.data);
      },
    );
  };

  render() {
    const {
      props: { removeHandler, editHandler, forms, page, reOrder },
      state: { data },
    } = this;

    return (
      <div style={{ position: 'relative', height: '290px' }}>
        <PerfectScrollbar>
          <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
            {reOrder ? (
              <tbody>
                {data.map((each, index) => (
                  <SortableItem
                    key={`item-${index}`}
                    index={index}
                    // name={sub.name}
                    each={each}
                    removeHandler={removeHandler}
                    editHandler={editHandler}
                  />
                ))}
              </tbody>
            ) : (
              <TableRow
                tableRow={data}
                page={page}
                forms={forms}
                removeHandler={removeHandler}
                editHandler={editHandler}
              />
            )}
          </SortableContainer>
        </PerfectScrollbar>
      </div>
    );
  }
}

export default SortableSiteInfo;

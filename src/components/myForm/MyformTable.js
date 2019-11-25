import React, { Component } from 'react';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import FormShare from './formShare';
import { DotLoader } from './Loader';
import DeleteModal from '../common/DeleteModal';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-unused-state  */
/* eslint-disable react/no-array-index-key  */

const url = 'fv3/api/myforms/';
const deleteUrl = '/fv3/api/form/delete/';

class MyformTable extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      project_list: [],
      list: [],
      shareOption: false,
      dLoader: true,
      tblDiv: false,
      showDeleteConfirmation: false,
      delete_id: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(`${url}`)

      .then(res => {
        if (this._isMounted) {
          if (res.status === 200) {
            const modifiedList = res.data.map(user => ({
              ...user,
              share: false,
            }));

            this.setState({
              list: modifiedList,
              dLoader: false,
            });
          }
        }
      })
      .catch(err => {
        this.setState({
          dLoader: false,
        });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  deleteHandler = (e, ids) => {
    this.setState({
      delete_id: ids,
      showDeleteConfirmation: true,
    });
  };

  cancelHandler = () => {
    this.setState({
      showDeleteConfirmation: false,
    });
  };

  shareToggle = (e, id) => {
    const { list } = this.state;
    const formList = list.map(user =>
      user.id_string === id
        ? { ...user, share: !user.share }
        : { ...user, share: false },
    );
    this.setState({
      list: formList,
    });
  };

  confirmHandler = () => {
    const id = this.state.delete_id;
    axios
      .post(`${deleteUrl}`, { id_string: id })

      .then(res => {
        const newUserList = [...this.state.list];
        const deletedForm = newUserList.filter(
          user => user.id_string !== id,
        );
        this.setState({
          list: deletedForm,
          showDeleteConfirmation: false,
        });
      })
      .catch(err => {
        // this.setState({
        //   dLoader: false
        // });
      });
  };

  render() {
    const { OpenTabHandler, commonPopupHandler } = this.props;
    return (
      <>
        <div className="myform-table">
          {/*  <div className="add-btn"><a href="#/" onClick={this.props.myFormPopup}>Add new <span><i className="la la-plus"></i></span></a></div> */}
          <div
            className="table-wrapper"
            style={{ position: 'relative', height: '500px' }}
          >
            <PerfectScrollbar>
              <table
                id="myform_table"
                className="table-bordered table myform_table dataTable"
              >
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage
                        id="app.form-name"
                        defaultMessage="Form Name"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.create-date"
                        defaultMessage="Create Date"
                      />
                    </th>
                    <th>
                      {' '}
                      <FormattedMessage
                        id="app.updatedDate"
                        defaultMessage="Updated date"
                      />
                    </th>
                    <th>
                      {' '}
                      <FormattedMessage
                        id="app.action"
                        defaultMessage="Action"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.list.map((item, i) => (
                    <FormShare
                      key={i + 1}
                      item={item}
                      OpenTabHandler={OpenTabHandler}
                      commonPopupHandler={commonPopupHandler}
                      deleteHandler={this.deleteHandler}
                      shareToggle={this.shareToggle}
                    />
                  ))}
                </tbody>
              </table>

              {this.state.dLoader && <DotLoader />}
            </PerfectScrollbar>
          </div>
        </div>
        {this.state.showDeleteConfirmation && (
          <DeleteModal
            onConfirm={this.confirmHandler}
            onCancel={this.cancelHandler}
            onToggle={this.cancelHandler}
            message="Any submissions submitted in the form will be deleted and will be lost from project and sites associated. Are you sure you want to delete the form?"
          />
        )}
      </>
    );
  }
}

export default MyformTable;

import React, { Component } from 'react';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import SharedFormShare from './SharedFormShare';
import { DotLoader } from './Loader';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-unused-state  */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key  */

const url = 'fv3/api/sharedforms/';

class SharedTable extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      project_list: [],
      list: [],
      shareOption: false,
      dLoader: true,
      tblDiv: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(`${url}`)

      .then(res => {
        if (this._isMounted) {
          if (res.status === 200) {
            this.setState({
              list: res.data,
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

  cloneHandler = (e, clone_url, id, form_id) => {
    axios
      .post(`${clone_url}`, { id_string: id, project: form_id })
      .then(res => {
        // successToast("Form", "cloned");
      })
      .catch(err => console.log('err', err));
  };

  render() {
    const {
      props: { commonPopupHandler, OpenTabHandler },
      state: { dLoader, list },
    } = this;

    return (
      <>
        <div className="myform-table">
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
                        id="app.formOwner"
                        defaultMessage="Form Owner"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.create-date"
                        defaultMessage="Create Date"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.updatedDate"
                        defaultMessage="Updated date"
                      />
                    </th>
                    <th>
                      <FormattedMessage
                        id="app.action"
                        defaultMessage="Action"
                      />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.list.map((item, i) => (
                    <SharedFormShare
                      key={i + 1}
                      item={item}
                      OpenTabHandler={OpenTabHandler}
                      commonPopupHandler={commonPopupHandler}
                      cloneHandler={this.cloneHandler}
                    />
                  ))}
                </tbody>
              </table>
              {list.length === 0 && !dLoader && (
                <div className="card-header main-card-header sub-card-header bg-header">
                  <h5>
                    <FormattedMessage
                      id="app.noFormDataAvailable"
                      defaultMessage="No Form Data Available"
                    />
                  </h5>
                </div>
              )}

              {dLoader && <DotLoader />}
            </PerfectScrollbar>
          </div>
        </div>
      </>
    );
  }
}

export default SharedTable;

import React, { PureComponent } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { FormattedMessage } from 'react-intl';
import MyformTable from './MyformTable';
import SharedTable from './SharedTable';
/* eslint-disable react/prop-types  */
/* eslint-disable camelcase */

const base_url = 'https://fieldsight.naxa.com.np';

class MyFormContent extends PureComponent {
  render() {
    const { OpenTabHandler, commonPopupHandler } = this.props;
    return (
      <>
        <div className="col-xl-9 col-lg-8">
          <div className="right-content">
            <div className="tab-content">
              <div className="tab-pane fade show active">
                <div className="card no-boxshadow">
                  <div className="card-header main-card-header sub-card-header">
                    {/* <h5>My Forms</h5>*/}
                    <h5>
                      <FormattedMessage
                        id="app.my-forms"
                        defaultMessage="My Forms"
                      />
                    </h5>
                    <div className="add-btn">
                      <a
                        href={`${base_url}/forms/create/`}
                        target="_blank"
                        data-tab="site-popup"
                        rel="noopener noreferrer"
                      >
                        <FormattedMessage
                          id="app.create-new"
                          defaultMessage="Create New"
                        />
                        <span>
                          <i className="la la-plus" />
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="card-body">
                    <MyformTable
                      OpenTabHandler={OpenTabHandler}
                      commonPopupHandler={commonPopupHandler}
                    />
                  </div>
                </div>

                <div className="card no-boxshadow mrt-30">
                  <div className="card-header main-card-header sub-card-header">
                    <h5>
                      {' '}
                      <FormattedMessage
                        id="app.formsSharedWithMe"
                        defaultMessage="Forms Shared With Me"
                      />
                    </h5>
                  </div>
                  <div className="card-body">
                    <SharedTable
                      OpenTabHandler={OpenTabHandler}
                      commonPopupHandler={commonPopupHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default MyFormContent;

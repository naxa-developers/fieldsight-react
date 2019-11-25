import React from 'react';
import Table from 'react-bootstrap/Table';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { DotLoader } from '../../myForm/Loader';
import isEmpty from '../../../utils/isEmpty';
/* eslint-disable react/prop-types  */

class SiteListTable extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     project_id: JSON.parse(props.id),
  //   };
  // }

  render() {
    const { data, loader, terms } = this.props;
    const tableHeight = data.length > 0 ? '324px' : '396px';
    return (
      <>
        <div className="card-body">
          <div
            style={{
              position: 'relative',
              height: `${tableHeight} `,
            }}
          >
            <PerfectScrollbar>
              {loader && <DotLoader />}
              {!loader && (
                <Table
                  responsive="xl"
                  className="table  table-bordered  dataTable"
                >
                  <thead>
                    <tr>
                      <th>
                        {!isEmpty(terms) ? `${terms.site}` : 'Sites'}
                        Name
                      </th>

                      <th>
                        <FormattedMessage
                          id="app.id"
                          defaultMessage="id"
                        />
                      </th>

                      <th>
                        {!isEmpty(terms)
                          ? `${terms.region}`
                          : 'Region'}
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.type"
                          defaultMessage="Type"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.progress"
                          defaultMessage=" Progress"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.submissions"
                          defaultMessage="Submissions"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.latest-status"
                          defaultMessage="Latest status"
                        />
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {!loader && data.length === 0 && (
                      <tr>
                        <td colSpan={7}>
                          <p>
                            <FormattedMessage
                              id="app.noFormDataAvailable"
                              defaultMessage="No Form Data Available"
                            />
                          </p>
                        </td>
                      </tr>
                    )}
                    {!loader &&
                      data.map(item => (
                        <tr key={item.id}>
                          <td>
                            <a
                              href={`/fieldsight/application/#/site-dashboard/${item.id}`}
                              className="pending table-profile"
                            >
                              {/* <figure>
                                <img src={item.logo} alt="site-logo" />
                              </figure> */}
                              <h5>{item.name}</h5>
                            </a>
                          </td>
                          <td>{item.identifier}</td>

                          {/* <td>{item.address}</td> */}
                          <td>
                            {item.region}
                            {/* <a href="#" className="pending">
                            </a> */}
                          </td>
                          <td>{item.type}</td>
                          <td>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow="40"
                                aria-valuemin="0"
                                aria-valuemax="200"
                                style={{
                                  width: `${item.progress} %`,
                                }}
                              >
                                <span className="progress-counts">
                                  {`${item.progress} %`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td style={{ right: '-28px' }}>
                            {item.submissions}
                          </td>
                          <td>
                            <a
                              className={
                                item.status != null
                                  ? item.status.toLowerCase()
                                  : ''
                              }
                            >
                              {item.status != null
                                ? item.status
                                : 'No Submission Yet'}
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              )}
            </PerfectScrollbar>
          </div>
        </div>
      </>
    );
  }
}
export default SiteListTable;

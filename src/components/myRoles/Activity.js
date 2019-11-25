import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import CustomMap from './CustomMap';

let baseURL = window.base_url
  ? window.base_url
  : 'https://fieldsight.naxa.com.np/fieldsight/application';

const selectPeriod = ['Last 7 days', 'Last month', 'Last Year'];

const url = 'fv3/api/latestsubmissions/';

class Activity extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      activity: [],
      map: [],
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
              activity: res.data,
            });
          }
        }
      })
      .catch(err => {
        // this.setState({
        //   dLoader: false
        // });
      });
  }

  render() {
    return (
      <div className="">
        <div className="dash-btn append-btn">
          <Dropdown>
            <Dropdown.Toggle
              variant=""
              id="dropdown-Data"
              className="fieldsight-btn"
            >
              <i className="fa fa-paste" />
              <span>
                <FormattedMessage
                  id="app.selectPeriod"
                  defaultMessage="Select period"
                />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-right">
              {selectPeriod.map((item, i) => (
                <Dropdown.Item href={`#/action-${i}`} key={i}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="row">
          <div className="col-xl-4 col-md-6">
            <div className="card activity-submission">
              <div className="card-header main-card-header sub-card-header">
                <h5>
                  <FormattedMessage
                    id="app.latest-submission"
                    defaultMessage="Latest Submission"
                  />
                </h5>
              </div>
              <div className="card-body">
                <div
                  className="thumb-list mr-0"
                  style={{ position: 'relative', height: '655px' }}
                >
                  <PerfectScrollbar>
                    <ul>
                      {this.state.activity.map((item, i) => (
                        <a
                          href={baseURL + item.properties.detail_url}
                          target="_blank"
                          key={i}
                        >
                          <li>
                            <div className="content">
                              <h6>{item.properties.form}</h6>
                              <time>
                                <i className="la la-clock" />
                              </time>
                            </div>
                          </li>
                        </a>
                      ))}
                    </ul>
                  </PerfectScrollbar>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-md-6">
            <div className="card">
              <div className="card-header main-card-header sub-card-header">
                <h5>
                  <FormattedMessage
                    id="app.map"
                    defaultMessage="Map"
                  />
                </h5>
              </div>
              <div className="card-body">
                <div id="map" style={{ height: '415px' }}>
                  <CustomMap activity={this.state.activity} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}

export default Activity;

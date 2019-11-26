import React, { Component } from "react";

export class OtherTask extends Component {
  render() {
    return (
      <div className="tab-pane fade show active">
        <ul>
          <li>
            <a href="#">
              <figure>
                <i className="la la-hourglass-2 pending" />
              </figure>
              <div className="notify-info">
                <p className="">
                  Site Progress Xls Report Image <b>STFC - Nuwakot</b>
                  has been started
                </p>
                <time>Added on November, 22, 2019, 10:32 am</time>
              </div>
            </a>
          </li>
          <li>
            <a href="#">
              <figure>
                <i className="la la-check-circle approved" />
              </figure>
              <div className="notify-info">
                <p className="">
                  Zip Site Images of <b>Amulya House</b> is ready to download.
                </p>
                <time>Added on November, 22, 2019, 10:32 am</time>
                <div className="download-file">
                  <b>download file</b>
                </div>
              </div>
            </a>
          </li>
          <li className="dropdown-footer">
            <a className="text-center" href="#">
              <span>View All</span>
              <span>Mark all as seen</span>{" "}
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default OtherTask;
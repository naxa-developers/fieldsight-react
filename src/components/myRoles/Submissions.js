import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BlockContentLoader } from '../common/Loader';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-array-index-key  */

class Submissions extends PureComponent {
  render() {
    const { submissionLoader, submission } = this.props;
    return (
      <div className="">
        {submissionLoader && (
          <BlockContentLoader height="20px" number={23} />
        )}
        {!submissionLoader && (
          <div className="thumb-list mr-0">
            <ul style={{ position: 'relative', height: '650px' }}>
              {submission.length === 0 && (
                <p>
                  <FormattedMessage
                    id="app.noDataAvailable"
                    defaultMessage="No Data Available"
                  />
                </p>
              )}
              <PerfectScrollbar>
                {submission.map((sub, i) => (
                  <li key={i}>
                    {/* <figure>
                <img src="" alt="profile" />
             
                </figure> */}
                    <div className="content">
                      <p>
                        <a href={sub.profile}>{sub.submitted_by}</a>
                        <FormattedMessage
                          id="app.submittedResponse"
                          defaultMessage="submitted a response for"
                        />
                        <a href={sub.form_url}>
                          <b>{sub.form_name}</b>
                        </a>
                        <FormattedMessage
                          id="app.in"
                          defaultMessage="in"
                        />
                        <a href={sub.extra_object_url}>
                          <b>{sub.extra_object}</b>
                        </a>
                      </p>
                      <time>
                        <i className="la la-clock" />
                        {sub.date}
                      </time>
                    </div>
                  </li>
                ))}
              </PerfectScrollbar>
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Submissions;

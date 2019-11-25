import React from 'react';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-array-index-key  */
/* eslint-disable  jsx-a11y/label-has-for  */
/* eslint-disable no-else-return  */
/* eslint-disable jsx-a11y/label-has-associated-control  */

const SubmissionSiteInfo = ({ siteInformation }) => (
  <div className="col-lg-6">
    <div className="card">
      <div className="card-header main-card-header">
        <h5>
          <FormattedMessage
            id="app.site-information"
            defaultMessage="site information"
            description="site information"
          />
        </h5>
      </div>

      <div
        className="card-body site-info submission-site-info"
        style={{ position: 'relative', height: '290px' }}
      >
        {siteInformation &&
        Object.keys(siteInformation).length > 0 ? (
          <PerfectScrollbar>
            <ul>
              {Object.entries(siteInformation).map((info, i) => {
                if (info[1].children) {
                  const childEntries = Object.entries(
                    info[1].children,
                  );
                  return childEntries.map((child, j) => {
                    return (
                      <li key={`${child[0]}${j}`}>
                        <label>{`${child[0]} :`}</label>
                        {child[1]}
                      </li>
                    );
                  });
                } else {
                  return (
                    <li key={`${info[0]}${i}`}>
                      <label>{`${info[0]} :`}</label>
                      {info[1]}
                    </li>
                  );
                }
              })}
            </ul>
          </PerfectScrollbar>
        ) : (
          <p>
            <FormattedMessage
              id="app.siteInfoNotAvailable"
              defaultMessage="Site Information not available"
            />
          </p>
        )}
      </div>
    </div>
  </div>
);

export default SubmissionSiteInfo;

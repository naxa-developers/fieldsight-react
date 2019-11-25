import React from 'react';
import { FormattedMessage } from 'react-intl';

const CountCard = ({
  countName,
  countNumber,
  icon,
  className,
  noSubmissionText,
  id,
}) => {
  return (
    <div className="count-card">
      <div className={`count-icon ${className ? className : ''}`}>
        <i className={`la ${icon}`}> </i>
      </div>
      <div className="count-content">
        {countName != 'Progress' && (
          <h4>{countNumber !== 0 && countNumber}</h4>
        )}
        {countName == 'Progress' && (
          <h4>{countNumber !== 0 && countNumber + '%'}</h4>
        )}
        <h6>
          {noSubmissionText ? (
            countNumber === 0 ? (
              //`No ${countName}`
              <>
                {countName === 'User' || countName === 'user' ? (
                  <>
                    <FormattedMessage
                      id="app.no-user"
                      defaultMessage=" No User"
                    />
                  </>
                ) : (
                  ''
                )}
                {countName === 'project' ? (
                  <>
                    <FormattedMessage
                      id="app.no-projects"
                      defaultMessage="No Project"
                    />
                  </>
                ) : (
                  ''
                )}

                {countName === 'site' ? (
                  <FormattedMessage
                    id="app.no-site"
                    defaultMessage=" No Site"
                  />
                ) : (
                  ''
                )}
                {countName === 'Progress' ? (
                  <FormattedMessage
                    id="app.no-progress"
                    defaultMessage=" No Progress"
                  />
                ) : (
                  ''
                )}
              </>
            ) : (
              <>
                {countName === 'User' || countName === 'user' ? (
                  <FormattedMessage
                    id="app.user"
                    defaultMessage="User"
                  />
                ) : (
                  ''
                )}
                {countName === 'site' ? (
                  <FormattedMessage
                    id="app.site"
                    defaultMessage="Site"
                  />
                ) : (
                  ''
                )}
                {countName === 'Progress' ? (
                  <FormattedMessage
                    id="app.progress"
                    defaultMessage="Progress"
                  />
                ) : (
                  ''
                )}
                {countName === 'project' ? (
                  <>
                    <FormattedMessage
                      id="app.projects"
                      defaultMessage="Project"
                    />
                  </>
                ) : (
                  ''
                )}
              </>
            )
          ) : countNumber === 0 ? (
            //`No ${countName} submission`
            <>
              {!!id ? (
                <>
                  {countName === 'pending' ? (
                    <FormattedMessage
                      id="app.no-pending-submission"
                      defaultMessage="No pending Submission"
                    />
                  ) : (
                    ''
                  )}
                  {countName === 'rejected' ? (
                    <FormattedMessage
                      id="app.no-rejected-submission"
                      defaultMessage="No Rejected Submission"
                    />
                  ) : (
                    ''
                  )}
                  {countName === 'approved' ? (
                    <FormattedMessage
                      id="app.no-approved-submission"
                      defaultMessage="No Approved Submission"
                    />
                  ) : (
                    ''
                  )}
                  {countName === 'flagged' ? (
                    <FormattedMessage
                      id="app.no-flagged-submission"
                      defaultMessage="No flagged Submission"
                    />
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <>
                  {countName === 'pending' ? (
                    <FormattedMessage
                      id="app.pending"
                      defaultMessage="Pending"
                    />
                  ) : (
                    ''
                  )}
                  {countName === 'approved' ? (
                    <FormattedMessage
                      id="app.approved"
                      defaultMessage="Approved"
                    />
                  ) : (
                    ''
                  )}
                  {countName === 'flagged' ? (
                    <FormattedMessage
                      id="app.flagged"
                      defaultMessage="Flagged"
                    />
                  ) : (
                    ''
                  )}
                  {countName === 'rejected' ? (
                    <FormattedMessage
                      id="app.rejected"
                      defaultMessage="Rejected"
                    />
                  ) : (
                    ''
                  )}
                  &nbsp;&nbsp;
                  <FormattedMessage
                    id="app.submissions"
                    defaultMessage=" Submission"
                  />
                </>
              )}
            </>
          ) : (
            <>
              {/*`${countName} submission`*/}
              {countName === 'pending' ? (
                <FormattedMessage
                  id="app.pending"
                  defaultMessage="Pending"
                />
              ) : (
                ''
              )}
              {countName === 'approved' ? (
                <FormattedMessage
                  id="app.approved"
                  defaultMessage="Approved"
                />
              ) : (
                ''
              )}
              {countName === 'flagged' ? (
                <FormattedMessage
                  id="app.flagged"
                  defaultMessage="Flagged"
                />
              ) : (
                ''
              )}
              {countName === 'rejected' ? (
                <FormattedMessage
                  id="app.rejected"
                  defaultMessage="Rejected"
                />
              ) : (
                ''
              )}
              &nbsp;&nbsp;
              <FormattedMessage
                id="app.submission"
                defaultMessage=" Submission"
              />
            </>
          )}
          {countNumber !== 0 && countNumber > 1 && (
            <span style={{ textTransform: 'lowercase' }}>
              <FormattedMessage id="app.s" defaultMessage="s" />
            </span>
          )}
        </h6>
      </div>
    </div>
  );
};

export default CountCard;

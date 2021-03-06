import React, { Fragment } from 'react';
import Table from 'react-bootstrap/Table';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { FormattedMessage } from 'react-intl';
import { BlockContentLoader } from '../../common/Loader';

const ShowRow = ({ name }) => (
  <tr key={name}>
    <td />
    <td>{!!name && <strong>{name}</strong>}</td>
    <td colSpan={6} />
  </tr>
);

const ShowContentRow = ({
  sn,
  id,
  name,
  progress,
  pending,
  approved,
  flagged,
  rejected,
  formUrl,
  fromOrganization,
}) => {
  const totalSubmissions = pending + approved + flagged + rejected;
  // const key = id ? `row_${name}_${sn}_${id}` : `row_${name}_${sn}`;
  return (
    <tr className={id ? 'sub-row' : 'heading-row'}>
      <td>{id ? `${sn}.${id}` : sn}</td>
      <td>{fromOrganization ? `*${name}` : name}</td>

      <td>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow="80"
            aria-valuemin="0"
            aria-valuemax="200"
            style={{
              width: `${progress} %`,
            }}
          >
            <span className="progress-counts">{`${progress}%`}</span>
          </div>
        </div>
      </td>
      <td>
        {formUrl ? (
          <a className="pending table-profile" href={formUrl}>
            <i className="la la-eye" />

            {totalSubmissions === 0
              ? 'No Submission'
              : totalSubmissions > 1
              ? `${totalSubmissions} Submissions`
              : `${totalSubmissions} Submission`}
          </a>
        ) : (
          {}
        )}
      </td>
      <td>
        <a className="pending">{pending}</a>
      </td>
      <td>
        <a className="approved">{approved}</a>
      </td>
      <td>
        <a className="flagged">{flagged}</a>
      </td>
      <td>
        <a className="rejected">{rejected}</a>
      </td>
    </tr>
  );
};

const CheckCase = ({ sub, sn }) => (
  <>
    <tr className="heading-row">
      <td>{sn}</td>
      <td>{sub.name}</td>
      <td colSpan={6} />
    </tr>
    {sub.sub_stages &&
      sub.sub_stages.length > 0 &&
      sub.sub_stages.map((item, key) => {
        return (
          <Fragment key={`row_${item.form_name}_${sn + key}`}>
            <ShowContentRow
              sn={sn}
              id={key + 1}
              name={item.form_name}
              progress={item.progress}
              pending={item.pending}
              approved={item.approved}
              flagged={item.flagged}
              rejected={item.rejected}
              formUrl={item.form_url}
              fromOrganization={item.from_organization}
            />
          </Fragment>
        );
      })}
  </>
);

class ProgressTable extends React.PureComponent {
  render() {
    const { data, loader } = this.props;
    const sn = 1;

    return (
      <>
        {loader ? (
          <BlockContentLoader number={10} height="25px" />
        ) : (
          <div className="card-body">
            <div style={{ position: 'relative', height: '400px' }}>
              <PerfectScrollbar>
                <Table
                  responsive="xl"
                  className="table  table-bordered  dataTable "
                >
                  <thead>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="app.sn"
                          defaultMessage="SN"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.name"
                          defaultMessage="Name"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.progress"
                          defaultMessage="Progress"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.view-submission"
                          defaultMessage="View Submissions"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.pending"
                          defaultMessage="Pending"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.approved"
                          defaultMessage="Approved"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.flagged"
                          defaultMessage="Flagged"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="app.rejected"
                          defaultMessage="Rejected"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(!!data.generals && data.generals)
                      .length > 0 && <ShowRow name="General Forms" />}
                    {!!data.generals &&
                      data.generals.map((general, id) => (
                        <Fragment
                          key={`row_${general.name}_${sn + id}`}
                        >
                          <ShowContentRow
                            sn={sn + id}
                            name={general.name}
                            progress={
                              general.progress_data[0].progress
                            }
                            pending={general.progress_data[0].pending}
                            approved={
                              general.progress_data[0].approved
                            }
                            flagged={general.progress_data[0].flagged}
                            rejected={
                              general.progress_data[0].rejected
                            }
                            formUrl={general.form_url}
                            fromOrganization={
                              general.from_organization
                            }
                          />
                        </Fragment>
                      ))}
                    {Object.keys(!!data.generals && data.generals)
                      .length > 0 && <ShowRow />}
                    {Object.keys(!!data.schedules && data.schedules)
                      .length > 0 && (
                      <ShowRow name="Scheduled Forms" />
                    )}
                    {!!data.schedules &&
                      data.schedules.map((schedule, id) => (
                        <Fragment
                          key={`row_${schedule.name}_${sn + id}`}
                        >
                          <ShowContentRow
                            sn={sn + id}
                            name={schedule.name}
                            progress={
                              schedule.progress_data[0].progress
                            }
                            pending={
                              schedule.progress_data[0].pending
                            }
                            approved={
                              schedule.progress_data[0].approved
                            }
                            flagged={
                              schedule.progress_data[0].flagged
                            }
                            rejected={
                              schedule.progress_data[0].rejected
                            }
                            formUrl={schedule.form_url}
                            fromOrganization={
                              schedule.from_organization
                            }
                          />
                        </Fragment>
                      ))}
                    {Object.keys(!!data.schedules && data.schedules)
                      .length > 0 && <ShowRow />}
                    {Object.keys(!!data.stages && data.stages)
                      .length > 0 && <ShowRow name="Staged Forms" />}
                    {!!data.stages &&
                      data.stages.map((sub, id) => {
                        return (
                          <Fragment key={`sub_${sn + id}`}>
                            <CheckCase sub={sub} sn={sn + id} />
                          </Fragment>
                        );
                      })}
                  </tbody>
                </Table>
              </PerfectScrollbar>
            </div>
          </div>
        )}
      </>
    );
  }
}
export default ProgressTable;

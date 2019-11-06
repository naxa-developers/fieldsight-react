import React, { Fragment } from "react";
import Table from "react-bootstrap/Table";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { DotLoader } from "../../myForm/Loader";
import { BlockContentLoader } from "../../common/Loader";

const ShowRow = ({ name }) => (
  <tr>
    <td />
    <td>{!!name && <strong>{name}</strong>}</td>
    <td />
    <td />
    <td />
    <td />
    <td />
    <td />
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
  formUrl
}) => {
  const totalSubmissions = pending + approved + flagged + rejected;
  return (
    <tr
      className={id ? "sub-row" : "heading-row"}
      key={id ? `row_${name}_${sn}_${id}` : `row_${name}_${sn}`}
    >
      <td>{id ? `${sn}.${id}` : sn}</td>
      <td>{name}</td>

      <td>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow="80"
            aria-valuemin="0"
            aria-valuemax="200"
            style={{
              width: progress + "%"
            }}
          >
            <span className="progress-counts">{progress}%</span>
          </div>
        </div>
      </td>
      <td>
        {formUrl ? (
          <a className="pending table-profile" href={formUrl}>
            <i className="la la-eye"></i>

            {totalSubmissions == 0
              ? "No Submission"
              : totalSubmissions > 1
              ? totalSubmissions + " Submission(s)"
              : totalSubmissions + " Submission "}
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

const CheckCase = ({ sub, sn }) => {
  // if (sub.name) {
  return (
    <Fragment key={`stage_${sn}`}>
      <tr className="heading-row">
        <td>{sn}</td>
        <td>{sub.name}</td>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td />
      </tr>
      {sub.sub_stages &&
        sub.sub_stages.length > 0 &&
        sub.sub_stages.map((item, key) => {
          return (
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
            />
          );
        })}
    </Fragment>
  );
  // }
};
class ProgressTable extends React.Component {
  render() {
    const { data, loader } = this.props;
    const sn = 1;
    return (
      <>
        {loader ? (
          <BlockContentLoader number={10} height="25px" />
        ) : (
          <div className="card-body">
            <div style={{ position: "relative", height: "400px" }}>
              <PerfectScrollbar>
                <Table
                  responsive="xl"
                  className="table  table-bordered  dataTable "
                >
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Name</th>
                      <th>Progress</th>
                      <th>View Submissions</th>
                      <th>Pending</th>
                      <th>Approved</th>
                      <th>Flagged</th>
                      <th>Rejected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(!!data.generals && data.generals).length >
                      0 && <ShowRow name="General Forms" />}
                    {!!data.generals &&
                      data.generals.map((general, id) => (
                        <ShowContentRow
                          sn={sn + id}
                          name={general.name}
                          progress={general.progress_data[0].progress}
                          pending={general.progress_data[0].pending}
                          approved={general.progress_data[0].approved}
                          flagged={general.progress_data[0].flagged}
                          rejected={general.progress_data[0].rejected}
                          formUrl={general.form_url}
                        />
                      ))}
                    {Object.keys(!!data.generals && data.generals).length >
                      0 && <ShowRow />}
                    {Object.keys(!!data.schedules && data.schedules).length >
                      0 && <ShowRow name="Scheduled Forms" />}
                    {!!data.schedules &&
                      data.schedules.map((schedule, id) => (
                        <ShowContentRow
                          sn={sn + id}
                          name={schedule.name}
                          progress={schedule.progress_data[0].progress}
                          pending={schedule.progress_data[0].pending}
                          approved={schedule.progress_data[0].approved}
                          flagged={schedule.progress_data[0].flagged}
                          rejected={schedule.progress_data[0].rejected}
                          formUrl={schedule.form_url}
                        />
                      ))}
                    {Object.keys(!!data.schedules && data.schedules).length >
                      0 && <ShowRow />}
                    {Object.keys(!!data.stages && data.stages).length > 0 && (
                      <ShowRow name="Staged Forms" />
                    )}
                    {!!data.stages &&
                      data.stages.map((sub, id) => {
                        return <CheckCase sub={sub} sn={sn + id} />;
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

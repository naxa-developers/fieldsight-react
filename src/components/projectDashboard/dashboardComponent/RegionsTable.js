import React from 'react';
import Table from 'react-bootstrap/Table';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { DotLoader } from '../../myForm/Loader';
import isEmpty from '../../../utils/isEmpty';

import withPagination from '../../../hoc/WithPagination';
import TableHeader from '../../common/TableHeader';
import TableRow from '../../common/TableRow';
/* eslint-disable react/prop-types  */

class RegionsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project_id: JSON.parse(props.id),
    };
  }

  componentDidMount() {
    this.props.paginationHandler(1, null, {
      type: 'projectRegionList',
      projectId: this.state.project_id,
    });
  }

  render() {
    const { data, loader, terms } = this.props;

    const tableHeader = {
      projectRegions: !isEmpty(terms)
        ? [
            `${terms.region} ID`,
            `${terms.region} Name`,
            ,
            'app.created-date',
            'app.totalSites',
          ]
        : [
            'app.regionId',
            'app.regionName',
            'app.created-date',
            'app.totalSites',
          ],
    };
    return (
      <div className="card-body">
        <div style={{ position: 'relative', height: '396px' }}>
          <PerfectScrollbar>
            {loader && <DotLoader />}
            {!loader && (
              <Table
                responsive="xl"
                className="table  table-bordered  dataTable "
              >
                <TableHeader
                  tableHeader={tableHeader.projectRegions}
                />
                {data.length > 0 ? (
                  <TableRow
                    tableRow={data}
                    page="projectManageRegion"
                  />
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={4}>
                        {' '}
                        <FormattedMessage
                          id="app.noFormDataAvailable"
                          defaultMessage="No Form Data Available"
                        />
                      </td>
                    </tr>
                  </tbody>
                )}
              </Table>
            )}
          </PerfectScrollbar>
        </div>
      </div>
    );
  }
}
export default withPagination(RegionsTable);

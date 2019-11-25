import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class PricingStepThree extends PureComponent {
  render() {
    const {
      props: { cardResponse, handleSubmit },
    } = this;
    return (
      <div className="fieldsight-new">
        <div className="bg-primary p-4">
          <div className="bg-light p-4 m-4">
            <div className="pb-2" />
            <h6 className="text-center mt-4">
              <strong>
                <FormattedMessage
                  id="app.thankuMessage"
                  defaultMessage="Thank you for signing up with FieldSight!"
                />
              </strong>
            </h6>
            <h5 className="text-center mt-2 mb-3">
              <strong>
                <FormattedMessage
                  id="app.uhaveSelectedFreePlan"
                  defaultMessage="You have selected the Free Plan"
                />
              </strong>
            </h5>
            <p className="text-center mb-4 text-xlight">
              <FormattedMessage
                id="app.thirdMessage"
                defaultMessage="FieldSight subscription fees are charged at the
                start of delivering service and renew automatically."
              />
            </p>
            <div className="row">
              <div className="col-md-4">
                <h6 className="mt-4">
                  <strong>
                    <FormattedMessage
                      id="app.planDetail"
                      defaultMessage="Plan Detail"
                    />
                    :
                  </strong>
                </h6>
                <ul className="list-icon mt-4 mb-4">
                  <li>
                    <i className="la la-chevron-circle-right" />
                    <strong>{cardResponse.submissions}</strong>
                    <FormattedMessage
                      id="app.submissions"
                      defaultMessage="Submissions"
                    />
                  </li>
                  <li>
                    <strong>
                      <FormattedMessage
                        id="app.unlimited"
                        defaultMessage="Unlimited"
                      />
                    </strong>
                    <FormattedMessage
                      id="app.userProjectSites"
                      defaultMessage="Users, Projects, Sites"
                    />
                  </li>
                  <li>
                    <i className="la la-chevron-circle-right" />
                    <strong>
                      <FormattedMessage
                        id="app.unlimited"
                        defaultMessage="Unlimited"
                      />
                    </strong>
                    <FormattedMessage
                      id="app.formStageSchedules"
                      defaultMessage="Forms, Stages & Schedules"
                    />
                  </li>
                  <li>
                    <i className="la la-chevron-circle-right" />
                    <strong>
                      <FormattedMessage
                        id="app.unlimited"
                        defaultMessage="Unlimited"
                      />
                    </strong>
                    <FormattedMessage
                      id="app.reportDashboardsMaps"
                      defaultMessage="Reports, Dashboards & Maps"
                    />
                  </li>
                  <li>
                    <i className="la la-chevron-circle-right" />
                    <strong>
                      <FormattedMessage
                        id="app.access"
                        defaultMessage="Access"
                      />
                    </strong>
                    <FormattedMessage
                      id="app.androidApp"
                      defaultMessage="to our Android App"
                    />
                  </li>
                </ul>
              </div>
              <div className="col-md-4">
                <h6 className="mt-4">
                  <strong>
                    <FormattedMessage
                      id="app.planPeriod"
                      defaultMessage="Plan Period"
                    />
                    :
                  </strong>
                </h6>
                <ul className="list-icon mt-4 mb-4">
                  <li>
                    <i className="la la-calendar-check-o" />
                    <strong>
                      <FormattedMessage
                        id="app.startingDate"
                        defaultMessage="Starting Date"
                      />
                    </strong>
                    <p>{cardResponse.starting_date}</p>
                  </li>
                  <li>
                    <i className="la la-calendar-minus-o" />
                    <strong>
                      <FormattedMessage
                        id="app.endingDate"
                        defaultMessage="Ending Date"
                      />
                    </strong>
                    <p>{cardResponse.ending_date}</p>
                  </li>
                </ul>
              </div>
              <div className="col-md-4">
                <h6 className="mt-4">
                  <strong>
                    <FormattedMessage
                      id="app.paymentDetail"
                      defaultMessage="Payment Detail"
                    />
                    :
                  </strong>
                </h6>
                <ul className="list-icon mt-4 mb-4">
                  <li>
                    <i className="la la-money" />
                    <strong>
                      <FormattedMessage
                        id="app.amountPaid"
                        defaultMessage="Amount Paid"
                      />
                    </strong>
                    <p>${cardResponse.amount}</p>
                  </li>
                  <li>
                    <i className="la la-cc-mastercard" />
                    <strong>
                      <FormattedMessage
                        id="app.paymentMethod"
                        defaultMessage="Payment Method"
                      />
                    </strong>
                    <p>
                      <FormattedMessage
                        id="app.card"
                        defaultMessage="Card"
                      />
                      : xxx xxx xxx {cardResponse.card}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <a
                href="#"
                title=""
                className="btn btn-primary"
                onClick={() => {
                  handleSubmit('finish');
                }}
              >
                <FormattedMessage
                  id="app.finish"
                  defaultMessage="Finish"
                />
                <i className="la la-check-circle" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
PricingStepThree.propTypes = {
  cardResponse: PropTypes.objectOf.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
export default PricingStepThree;

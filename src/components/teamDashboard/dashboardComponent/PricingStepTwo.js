import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { CardElement, injectStripe } from 'react-stripe-elements';
import PropTypes from 'prop-types';

class PricingStepTwo extends Component {
  constructor(props) {
    super(props);
    this.handleCardForm = this.handleCardForm.bind(this);
    this.state = { errors: '' };
  }

  formatDate = date => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const dayIndex = date.getDay();
    const dateIdx = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${days[dayIndex]}, ${monthNames[monthIndex]}, ${dateIdx}, ${year}`;
    //   days[dayIndex] +
    //   ', ' +
    //   monthNames[monthIndex] +
    //   ' ' +
    //   dateIdx +
    //   ',  ' +
    //   year
    // );
  };

  handleChange = () => {
    this.setState({ errors: '' });
  };

  async handleCardForm(e) {
    const { token, error } = await this.props.stripe.createToken({
      name: 'stripeToken',
    });
    if (token) this.props.passStripeToken(token.id, '');
    if (error)
      this.setState({ errors: error }, () => {
        this.props.passStripeToken('', this.state.errors.code);
      });
  }

  render() {
    const {
      props: {
        selectedPackage,
        // handleNext,
        handlePrevious,
        packageStartDate,
        packageEndDate,
        selectedPlan,
        interval,
      },
      state: { errors },
    } = this;

    return (
      <div className="fieldsight-new">
        <div className="bg-primary p-4">
          <div className="bg-light p-4 m-4">
            <div className="pb-2" />
            <input type="hidden" name="interval" value={interval} />
            <input
              type="hidden"
              name="plan_name"
              value={selectedPlan}
            />
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
                  id="app.uHaveSelected"
                  defaultMessage="You have selected the"
                />
                {selectedPackage.plan}.
              </strong>
            </h5>
            <p className="text-center mb-4 text-xlight">
              <FormattedMessage
                id="app.secondMessage"
                defaultMessage="To complete the signup process, please provide your payment
                details."
              />
              <br />
              <FormattedMessage
                id="app.thirdMessage"
                defaultMessage="FieldSight subscription fees are charged at the
                start of delivering service and renew automatically."
              />
            </p>
            <div className="row">
              <div className="col-md-3">
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
                    <strong>{selectedPackage.submissions}</strong>
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

              <div className="col-md-3">
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
                    <p>
                      {this.formatDate(new Date(packageStartDate))}
                    </p>
                  </li>
                  <li>
                    <i className="la la-calendar-minus-o" />
                    <strong>
                      <FormattedMessage
                        id="app.endingDate"
                        defaultMessage="Ending Date"
                      />
                    </strong>
                    <p>{this.formatDate(new Date(packageEndDate))}</p>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <div className="card-input-wrap mt-4 mb-4">
                  <div className="checkout">
                    <p>
                      <FormattedMessage
                        id="app.CreditDebit"
                        defaultMessage="Credit or debit card"
                      />
                    </p>
                    <CardElement onChange={this.handleChange} />
                    {Object.keys(errors).length > 0 && (
                      <span className="card-error">
                        {errors.message}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-center">
                  <small />
                </p>
              </div>
            </div>
            <div className="text-center">
              <a
                href="#"
                title=""
                className="btn btn-primary"
                onClick={() => {
                  handlePrevious('first');
                }}
              >
                <i className="la la-long-arrow-left" />
                <FormattedMessage
                  id="app.previous"
                  defaultMessage="Previous"
                />
              </a>
              <a
                href="#"
                title=""
                className="btn btn-primary"
                onClick={this.handleCardForm}
              >
                <FormattedMessage
                  id="app.next"
                  defaultMessage="Next"
                />
                <i className="la la-long-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
PricingStepTwo.propTypes = {
  stripe: PropTypes.objectOf.isRequired,
  passStripeToken: PropTypes.objectOf.isRequired,
  selectedPackage: PropTypes.objectOf.isRequired,
  handlePrevious: PropTypes.func.isRequired,
  packageStartDate: PropTypes.objectOf.isRequired,
  packageEndDate: PropTypes.objectOf.isRequired,
  interval: PropTypes.string.isRequired,
  selectedPlan: PropTypes.string.isRequired,
};
export default injectStripe(PricingStepTwo);

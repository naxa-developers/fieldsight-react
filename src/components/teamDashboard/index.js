import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-bootstrap/Modal';
import { StripeProvider, Elements } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import DashboardHeader from './dashboardComponent/DashboardHeader';
import ProjectList from './dashboardComponent/ProjectList';
import DashboardCounter from './dashboardComponent/DashboardCounter';
import About from './dashboardComponent/About';
import Admin from './dashboardComponent/Admin';
import SiteMap from '../common/SiteMap';

import {
  getTeamDashboard,
  postPackageSubscribe,
} from '../../actions/teamDashboardActions';
import PricingStepOne from './dashboardComponent/PricingStepOne';
import PricingStepTwo from './dashboardComponent/PricingStepTwo';
import PricingStepThree from './dashboardComponent/PricingStepThree';
/* eslint-disable camelcase */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable  consistent-return */
/* eslint-disable  no-lone-blocks */

const now = new Date();
const INITIAL_STATE = {
  activeTab: 'general',
  showHeaderModal: false,
  showSubmissionModal: false,
  showSubsites: false,
  showModal: true,
  stepOne: true,
  stepTwo: false,
  stepThree: false,
  plan: '',
  stripeToken: '',
  interval: 'monthly',
  selectedPlan: {},
  packageStartDate: new Date(),
  packageEndDate: new Date(now.setMonth(now.getMonth() + 2)),
  tokenId: '',
  cardError: 'required',
};

class TeamDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    const { id: teamId } = this.props.match.params;
    this.props.getTeamDashboard(teamId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      const { id: teamId } = this.props.match.params;
      this.setState(
        {
          ...INITIAL_STATE,
        },
        () => {
          this.props.getTeamDashboard(teamId);
        },
      );
    }
    if (prevProps.teamDashboard !== this.props.teamDashboard) {
      this.setState({
        stripeToken: this.props.teamDashboard.stripe_token
          ? this.props.teamDashboard.stripe_token
          : '',
        selectedPlan: this.props.teamDashboard.package_details
          ? this.props.teamDashboard.package_details[0]
          : {},
      });
    }
  }

  closeModal = () => {
    this.setState({
      stepOne: true,
      stepTwo: false,
      stepThree: false,
      showModal: false,
    });
  };

  openModal = type => {
    // const { id: teamId } = this.props.match.params;

    if (type === 'Header' || type === 'Submission') {
      return this.setState({
        [`show${type}Modal`]: true,
      });
    }

    // if (type === 'Subsites') {
    //   return this.setState({
    //     showSubsites: true,
    //   });
    // }

    this.setState({
      [`show${type}`]: true,
    });
  };

  handleIntervalPeriod = e => {
    const { value } = e.target;
    const { packageStartDate } = this.state;
    this.setState(
      {
        interval: value,
      },
      () => {
        if (value === 'monthly') {
          const endDate = packageStartDate.setMonth(
            packageStartDate.getMonth() + 2,
          );
          this.setState({
            packageStartDate: new Date(),
            packageEndDate: new Date(endDate),
          });
        } else if (value === 'yearly') {
          const endDate = packageStartDate.setFullYear(
            packageStartDate.getFullYear() + 1,
          );
          this.setState({
            packageStartDate: new Date(),
            packageEndDate: new Date(endDate),
          });
        }
      },
    );
  };

  handleNext = step => {
    const { cardError, stepThree } = this.state;

    this.setState(
      state => {
        switch (step) {
          case 'second': {
            return {
              stepOne: false,
              stepTwo: true,
            };
          }
          case 'third':
            {
              if (Object.keys(cardError).length === 0) {
                return {
                  stepThree: true,
                  stepTwo: false,
                };
              }
            }
            break;
          default: {
            return {
              stepOne: true,
              stepTwo: false,
              stepThree: false,
            };
          }
        }
      },
      () => {
        if (stepThree) {
          const { tokenId, plan, interval } = this.state;
          const { id: teamId } = this.props.match.params;
          const payload = {
            stripeToken: tokenId,
            interval,
            plan_name: plan,
          };
          this.props.postPackageSubscribe(teamId, payload);
        }
      },
    );
  };

  handlePrevious = () => {
    this.setState({
      stepOne: true,
      stepTwo: false,
    });
  };

  handleFirstStepSelect = (selected, data) => {
    this.setState({ plan: selected, selectedPlan: data });
  };

  passStripeToken = (id, error) => {
    this.setState(
      state => {
        if (error) return { cardError: error };
        if (id) {
          return { tokenId: id, cardError: '' };
        }
      },
      () => {
        if (id) {
          this.handleNext('third');
        }
      },
    );
  };

  render() {
    const {
      props: {
        teamDashboard: {
          id,
          name,
          address,
          public_desc,
          logo,
          contact,
          total_sites,
          submissions,
          projects,
          admin,
          map,
          breadcrumbs,
          teamDashboardLoader,
          total_projects,
          total_users,
          package_details,
          postCardResponse,
        },
        match: {
          params: { id: teamId },
        },
      },
      state: {
        packageStartDate,
        packageEndDate,
        activeTab,
        showModal,
        stepOne,
        stepTwo,
        stepThree,
        interval,
        stripeToken,
        plan,
        selectedPlan,
      },
      closeModal,
      openModal,
      handleFirstStepSelect,
    } = this;
    // console.log("props", this.props);
    const packageSelected = Object.keys(plan).length > 0;
    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          {Object.keys(breadcrumbs).length > 0 && (
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href={breadcrumbs.teams_url}>
                  {breadcrumbs.teams}
                </a>
              </li>
              <li className="breadcrumb-item">{breadcrumbs.name}</li>
            </ol>
          )}
        </nav>
        {package_details && package_details.length > 0 && (
          <Modal
            className="modal-container custom-map-modal"
            show={showModal}
            onHide={this.closeModal}
            animation
          >
            <Modal.Header closeButton>
              <Modal.Title>Choose a plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {stepOne && (
                <PricingStepOne
                  packageDetails={package_details}
                  handleNext={this.handleNext}
                  handleFirstStepSelect={handleFirstStepSelect}
                  handleIntervalPeriod={this.handleIntervalPeriod}
                  periodType={interval}
                  isPackageSelected={packageSelected}
                />
              )}
              {stepTwo && (
                <StripeProvider apiKey={stripeToken}>
                  <Elements>
                    <PricingStepTwo
                      selectedPackage={selectedPlan}
                      // handleNext={this.handleNext}
                      handlePrevious={this.handlePrevious}
                      packageStartDate={packageStartDate}
                      packageEndDate={packageEndDate}
                      selectedPlan={plan}
                      interval={interval}
                      passStripeToken={this.passStripeToken}
                    />
                  </Elements>
                </StripeProvider>
              )}
              {stepThree && (
                <PricingStepThree
                  cardResponse={postCardResponse}
                  handleSubmit={this.closeModal}
                />
              )}
            </Modal.Body>
          </Modal>
        )}
        <div className="row">
          <div className="col-xl-12">
            <div className="right-content no-bg new-dashboard">
              <DashboardHeader
                name={name}
                address={address}
                logo={logo}
                public_desc={public_desc}
                totalSites={total_sites}
                totalUser={total_users}
                totalProjects={total_projects}
                totalSubmissions={submissions.total_submissions}
                id={id}
                showContentLoader={teamDashboardLoader}
                activeTab={activeTab}
                closeModal={closeModal}
                openModal={openModal}
              />
              <div className="row">
                <div className="col-lg-8">
                  <div className="card map">
                    <div className="card-header main-card-header sub-card-header">
                      {/* <h5>Project maps</h5>*/}
                      <h5>
                        <FormattedMessage
                          id="app.project-maps"
                          defaultMessage="Project Maps"
                        />
                      </h5>
                      <div className="dash-btn">
                        <a
                          href={`/fieldsight/org-map/${teamId}/`}
                          className="fieldsight-btn left-icon"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="la la-map" />
                          <FormattedMessage
                            id="app.full-map"
                            defaultMessage="Full map"
                          />
                        </a>
                      </div>
                    </div>
                    <div className="card-body">
                      <SiteMap
                        map={map}
                        showContentLoader={teamDashboardLoader}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card project-list">
                    <div className="card-header main-card-header sub-card-header">
                      {/* <h5>Projects</h5>*/}
                      <h5>
                        <FormattedMessage
                          id="app.projects"
                          defaultMessage="Projects"
                        />
                      </h5>
                      <div className="dash-btn">
                        {/* <form className="floating-form">
                          <div className="form-group mr-0">
                            <input
                              type="search"
                              className="form-control"
                              required
                            />
                            <label htmlFor="input">Search</label>
                            <i className="la la-search" />
                          </div>
                        </form> */}
                        <a
                          href={`/fieldsight/application/#/project-add/${teamId}/`}
                          className="fieldsight-btn"
                          // target="_blank"
                        >
                          <i className="la la-plus" />
                        </a>
                      </div>
                    </div>
                    <ProjectList projects={projects} />
                  </div>
                </div>
              </div>
              <DashboardCounter submissions={submissions} />
              <div className="about-section ">
                <div className="row">
                  <About contacts={contact} desc={public_desc} />
                  <div className="col-lg-4">
                    <div className="card admin">
                      <div className="card-header main-card-header sub-card-header">
                        <h5>
                          <FormattedMessage
                            id="app.admin"
                            defaultMessage="Admin"
                          />
                        </h5>
                        {/*<h5>Admin</h5>
                         <div className="dash-btn">
                          <form className="floating-form">
                            <div className="form-group mr-0">
                              <input
                                type="search"
                                className="form-control"
                                required
                              />
                              <label htmlFor="input">Search</label>
                              <i className="la la-search" />
                            </div>
                          </form>
                          <a href="#" className="fieldsight-btn">
                            <i className="la la-plus" />
                          </a>
                        </div> */}
                      </div>
                      <Admin
                        admin={admin}
                        showContentLoader={teamDashboardLoader}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ teamDashboard }) => ({
  teamDashboard,
});
TeamDashboard.propTypes = {
  match: PropTypes.objectOf.isRequired,
  postPackageSubscribe: PropTypes.func.isRequired,
  getTeamDashboard: PropTypes.func.isRequired,
  teamDashboard: PropTypes.objectOf.isRequired,
};
export default connect(mapStateToProps, {
  getTeamDashboard,
  postPackageSubscribe,
})(TeamDashboard);

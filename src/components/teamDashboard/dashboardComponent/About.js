import React, { PureComponent } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';

class About extends PureComponent {
  render() {
    const { contacts, desc } = this.props;

    return (
      <div className="col-lg-8">
        <div className="card ">
          <div className="about">
            <div className="card-header main-card-header sub-card-header">
              {/*<h5>About</h5>*/}
              <h5>
                <FormattedMessage
                  id="app.about"
                  defaultMessage="About"
                />
              </h5>
            </div>
            <div
              className="thumb-list mr-0 "
              style={{ position: 'relative', height: '327px' }}
            >
              <PerfectScrollbar>
                <div className="card-body about-body">
                  <div className="about-countent">
                    <p>{desc}</p>
                  </div>
                  <div className="contact">
                    <div className="card-header main-card-header sub-card-header">
                      <h5>Contact</h5>
                    </div>
                    <div className="card-body">
                      <ul>
                        <li>
                          <i className="la la-phone" />
                          {contacts.phone}
                        </li>
                        <li>
                          <i className="la la-envelope" />
                          {contacts.email}
                        </li>
                        {contacts.website && (
                          <li>
                            <i className="la la-external-link" />
                            {contacts.website}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
About.propTypes = {
  contacts: PropTypes.objectOf.isRequired,
  desc: PropTypes.string.isRequired,
};
export default About;

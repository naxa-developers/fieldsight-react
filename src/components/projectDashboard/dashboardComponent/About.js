import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';

class About extends React.PureComponent {
  render() {
    const { contacts, desc } = this.props;
    return (
      // <div className="card ">
      <div className="about">
        <div className="card-header main-card-header sub-card-header">
          {/*<h5>About</h5>*/}
          <h5>
            <FormattedMessage id="app.about" defaultMessage="About" />
          </h5>
        </div>
        <div
          className="thumb-list mr-0 "
          style={{ position: 'relative', height: '357px' }}
        >
          <PerfectScrollbar>
            <div className="card-body about-body">
              <div className="about-countent">
                <p>{desc}</p>
              </div>
              <div className="contact">
                <div className="card-header main-card-header sub-card-header">
                  <h5>
                    <FormattedMessage
                      id="app.contacts"
                      defaultMessage="Contacts"
                    />
                  </h5>
                </div>
                <div className="card-body">
                  <ul>
                    {contacts.phone && (
                      <li>
                        <i className="la la-phone" />
                        {contacts.phone}
                      </li>
                    )}
                    {contacts.email && (
                      <li>
                        <i className="la la-envelope" />
                        {contacts.email}
                      </li>
                    )}
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
      // </div>
    );
  }
}
export default About;

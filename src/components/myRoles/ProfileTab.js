import React, { PureComponent } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { AvatarContentLoader } from '../common/Loader';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-array-index-key  */

// let base_url = window.base_url
//   ? window.base_url
//   : 'https://fieldsight.naxa.com.np/';

class ProfileTab extends PureComponent {
  render() {
    const { dLoader, profile, profileId } = this.props;
    return (
      <div className="card-body">
        <div className="profile-content">
          {dLoader && (
            <AvatarContentLoader size="80" width="20%" number={1} />
          )}

          {!dLoader && (
            <div className="row">
              <div className="col-xl-4 col-lg-6">
                <figure>
                  <img src={profile.profile_picture} alt="profile" />
                </figure>
                <div className="user-info">
                  <h4>{profile.fullname}</h4>
                  <span>{profile.username}</span>
                  <a href={`mailto:${profile.email}`}>
                    <p>{profile.email}</p>
                  </a>
                  <div className="profile-social-icon">
                    {profile.skype && (
                      <a href="#" className="skype">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>{profile.skype}</Tooltip>}
                        >
                          <i className="la la-skype" />
                        </OverlayTrigger>
                      </a>
                    )}

                    {profile.whatsapp && (
                      <a href="#" className="whatsapp">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{profile.whatsapp}</Tooltip>
                          }
                        >
                          <i className="la la-whatsapp" />
                        </OverlayTrigger>
                      </a>
                    )}

                    {profile.twitter && (
                      <a href="#" className="twitter">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{profile.twitter}</Tooltip>
                          }
                        >
                          <i className="la la-twitter" />
                        </OverlayTrigger>
                      </a>
                    )}

                    {profile.google_talk && (
                      <a href="#" className="google">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{profile.google_talk}</Tooltip>
                          }
                        >
                          <i className="la la-google-plus" />
                        </OverlayTrigger>
                      </a>
                    )}
                  </div>
                  {!profileId && (
                    <a
                      href={`/users/profile-update/${profile.id}/`}
                      target="_self"
                      className="fieldsight-btn"
                    >
                      <FormattedMessage
                        id="app.edit-profile"
                        defaultMessage="Edit Profile"
                      />
                    </a>
                  )}
                </div>
              </div>
              <div className="col-xl-4 col-lg-6">
                <div className="profile-address">
                  <ul>
                    {profile.username ? (
                      <li>
                        <i className="la la-user" />
                        {profile.username}
                      </li>
                    ) : null}

                    {profile.address ? (
                      <li>
                        <i className="la la-map-marker" />
                        {profile.address}
                      </li>
                    ) : null}

                    {profile.phone ? (
                      <li>
                        <i className="la la-phone" />
                        {profile.phone}
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default ProfileTab;

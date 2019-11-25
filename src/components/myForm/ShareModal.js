import React, { Component } from 'react';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { DotLoader } from './Loader';
import { successToast } from './toastHandler';
/* eslint-disable react/prop-types  */
/* eslint-disable jsx-a11y/label-has-associated-control  */

const url = 'fv3/api/form/';

class ShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      dLoader: true,
      shareState: false,
    };
  }

  componentDidMount() {
    const { modalTypes } = this.props;

    axios
      .get(`${url}${modalTypes}/`)

      .then(res => {
        const modifiedUser = res.data.map(user => ({
          ...user,
          checkbox: false,
        }));

        this.setState({
          userList: modifiedUser,
        });

        if (res.status === 200) {
          this.setState({
            dLoader: false,
            shareState: true,
          });
        }
      })
      .catch(err => console.log('err', err));
  }

  checkboxHandler = (e, checkboxId) => {
    const { userList } = this.state;
    const newUserList = userList.map(user => ({
      ...user,
    }));
    const selectedUser = newUserList.find(
      user => user.id === +checkboxId,
    );

    selectedUser.checkbox = !selectedUser.checkbox;
    this.setState({
      userList: newUserList,
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { modalDatas, shareUrls, closePopup } = this.props;
    const { userList } = this.state;
    const checkedList = userList
      .map(user => (user.checkbox === true ? +user.id : null))
      .filter(Boolean);

    const id = modalDatas;
    const postUrl = shareUrls;

    axios
      .post(postUrl, { id_string: id, share_id: checkedList })
      .then(res => {
        if (res.status === 201) {
          closePopup();
          successToast('Form', 'shared');
        }
      })

      .catch(err => console.log('err', err));
  };

  render() {
    const { shareState, userList, dLoader } = this.state;
    const type = this.props.modalTypes;

    return (
      <div className="thumb-list userlist">
        {shareState && (
          <form onSubmit={this.onSubmit}>
            <ul style={{ position: 'relative', height: '355px' }}>
              <PerfectScrollbar>
                {userList.map(user => (
                  <li key={user.id}>
                    <figure>
                      <img
                        src={
                          type === 'users'
                            ? user.profile_picture
                            : user.logo
                        }
                        alt="user"
                      />
                    </figure>
                    <div className="content">
                      <h6>
                        {type === 'users'
                          ? user.first_name
                          : user.name}
                      </h6>
                      {type === 'users' ? (
                        <span>{user.email}</span>
                      ) : null}
                    </div>
                    <div className="form-group checkbox-btn">
                      <div className="custom-checkbox">
                        <div className="checkbox ">
                          <label>
                            <input
                              type="checkbox"
                              onChange={e => {
                                this.checkboxHandler(e, user.id);
                              }}
                              checked={user.checkbox}
                            />
                            <i className="helper" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </PerfectScrollbar>
            </ul>
            <div className="form-group mrt-30 pull-right">
              <button type="submit" className="fieldsight-btn">
                <FormattedMessage
                  id="app.share"
                  defaultMessage="Share"
                />
              </button>
            </div>
          </form>
        )}
        {dLoader && <DotLoader />}
      </div>
    );
  }
}

export default ShareModal;

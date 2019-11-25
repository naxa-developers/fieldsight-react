import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import SideBar from './SideBar';
import CommonPopup from './CommonPopup';
/* eslint-disable react/prop-types  */
/* eslint-disable react/no-unused-state  */

class MyFormMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popupModal: false,
      selectedModals: null,
      heading: null,
      modalDatas: null,
    };
  }

  OpenTabHandler = (e, url) => {
    window.open(url, '_blank');
  };

  closePopup = () => {
    this.setState({
      popupModal: false,
    });
  };

  commonPopupHandler = (
    e,
    selectedModal,
    modalData,
    modalHeading,
    modalType,
    shareUrl,
  ) => {
    this.setState({
      popupModal: true,
      heading: modalHeading,
      selectedModals: selectedModal,
      modalDatas: modalData,
      modalTypes: modalType,
      shareUrls: shareUrl,
    });
  };

  render() {
    const {
      props: { height },
      state: { heading, modalDatas, modalTypes, shareUrls },
    } = this;

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a>
                <FormattedMessage
                  id="app.forms"
                  defaultMessage="Forms"
                />
              </a>
            </li>
          </ol>
        </nav>
        <div className="row">
          <SideBar
            OpenTabHandler={this.OpenTabHandler}
            commonPopupHandler={this.commonPopupHandler}
            height={height}
          />
        </div>

        {this.state.popupModal && (
          <CommonPopup closePopup={this.closePopup} heading={heading}>
            <this.state.selectedModals
              previewUrl={modalDatas}
              modalTypes={modalTypes}
              modalDatas={modalDatas}
              shareUrls={shareUrls}
              closePopup={this.closePopup}
            />
          </CommonPopup>
        )}
      </>
    );
  }
}

export default MyFormMain;

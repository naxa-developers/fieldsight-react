import React, { Component, Fragment } from 'react';
import Table from './common/Table';
import Modal from './common/Modal';
import InputElement from './common/InputElement';
import RightContentCard from './common/RightContentCard';
import { FormattedMessage } from 'react-intl';

class SiteManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const {
      state: { showModal },
      toggleModal,
    } = this;
    return (
      <Fragment>
        <RightContentCard
          title="Site Manage"
          addButton
          toggleModal={toggleModal}
        >
          <Table page="siteManage" />
        </RightContentCard>
        {showModal && (
          <Modal title="Add site" toggleModal={toggleModal}>
            <form
              className="floating-form"
              onSubmit={onSubmitHandler}
            >
              <InputElement
                tag="input"
                type="text"
                required={true}
                label="app.id"
                formType="floatingForm"
                htmlFor="input"
                translation={true}
              />
              <InputElement
                tag="input"
                type="text"
                required={true}
                label="app.sites"
                formType="floatingForm"
                htmlFor="input"
                translation={true}
              />
              <InputElement
                tag="input"
                type="text"
                required={true}
                label="app.address"
                formType="floatingForm"
                htmlFor="input"
                translation={true}
              />
              <InputElement
                tag="input"
                type="text"
                required={true}
                label="app.regions"
                formType="floatingForm"
                htmlFor="input"
                translation={true}
              />
              <InputElement
                tag="input"
                type="text"
                required={true}
                label="app.status"
                formType="floatingForm"
                htmlFor="input"
                translation={true}
              />
              <div className="form-group pull-right no-margin">
                <button type="submit" className="fieldsight-btn">
                  <FormattedMessage
                    id="app.save"
                    defaultMessage="Save"
                  />
                </button>
              </div>
            </form>
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default SiteManage;

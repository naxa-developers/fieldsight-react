import React, { Component } from 'react';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import WithContext from '../../hoc/WithContext';
import Modal from '../common/Modal';
import Table from '../common/Table';
import InputElement from '../common/InputElement';
import RightContentCard from '../common/RightContentCard';
import Loader from '../common/Loader';
import isEmpty from '../../utils/isEmpty';
/* eslint-disable react/prop-types  */

const url = 'fv3/api/project-regions/';

class SubRegion extends Component {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    const {
      match: {
        params: { subRegionId },
      },
      value: { setSubRegion, projectId },
    } = this.props;
    if (subRegionId) {
      axios
        .get(`${url}?project=${projectId}&region=${subRegionId}`)
        .then(res => {
          this._isMounted && setSubRegion(res.data, subRegionId);
        })
        .catch(err => console.log('Err', err));
    }
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { subRegionId },
      },
      value: { setSubRegion, projectId },
    } = this.props;
    if (prevProps.match.params.subRegionId !== subRegionId) {
      axios
        .get(`${url}?project=${projectId}&region=${subRegionId}`)
        .then(res => {
          this._isMounted && setSubRegion(res.data, subRegionId);
        })
        .catch(err => console.log('Err', err));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.setSubRegion && this.props.setSubRegion([], '');
  }

  render() {
    const {
      props: {
        value: {
          terms,
          isLoading,
          selectedIdentifier,
          selectedName,
          showModal,
          showDeleteConfirmation,
          subRegion,
          toggleModal,
          onChangeHandler,
          editHandler,
          removeHandler,
          confirmHandler,
          cancelHandler,
          onSubmitHandler,
        },
      },
    } = this;

    const tableHeader = {
      manageRegions: !isEmpty(terms)
        ? [
            `${terms.region} ID`,
            `${terms.region} Name`,
            ,
            'app.created-date',
            'app.action',
          ]
        : [
            'app.regionId',
            'app.regionName',
            'app.created-date',
            'app.action',
          ],
    };
    const message = !isEmpty(terms) ? (
      `${terms.region}`
    ) : (
      <FormattedMessage id="app.regions" defaultMessage="Regions" />
    );
    return (
      <>
        <RightContentCard
          title={!isEmpty(terms) ? `${terms.region}` : 'Regions'}
          addButton
          toggleModal={toggleModal}
        >
          <Table
            page="manageRegion"
            tableHeader={tableHeader.manageRegions}
            tableRow={subRegion}
            removeHandler={removeHandler}
            editHandler={editHandler}
          />
        </RightContentCard>

        {showModal && (
          <Modal
            title={!isEmpty(terms) ? `${terms.region}` : 'Regions'}
            toggleModal={toggleModal}
          >
            <form
              className="floating-form"
              onSubmit={onSubmitHandler}
            >
              <InputElement
                tag="input"
                type="text"
                required
                label="app.id"
                formType="floatingForm"
                htmlFor="input"
                name="selectedIdentifier"
                value={selectedIdentifier}
                changeHandler={onChangeHandler}
                translation
              />
              <InputElement
                tag="textarea"
                type="text"
                required
                label="app.name"
                formType="floatingForm"
                htmlFor="textarea"
                name="selectedName"
                value={selectedName}
                changeHandler={onChangeHandler}
                translation
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
        {isLoading && <Loader />}

        {showDeleteConfirmation && (
          <DeleteModel
            onCancel={cancelHandler}
            onConfirm={confirmHandler}
            onToggle={cancelHandler}
            message={`Are you sure you want to delete ${message}?`}
            title="Warning"
          />
        )}
      </>
    );
  }
}

export default WithContext(SubRegion);

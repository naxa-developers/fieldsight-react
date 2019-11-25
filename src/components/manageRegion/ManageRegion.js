import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import 'react-toastify/dist/ReactToastify.css';
import Table from '../common/Table';
import Modal from '../common/Modal';
import InputElement from '../common/InputElement';
import RightContentCard from '../common/RightContentCard';
import Loader from '../common/Loader';
import WithContext from '../../hoc/WithContext';
import isEmpty from '../../utils/isEmpty';
import axios from 'axios';
import { RegionContext } from '../../context';

class ManageRegion extends Component {
  static contextType = RegionContext;
  constructor(props) {
    super(props);
    this.state = {
      hide: '',
      response: '',
      model: false,
      cluster_sites: '',
      data: false,
    };
  }
  componentDidMount() {
    const { projectId } = this.context;

    axios
      .get(`/fv3/api/enable-project-cluster-sites/${projectId}/`)
      .then(res => {
        this.setState({
          cluster_sites: !res.data.cluster_sites,
          hide: res.data.cluster_sites,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  region = () => {
    const {
      context: { projectId },
      state: { model, hide, cluster_sites },
    } = this;

    let data = {};
    data.cluster_sites = cluster_sites;
    data.Project = projectId;

    !model
      ? axios
          .post(
            `/fv3/api/enable-project-cluster-sites/${projectId}/`,
            data,
          )
          .then(res => {
            this.setState(
              {
                hide: !hide,
                response: res.data.detail,
                model: true,
                cluster_sites: res.data.cluster_sites,
                data: true,
              },
              () => this.toast(),
            );
          })
          .catch(err => {
            console.log(err);
          })
      : axios
          .post(
            `/fv3/api/enable-project-cluster-sites/${projectId}/`,
            data,
          )
          .then(res => {
            this.setState(
              {
                hide: !hide,
                response: res.data.detail,
                model: false,
                cluster_sites: res.data.cluster_sites,
                data: true,
              },
              () => this.toast(),
            );
          })
          .catch(err => {
            console.log(err);
          });
  };

  toast() {
    if (this.state.data) {
      toast.success(this.state.response);
    }
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
          region,
          toggleModal,
          onChangeHandler,
          editHandler,
          removeHandler,
          confirmHandler,
          cancelHandler,
          onSubmitHandler,
          selectRegionHandler,
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
          title={
            !isEmpty(terms) ? (
              `${terms.region}`
            ) : (
              <FormattedMessage
                id="app.regions"
                defaultMessage="Regions"
              />
            )
          }
          addButton
          toggleModal={toggleModal}
        >
          <div
            className="add-btn"
            style={{
              justifyContent: 'flex-end',
              position: 'relative',
              bottom: '52px',
              marginRight: '44px',
            }}
          >
            {this.state.hide ? (
              <button
                type="button"
                className="btn-toggle"
                onClick={this.region}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  textAlign: 'left',
                  width: '97px',
                }}
              >
                <FormattedMessage
                  id="app.turnOff"
                  defaultMessage="Turn OFF"
                />

                <div
                  className="handle"
                  style={{ left: 'auto', right: '0.1875rem' }}
                ></div>
              </button>
            ) : (
              <button
                type="button"
                className="btn-toggle"
                onClick={this.region}
                style={{
                  width: '97px',
                }}
              >
                <FormattedMessage
                  id="app.turnOn"
                  defaultMessage="Turn ON"
                />

                <div className="handle"></div>
              </button>
            )}
          </div>
          <Table
            page="manageRegion"
            tableHeader={tableHeader.manageRegions}
            tableRow={region}
            removeHandler={removeHandler}
            editHandler={editHandler}
            selectRegionHandler={selectRegionHandler}
          />
        </RightContentCard>

        {showModal && (
          <Modal
            title={
              !isEmpty(terms) ? (
                `${terms.region}`
              ) : (
                <FormattedMessage
                  id="app.regions"
                  defaultMessage="Regions"
                />
              )
            }
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

export default WithContext(ManageRegion);

import React, { Component } from 'react';
import axios from 'axios';
import InputElement from '../common/InputElement';
import RightContentCard from '../common/RightContentCard';
import Table from '../common/Table';
import Loader from '../common/Loader';
import { FormattedMessage } from 'react-intl';

import { successToast, errorToast } from '../../utils/toastHandler';
import { RegionContext } from '../../context';
import isEmpty from '../../utils/isEmpty';
/* eslint-disable camelcase */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable  consistent-return */

const tableHeader = {
  termsAndLabels: ['Terms And Labels', 'Changed To'],
};

const url = 'fv3/api/project-terms-labels/';

export default class TermAndLabel extends Component {
  constructor(props) {
    super(props);
    this.contextType = RegionContext;

    this.state = {
      termsAndLabels: {
        id: '',
        donor: '',
        site: '',
        site_supervisor: '',
        site_reviewer: '',
        region: '',
        region_supervisor: '',
        region_reviewer: '',
        project: window.project_id,
      },
      showList: true,
      isLoading: false,
    };
  }

  componentDidMount() {
    const { projectId, terms } = this.context;

    if (!isEmpty(terms)) {
      this.setState({
        termsAndLabels: { ...terms, project: projectId },
      });
    }
  }

  componentDidUpdate() {
    const {
      state: {
        termsAndLabels: { project, ...restLabels },
      },
      context: { projectId, terms },
    } = this;

    const isStateTermsEmpty =
      Object.values(restLabels).filter(Boolean).length === 0;

    if (isStateTermsEmpty && !isEmpty(terms)) {
      this.setState({
        termsAndLabels: { ...terms, project: projectId },
        // dotLoader: false
      });
    }
  }

  requestHandler = async () => {
    try {
      const {
        state: {
          termsAndLabels: {
            id,
            donor,
            site,
            site_supervisor,
            site_reviewer,
            region,
            region_supervisor,
            region_reviewer,
            project,
          },
        },
        context: { updateTerms },
      } = this;

      const termsAndLabels = {
        donor,
        site,
        site_supervisor,
        site_reviewer,
        region,
        region_supervisor,
        region_reviewer,
        project,
      };

      if (id) {
        await axios.put(`${url}${id}/`, termsAndLabels);
        await this.setState({
          isLoading: false,
          showList: true,
        });

        successToast('Terms and Labels', 'updated');
        return updateTerms(termsAndLabels);
      }

      await axios.post(`${url}?project=${project}`, termsAndLabels);
      await this.setState({
        isLoading: false,
        showList: true,
      });
      successToast('Terms and Labels', 'added');
      updateTerms(termsAndLabels);
    } catch (error) {
      await this.setState({
        isLoading: false,
      });
      errorToast();
    }
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true,
      },
      this.requestHandler,
    );
  };

  onChangeHandler = e => {
    const { name, value } = e.target;

    this.setState(state => ({
      termsAndLabels: {
        ...state.termsAndLabels,
        [name]: value,
      },
    }));
  };

  editHandler = () => {
    this.setState({
      showList: false,
    });
  };

  listHandler = () => {
    this.setState({
      showList: true,
    });
  };

  render() {
    const {
      state: {
        termsAndLabels: {
          donor,
          site,
          site_supervisor,
          site_reviewer,
          region,
          region_supervisor,
          region_reviewer,
        },
        showList,
        isLoading,
        // dotLoader
      },
      listHandler,
      editHandler,
      onChangeHandler,
      onSubmitHandler,
    } = this;

    const { id, project, ...restLabels } = this.state.termsAndLabels;

    return (
      <>
        <RightContentCard title="app.termsAndLabels">
          {/* {dotLoader && <DotLoader />} */}
          {!showList && (
            <>
              <form className="edit-form" onSubmit={onSubmitHandler}>
                <div className="row">
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="app.donor"
                      name="donor"
                      value={donor}
                      required={false}
                      changeHandler={onChangeHandler}
                      translation
                    />
                  </div>

                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="app.site"
                      name="site"
                      value={site}
                      required={false}
                      changeHandler={onChangeHandler}
                      translation
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="app.siteSupervisor"
                      name="site_supervisor"
                      value={site_supervisor}
                      required={false}
                      changeHandler={onChangeHandler}
                      translation
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="app.siteReviewer"
                      name="site_reviewer"
                      value={site_reviewer}
                      required={false}
                      changeHandler={onChangeHandler}
                      translation
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      label="app.region"
                      name="region"
                      value={region}
                      required={false}
                      changeHandler={onChangeHandler}
                      translation
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <div className="form-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="text"
                        label="app.regionSupervisor"
                        name="region_supervisor"
                        value={region_supervisor}
                        required={false}
                        changeHandler={onChangeHandler}
                        translation
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <div className="form-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="text"
                        label="app.regionReviewer"
                        name="region_reviewer"
                        value={region_reviewer}
                        required={false}
                        changeHandler={onChangeHandler}
                        translation
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="display-inline pull-right">
                    <button
                      type="button"
                      className="fieldsight-btn"
                      style={{
                        marginRight: '0.5rem',
                        background: '#ccc',
                        color: '#555',
                      }}
                      onClick={listHandler}
                    >
                      <FormattedMessage
                        id="app.seeList"
                        defaultMessage="See List"
                      />
                    </button>
                    <button
                      type="submit"
                      className="fieldsight-btn pull-right"
                    >
                      <FormattedMessage
                        id="app.save"
                        defaultMessage="Save"
                      />
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
          {showList && (
            <>
              <Table
                page="termsAndLabels"
                tableHeader={tableHeader.termsAndLabels}
                tableRow={Object.entries(restLabels)}
              />
              <button
                type="button"
                className="fieldsight-btn"
                onClick={editHandler}
              >
                <FormattedMessage
                  id="app.edit"
                  defaultMessage="Edit"
                />
              </button>
            </>
          )}
        </RightContentCard>
        {isLoading && <Loader />}
      </>
    );
  }
}

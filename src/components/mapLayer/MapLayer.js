import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import { DotLoader } from '../common/Loader';
import RightContentCard from '../common/RightContentCard';
import Loader from '../common/Loader';
import { errorToast, successToast } from '../../utils/toastHandler';
import { RegionContext } from '../../context';

const animatedComponents = makeAnimated();

const urls = ['fv3/api/geolayer/', 'fv3/api/organization-geolayer/'];

export default class MapLayer extends Component {
  static contextType = RegionContext;
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      geoLayer: [],
      initialData: [],
      dropdownData: [],
      multiValue: [],
      isLoading: false,
      dotLoader: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { projectId } = this.context;
    axios
      .all(urls.map(url => axios.get(`${url}?project=${projectId}`)))
      .then(
        axios.spread((initialData, dropdownData) => {
          if (this._isMounted) {
            const modifiedInitialData = initialData.data.map(
              item => ({
                ...item,
                value: item.id,
                label: item.title,
              }),
            );

            const modifiedDropdownData = dropdownData.data.map(
              item => ({
                ...item,
                value: item.id,
                label: item.title,
              }),
            );
            this.setState({
              initialData: modifiedInitialData,
              dropdownData: modifiedDropdownData,
              dotLoader: false,
            });
          }
        }),
      )
      .catch(err => {
        this._isMounted &&
          this.setState({
            dotLoader: false,
          });
      });
  }

  handleMultiChange = option => {
    this.setState(state => {
      return {
        multiValue: option,
      };
    });
  };

  requestHandler = () => {
    const { projectId } = this.context;
    const idArray = this.state.multiValue.map(item => item.id);
    axios
      .post(`${urls[0]}?project=${projectId}`, {
        project: projectId,
        geo_layers: idArray,
      })
      .then(res => {
        this.setState(
          {
            isLoading: false,
          },
          () => successToast('Map Layer', 'added'),
        );
      })
      .catch(err => {
        this.setState(
          {
            isLoading: false,
          },
          errorToast(),
        );
      });
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

  render() {
    const {
      state: { initialData, dropdownData, isLoading, dotLoader },
      onSubmitHandler,
      handleMultiChange,
    } = this;

    return (
      <>
        <RightContentCard title="Map Layer">
          {dotLoader && <DotLoader />}
          {!dotLoader && (
            <form onSubmit={onSubmitHandler}>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                onChange={handleMultiChange}
                defaultValue={initialData}
                isMulti
                options={dropdownData}
              />

              <div className="col-sm-12">
                <button
                  type="submit"
                  className="fieldsight-btn pull-right"
                  style={{ marginTop: '15px' }}
                >
                  <FormattedMessage
                    id="app.save"
                    defaultMessage="Save"
                  />
                </button>
              </div>
            </form>
          )}
        </RightContentCard>
        {isLoading && <Loader />}
      </>
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}

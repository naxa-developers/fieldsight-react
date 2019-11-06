import React, { Component, Fragment } from "react";
import axios from "axios";
import { successToast, errorToast } from "./utils/toastHandler";
import isEmpty from "./utils/isEmpty";

export const RegionContext = React.createContext();

const url = "fv3/api/project-regions/";
const urls = ["fv3/api/project-regions/", "fv3/api/project-terms-labels/"];

const INITIAL_STATE = {
  terms: {},
  region: [],
  subRegion: [],
  subRegionId: "",
  showModal: false,
  selectedIdentifier: "",
  selectedName: "",
  selectedId: "",
  isLoading: false,
  showDeleteConfirmation: false,
  projectId: window.project_id ? window.project_id : process.env.PROJECT_ID,

  organizationId: window.organization_id
    ? window.organization_id
    : process.env.ORG_ID
};

class RegionProvider extends Component {
  state = INITIAL_STATE;

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
      selectedIdentifier: "",
      selectedName: "",
      selectedId: ""
    }));
  };

  regionPostHandler = () => {
    const {
      selectedId,
      selectedIdentifier,
      selectedName,
      region,
      projectId,
      terms
    } = this.state;

    if (selectedId) {
      const newRegion = [...region];
      const selectedRegion = newRegion.find(
        region => region.id === +selectedId
      );
      selectedRegion.identifier = selectedIdentifier;
      selectedRegion.name = selectedName;

      return axios
        .put(`${url}${selectedId}/`, {
          identifier: selectedRegion.identifier,
          name: selectedRegion.name,
          project: selectedRegion.project
        })
        .then(res => {
          this.setState(
            {
              ...INITIAL_STATE,
              region: newRegion,
              subRegion: [...this.state.subRegion],
              terms: { ...this.state.terms }
            },
            () =>
              successToast(
                !isEmpty(terms) ? `${terms.region}` : "Region",
                "updated"
              )
          );
        })
        .catch(err => {
          this.setState(
            {
              isLoading: false,
              selectedId: ""
            },
            errorToast
          );
        });
    }

    const newRegion = {
      identifier: selectedIdentifier,
      name: selectedName,
      project: projectId
    };

    axios
      .post(`${url}?project=${projectId}`, newRegion)
      .then(res => {
        this.setState(
          {
            ...INITIAL_STATE,
            region: [...this.state.region, { ...res.data }],
            subRegion: [...this.state.subRegion],
            terms: { ...this.state.terms }
          },
          () =>
            successToast(
              !isEmpty(terms) ? `${terms.region}` : "Region",
              "added"
            )
        );
      })
      .catch(err => {
        this.setState(
          {
            isLoading: false
          },
          errorToast
        );
      });
  };

  subRegionPostHandler = () => {
    const {
      selectedId,
      selectedIdentifier,
      selectedName,
      subRegion,
      subRegionId,
      projectId,
      terms
    } = this.state;

    if (selectedId) {
      const newSubRegion = [...subRegion];
      const selectedSubRegion = newSubRegion.find(
        subRegion => subRegion.id === +selectedId
      );
      selectedSubRegion.identifier = selectedIdentifier;
      selectedSubRegion.name = selectedName;

      return axios
        .put(`${url}${selectedId}/`, {
          identifier: selectedSubRegion.identifier,
          name: selectedSubRegion.name,
          project: selectedSubRegion.project,
          parent: subRegionId
        })
        .then(res => {
          this.setState(
            {
              ...INITIAL_STATE,
              region: [...this.state.region],
              terms: { ...this.state.terms },
              subRegion: newSubRegion,
              subRegionId
            },
            () =>
              successToast(
                !isEmpty(terms) ? `Sub ${terms.region}` : "Sub Region",
                "updated"
              )
          );
        })
        .catch(err => {
          this.setState(
            {
              isLoading: false,
              selectedId: ""
            },
            errorToast
          );
        });
    }

    const newSubRegion = {
      identifier: selectedIdentifier,
      name: selectedName,
      project: projectId,
      parent: subRegionId
    };

    axios
      .post(`${url}?project=${projectId}`, newSubRegion)
      .then(res => {
        this.setState(
          {
            ...INITIAL_STATE,
            region: [...this.state.region],
            terms: { ...this.state.terms },
            subRegion: [...this.state.subRegion, { ...res.data }],
            subRegionId
          },
          () =>
            successToast(
              !isEmpty(terms) ? `Sub ${terms.region}` : "Sub Region",
              "added"
            )
        );
      })
      .catch(err => {
        this.setState(
          {
            isLoading: false
          },
          errorToast
        );
      });
  };

  requestHandler = () => {
    const { subRegionId } = this.state;

    if (subRegionId) {
      return this.subRegionPostHandler();
    }
    this.regionPostHandler();
  };

  onSubmitHandler = (e, edit) => {
    e.preventDefault();

    this.setState(
      {
        isLoading: true,
        showModal: false
      },
      this.requestHandler
    );
  };

  editHandler = id => {
    const { subRegionId } = this.state;
    if (subRegionId) {
      const selectedSubRegion = this.state.subRegion.find(
        subReg => subReg.id === +id
      );

      return this.setState({
        showModal: true,
        selectedId: id,
        selectedIdentifier: selectedSubRegion.identifier,
        selectedName: selectedSubRegion.name
      });
    }
    const selectedRegion = this.state.region.find(reg => reg.id === +id);
    this.setState({
      showModal: true,
      selectedId: id,
      selectedIdentifier: selectedRegion.identifier,
      selectedName: selectedRegion.name
    });
  };

  removeHandler = id => {
    this.setState({
      showDeleteConfirmation: true,
      selectedId: id
    });
  };

  confirmHandler = () => {
    this.setState(
      {
        showDeleteConfirmation: false,
        isLoading: true
      },
      this.confirmedRemoveHandler
    );
  };

  cancelHandler = () => {
    this.setState({
      showDeleteConfirmation: false,
      selectedId: ""
    });
  };

  confirmedRemoveHandler = () => {
    const { subRegionId, terms } = this.state;
    if (subRegionId) {
      const { selectedId, subRegion } = this.state;
      const filteredSubRegion = subRegion.filter(
        region => region.id !== +selectedId
      );

      return axios
        .delete(`${url}${selectedId}/`)
        .then(res => {
          this.setState(
            {
              ...INITIAL_STATE,
              region: [...this.state.region],
              terms: { ...this.state.terms },
              subRegion: filteredSubRegion,
              subRegionId
            },
            () =>
              successToast(
                !isEmpty(terms) ? `Sub ${terms.region}` : "Sub Region",
                "deleted"
              )
          );
        })
        .catch(err => {
          this.setState(
            {
              isLoading: false
            },
            errorToast
          );
        });
    }

    const { selectedId, region } = this.state;
    const filteredRegion = region.filter(region => region.id !== +selectedId);

    axios
      .delete(`${url}${selectedId}/`)
      .then(res => {
        this.setState(
          {
            ...INITIAL_STATE,
            terms: { ...this.state.terms },
            subRegion: [...this.state.subRegion],
            region: filteredRegion
          },
          () =>
            successToast(
              !isEmpty(terms) ? `${terms.region}` : "Region",
              "deleted"
            )
        );
      })
      .catch(err => {
        this.setState(
          {
            isLoading: false
          },
          errorToast
        );
      });
  };

  onChangeHandler = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  setSubRegion = (subRegion, subRegionId) => {
    this.setState({
      subRegion,
      subRegionId
    });
  };

  updateTerms = terms => {
    this.setState({
      terms
    });
  };

  componentDidMount() {
    const { projectId } = this.state;
    axios
      .all(urls.map(url => axios.get(`${url}?project=${projectId}`)))
      .then(
        axios.spread((region, terms) => {
          this.setState({
            region: region.data,
            terms: terms.data.length > 0 ? terms.data[0] : {}
          });
        })
      )
      .catch(err => console.log("err", err));
  }

  render() {
    const {
      toggleModal,
      onChangeHandler,
      editHandler,
      removeHandler,
      cancelHandler,
      confirmHandler,
      onSubmitHandler,
      setSubRegion,
      updateTerms,
      state
    } = this;

    return (
      <Fragment>
        <RegionContext.Provider
          value={{
            ...state,
            toggleModal,
            onChangeHandler,
            editHandler,
            removeHandler,
            cancelHandler,
            confirmHandler,
            onSubmitHandler,
            setSubRegion,
            updateTerms
          }}
        >
          {this.props.children}
        </RegionContext.Provider>
      </Fragment>
    );
  }
}

const RegionConsumer = RegionContext.Consumer;

export { RegionProvider, RegionConsumer };

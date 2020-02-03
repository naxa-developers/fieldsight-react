import React, { PureComponent } from 'react';
import FiltersTab from './FiltersTab';
import MetricsTab from './MetricsTab';
import LayersTab from './LayersTab';

class MainSidebarTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'filters',
      activeLayers: 'base_layers',
    };
  }

  handleTabChange = tab => {
    // console.log('handleTabCHange Clicked');
    this.setState({ activeTab: tab });
  };

  changeLayersTab = tab => {
    this.setState({ activeLayers: tab });
  };

  render() {
    const {
      props: {
        onClickClearBtn,
        projectsList,
        projectsRegionTypes,
        applyFilter,
        handleRegionChange,
        handleSiteChange,
        handleProgressChange,
        handleCheckbox,
        handleStatusChange,
        handleProjectChange,
        handleMetricsChange,
        handleBaseLayer,
        isProgressSelected,
        handleProgressParentCheckbox,
      },
      // match: {
      //   params: { id: siteId },
      // },

      state: { activeTab, activeLayers },
    } = this;
    return (
      <form className="map-widget mrt-15">
        <ul
          className="nav nav-tabs flex-between"
          id="filterTab"
          role="tablist"
        >
          <li className="nav-item">
            <a
              className={`nav-link ${
                activeTab === 'filters' ? 'active show' : ''
              }`}
              id="sidebar-filter_tab"
              data-toggle="tab"
              // href="#sidebar-filter"
              role="tab"
              tabIndex={0}
              aria-controls="sidebar-filter"
              // aria-selected={`${
              //   activeTab === 'fiters' ? 'true' : 'false'
              // }`}
              aria-selected="true"
              aria-hidden="true"
              onClick={() => {
                this.handleTabChange('filters');
              }}
            >
              Filters
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                activeTab === 'metrics' ? 'active show' : ''
              }`}
              id="sidebar-metric_tab"
              data-toggle="tab"
              // href="#sidebar-metric"
              role="tab"
              tabIndex={0}
              aria-controls="sidebar-metric"
              // aria-selected={`${
              //   activeTab === 'metrics' ? 'true' : 'false'
              // }`}
              aria-selected="true"
              aria-hidden="true"
              onClick={() => {
                this.handleTabChange('metrics');
              }}
            >
              metrics
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                activeTab === 'layers' ? 'active show' : ''
              }`}
              id="sidebar-layer_tab"
              data-toggle="tab"
              // href="#sidebar-layer"
              role="tab"
              tabIndex={0}
              aria-controls="sidebar-layer"
              // aria-selected={`${
              //   activeTab === 'layers' ? true : false
              // }`}
              aria-selected="true"
              aria-hidden="true"
              onClick={() => {
                this.handleTabChange('layers');
              }}
            >
              Layers
            </a>
          </li>
        </ul>
        <div className="tab-content" id="filterTabContent">
          <FiltersTab
            handleRegionChange={handleRegionChange}
            handleSiteChange={handleSiteChange}
            activeTab={activeTab}
            projectsList={projectsList}
            projectsRegionTypes={projectsRegionTypes}
            handleProgressChange={handleProgressChange}
            handleCheckbox={handleCheckbox}
            handleStatusChange={handleStatusChange}
            handleProjectChange={handleProjectChange}
            isProgressSelected={isProgressSelected}
            handleProgressParentCheckbox={
              handleProgressParentCheckbox
            }
          />
          <MetricsTab
            activeTab={activeTab}
            handleMetricsChange={handleMetricsChange}
            // colorBySelection={colorBySelection}
            // sizeBySelection={sizeBySelection}
          />
          <LayersTab
            // handleRegionChange={handleRegionChange}
            activeTab={activeTab}
            activeLayers={activeLayers}
            changeLayersTab={this.changeLayersTab}
            handleBaseLayer={handleBaseLayer}
          />
        </div>

        <div className="buttons flex-between">
          <button
            type="button"
            onClick={onClickClearBtn}
            // role="button"
            className="fieldsight-btn border-btn"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={applyFilter}
            // tabIndex={0}
            // role="button"
            className="fieldsight-btn bg-btn"
          >
            apply
          </button>
        </div>
      </form>
    );
  }
}

export default MainSidebarTab;

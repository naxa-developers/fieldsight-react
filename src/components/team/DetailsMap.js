import React, { createRef } from 'react';
import {
  Map as LeafletMap,
  TileLayer,
  LayersControl,
} from 'react-leaflet';
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css';
import L from 'leaflet';
import Axios from 'axios';
import { Button } from 'react-bootstrap';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Select from 'react-select';
import './teamCss.css';

require('leaflet.markercluster');
const giphy = require('../../static/images/giphy.gif');
const ring = require('../../static/images/ring.gif');

/* eslint-disable */

const { BaseLayer } = LayersControl;

class DetailsMap extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.newdata = [];
    this.progressColor = [
      '#FF0000',
      '#f66565',
      '#f4c08c',
      '#FFFF00',
      '#7FFF00',
      '#00FF00',
      '#069806',
    ];
    this.legendcount = 0;
    this.state = {
      Data: [],
      regions: null,
      sites: null,
      selectedRegion: [],
      selectedSites: [],
      markers: L.markerClusterGroup({ disableClusteringAtZoom: 12 }),
      loader: true,
      // secondloader: true,
    };
  }

  componentDidMount() {
    const map = this.mapRef.current.leafletElement;

    // add loader
    const loadinginfo = L.control({ position: 'topleft' });
    loadinginfo.onAdd = () => {
      const div1 = L.DomUtil.create('div', 'loadinginfo');
      div1.id = 'loadinginfoid';

      div1.innerHTML +=
        "<img src='../../static/images/loader1.gif'></img>";

      return div1;
    };

    // div1.innerHTML += "<h6>No. of Projects</h6>"
    loadinginfo.addTo(map);

    map.addLayer(this.state.markers);
    this.fetchigAPI(
      `fv3/api/map/sites/?project_id=${this.props.projectpk}`,
    );
    this.fetchregionNsites(
      `fv3/api/project-regions-types/${this.props.projectpk}/`,
    );
  }

  popUpClick = () => {
    this.props.popupCLick();
  };

  changeColor = (layer, type) => {
    if (type === 'Site Progress') {
      if (layer.current_progress === 0) {
        return this.progressColor[0];
      }
      if (
        layer.current_progress > 0 &&
        layer.current_progress <= 20
      ) {
        return this.progressColor[1];
      }
      if (
        layer.current_progress > 20 &&
        layer.current_progress <= 40
      ) {
        return this.progressColor[2];
      }
      if (
        layer.current_progress > 40 &&
        layer.current_progress <= 60
      ) {
        return this.progressColor[3];
      }
      if (
        layer.current_progress > 60 &&
        layer.current_progress <= 80
      ) {
        return this.progressColor[4];
      }
      if (
        layer.current_progress > 80 &&
        layer.current_progress <= 99
      ) {
        return this.progressColor[5];
      }
      if (layer.current_progress === 100) {
        return this.progressColor[6];
      }
    }
  };

  // `fv3/api/map/sites/?project_id=${this.props.projectpk}`
  fetchigAPI = url => {
    Axios.get(url).then(response => {
      const map = this.mapRef.current.leafletElement;

      response.data.results.map(e => {
        const popup =
          "<div class='popup'>" +
          '<strong><h5>' +
          e.name +
          '</h5></strong>' +
          '<h6> Region: ' +
          e.region +
          '</h6>' +
          '<h6>Site type: : ' +
          e.type +
          '</h6>' +
          "<button><a style='color:white' href='/fieldsight/application/#/site-dashboard/" +
          e.pk +
          "'/>Go to Site</button>" +
          '</div>';
        const mrk = L.circleMarker(e.latlng, {
          radius: 6,
          fillColor: this.changeColor(e, 'Site Progress'),
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        }).bindPopup(popup);
        mrk.addTo(this.state.markers);
        this.newdata.push(e);

        if (this.legendcount < 1) {
          const legend = L.control({ position: 'bottomleft' });

          legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');

            div.innerHTML +=
              '<i class="circle_legend"  style="background:' +
              this.progressColor[0] +
              '"></i> ' +
              '0%' +
              '<br>';
            div.innerHTML +=
              '<i class="circle_legend" style="background:' +
              this.progressColor[1] +
              '"></i> ' +
              '0-20%' +
              '<br>';
            div.innerHTML +=
              '<i class="circle_legend" style="background:' +
              this.progressColor[2] +
              '"></i> ' +
              '21-40%' +
              '<br>';
            div.innerHTML +=
              '<i class="circle_legend" style="background:' +
              this.progressColor[3] +
              '"></i> ' +
              '41-60%' +
              '<br>';
            div.innerHTML +=
              '<i class="circle_legend" style="background:' +
              this.progressColor[4] +
              '"></i> ' +
              '61-80%' +
              '<br>';
            div.innerHTML +=
              '<i class="circle_legend" style="background:' +
              this.progressColor[5] +
              '"></i> ' +
              '81-99%' +
              '<br>';
            div.innerHTML +=
              '<i class="circle_legend" style="background:' +
              this.progressColor[6] +
              '"></i> ' +
              '100%' +
              '<br>';

            return div;
          };

          legend.addTo(map);
        }
        this.legendcount += 1;
      });

      if (response.data.next) {
        this.fetchigAPI(response.data.next);
      } else {
        // const a = (document.getElementById(
        //   'loadinginfoid',
        // ).style.display = 'none');
      }
      map.fitBounds(this.state.markers.getBounds());
      this.setState({ loader: false });
    });
    this.setState({ Data: this.newdata });
  };

  fetchregionNsites = url => {
    Axios.get(url).then(response => {
      const newwregion = [];
      const newwsites = [];
      response.data.regions.map(e => {
        newwregion.push({ value: e.id, label: e.name });
      });
      response.data.site_types.map(e => {
        newwsites.push({ value: e.id, label: e.name });
      });
      this.setState({ regions: newwregion, sites: newwsites });
    });
  };

  handleChangeRegions = e => {
    this.state.selectedRegion = [];
    if (e !== null) {
      e.map(el => {
        this.state.selectedRegion.push(el.value);
      });
    }
  };

  handleChangeSites = e => {
    this.state.selectedSites = [];

    if (e !== null) {
      this.state.selectedSites = [];
      e.map(el => {
        this.state.selectedSites.push(el.value);
      });
    }
  };

  onApply = () => {
    const newData = this.state.Data.filter(e => {
      if (
        this.state.selectedRegion.length > 0 &&
        this.state.selectedSites.length > 0
      ) {
        return (
          this.state.selectedRegion.includes(e.region) ||
          this.state.selectedSites.includes(e.type)
        );
      }
      if (
        this.state.selectedRegion.length === 0 &&
        this.state.selectedSites.length > 0
      ) {
        return this.state.selectedSites.includes(e.type);
      }
      if (
        this.state.selectedRegion.length > 0 &&
        this.state.selectedSites.length === 0
      ) {
        return this.state.selectedRegion.includes(e.region);
      }
      if (
        this.state.selectedRegion.length === 0 &&
        this.state.selectedSites.length === 0
      ) {
        return true;
      }
    });

    // const map = this.mapRef.current.leafletElement;
    this.state.markers.eachLayer(l =>
      this.state.markers.removeLayer(l),
    );
    newData.map(e => {
      const options = {
        radius: 6,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
      const popup = `<div class='popup'><strong><h5>
       ${e.name} </h5></strong>
        <h6> Region: ${e.region}</h6>
        <h6>Site type: : ${e.type}</h6>'
        </div>`;

      const mrk = L.circleMarker(e.latlng, options).bindPopup(popup);
      mrk.addTo(this.state.markers);
      // map.fitBounds(this.state.layerGroup.getBounds())
    });
    // console.log(newData);
  };

  render() {
    const height = window.innerHeight - 63.547;

    return (
      <>
        {this.state.loader && (
          <div className="loader">
            <img src={ring} alt="loader" />
            {/* bsjs */}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#07224c',
            // display: 'none',
          }}
        >
          <Button
            onClick={() => this.props.popupCLick('projectmap', '')}
            style={{ marginRight: 20 }}
          >
            Back
          </Button>

          {this.state.regions !== null ? (
            <Select
              // value={this.state.selectedOption}
              onChange={this.handleChangeRegions}
              options={this.state.regions}
              placeholder="Regions"
              className="multiselect"
              onSelectResetsInput={false}
              isMulti
            />
          ) : (
            <img
              src={giphy}
              style={{ height: 30, width: 30 }}
              alt="loading..."
            />
          )}
          {this.state.sites !== null ? (
            <Select
              // value={this.state.selectedOption}
              onChange={this.handleChangeSites}
              options={this.state.sites}
              placeholder="Sites"
              className="multiselect"
              onSelectResetsInput={false}
              isMulti
            />
          ) : (
            <img
              src={giphy}
              style={{ height: 30, width: 30 }}
              alt="loading..."
            />
          )}
          <Button onClick={this.onApply}>Apply</Button>
        </div>

        <LeafletMap
          center={[27, 85]}
          zoom={2}
          maxZoom={15}
          attributionControl
          zoomControl
          doubleClickZoom
          scrollWheelZoom
          dragging
          animate
          easeLinearity={0.35}
          ref={this.mapRef}
          style={{ height, width: '100%' }}
        >
          <LayersControl position="topright">
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            <BaseLayer name="Google Streets">
              <TileLayer
                attribution='&amp;copy <a href="http://maps.google.com">Google Maps</a> contributors'
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
            </BaseLayer>
            <BaseLayer name="Google Hybrid">
              <TileLayer
                attribution='&amp;copy <a href="http://maps.google.com">Google Maps</a> contributors'
                url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
            </BaseLayer>
            <BaseLayer name="Google Satellite">
              <TileLayer
                attribution='&amp;copy <a href="http://maps.google.com">Google Maps</a> contributors'
                url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
            </BaseLayer>
            <BaseLayer name="Google Terrain">
              <TileLayer
                attribution='&amp;copy <a href="http://maps.google.com">Google Maps</a> contributors'
                url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
            </BaseLayer>
          </LayersControl>
        </LeafletMap>
      </>
    );
  }
}
export default DetailsMap;

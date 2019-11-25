import React, { Component, createRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, Card, Button } from 'react-bootstrap';
import format from 'date-fns/format';
import uuid from 'uuid/v4';
import {
  Map,
  TileLayer,
  Popup,
  GeoJSON,
  CircleMarker,
} from 'react-leaflet';
import L, { latLngBounds } from 'leaflet';
import Legend from './Legend';
import MarkerIcon from '../../static/images/marker.png';
/* eslint-disable react/prop-types  */
/* eslint-disable camelcase */
/* eslint-disable consistent-return  */
/* eslint-disable jsx-a11y/label-has-associated-control  */

function measure(lat1, lon1, lat2, lon2) {
  // generally used geo measurement function
  const R = 6378.137; // Radius of earth in KM
  const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  // return d; // kilometers
  return (d * 1000).toFixed(2); // meters
}

class Submission extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.groupRef = createRef();
    this.state = {
      showGallery: false,
      selectedImg: '',
    };
    // this.onEachFeaturePoint = this.onEachFeaturePoint.bind(this);
    // this.pointToLayer = this.pointToLayer.bind(this);
  }

  onEachFeaturePoint = (feature, layer) => {
    layer.bindPopup(`<b>Project Name: </b>
    ${feature.properties.project_name}`);
  };

  openModal = img => {
    this.setState({
      showGallery: true,
      selectedImg: img,
    });
  };

  closeModal = () => {
    this.setState({
      showGallery: false,
      selectedImg: '',
    });
  };

  getGeoJson = data => {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: data.id,
            identifier: data.identifier,
            logo: data.logo,
            project_name: data.project_name,
            name: data.name,
            site_information: data.site_information,
          },
          geometry: {
            type: 'Point',
            coordinates: [data.longitude, data.latitude],
          },
        },
      ],
    };
  };

  splitSubmissionObj = (submissionObj, name) => {
    const question = Object.values(submissionObj);
    const label =
      question.length > 0
        ? `${question[0]}/${question[1]}`.replace(/\/undefined/, '')
        : '';
    return this.getLabelAndName(label, name);
  };

  getSmallBound = latlng => {
    if (Object.entries(latlng).length > 0) {
      const { siteLat, siteLng, ansLat, ansLng } = latlng;
      const bounds = latLngBounds(
        [siteLat + 0.002, siteLng + 0.002],
        [ansLat - 0.002, ansLng - 0.002],
      );
      return bounds;
    }
  };

  getLargeBound = latlng => {
    if (Object.entries(latlng).length > 0) {
      const { siteLat, siteLng, ansLat, ansLng } = latlng;
      const bounds = latLngBounds();

      bounds.extend([siteLat, siteLng]);
      bounds.extend([ansLat && ansLat, ansLng && ansLng]);

      return bounds;
    }
  };

  getLabelAndName = (label, name) => (
    <span>
      {label}
      {name && <i>{`(${name})`}</i>}
    </span>
  );

  handleRepeatedSubmission = submission => {
    return (
      <Accordion key={uuid()} defaultActiveKey={submission.name}>
        <Card>
          <Card.Header>
            <h5>
              <Accordion.Toggle
                as={Button}
                variant="link"
                eventKey={submission.name}
              >
                {submission.label
                  ? typeof submission.label === 'object'
                    ? this.splitSubmissionObj(
                        submission.label,
                        submission.name,
                      )
                    : this.getLabelAndName(
                        submission.label,
                        submission.name,
                      )
                  : submission.name}
              </Accordion.Toggle>
            </h5>
          </Card.Header>
          <Accordion.Collapse eventKey={submission.name}>
            <Card.Body>
              {submission.elements &&
                submission.elements.map(sub => {
                  return sub.type === 'group' ||
                    sub.type === 'repeated'
                    ? this.handleRepeatedSubmission(sub)
                    : this.handleUnrepeatedSubmission(sub);
                })}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  };

  handleUnrepeatedSubmission = submission => {
    const { site } = this.props;
    const geoData = this.getGeoJson(site);

    if (submission.type === 'photo') {
      return (
        <div className="submission-list thumb-list" key={uuid()}>
          <ul>
            <li>
              <div className="content">
                <h6>
                  {typeof submission.question === 'object'
                    ? this.splitSubmissionObj(
                        submission.question,
                        submission.name,
                      )
                    : this.getLabelAndName(
                        submission.question,
                        submission.name,
                      )}
                </h6>
              </div>
              <figure>
                {submission.answer && (
                  <a
                    href="#"
                    onClick={() => {
                      this.openModal(submission.answer);
                    }}
                  >
                    <img
                      alt="submisstion-answer"
                      src={submission.answer}
                      style={{
                        backgroundImage: `url(${submission.answer})`,
                        cursor: 'pointer',
                      }}
                    />
                  </a>
                )}
              </figure>
            </li>
          </ul>
        </div>
      );
    }
    if (submission.type === 'geopoint') {
      let splitedGeoLocation = [];
      let latitude = '';
      let longitude = '';
      let altitude = '';
      let accuracy = '';
      let bounds = {};
      let latlngObj = {};

      if (!!submission.answer === true) {
        splitedGeoLocation = submission.answer.split(' ');
        const [lat, lng, alt, acc] = splitedGeoLocation;
        latitude = lat;
        longitude = lng;
        altitude = alt;
        accuracy = acc;

        latlngObj = {
          siteLat: site && site.latitude,
          siteLng: site && site.longitude,
          ansLat: JSON.parse(latitude),
          ansLng: JSON.parse(longitude),
        };
      }

      const question =
        typeof submission.question === 'object'
          ? this.splitSubmissionObj(
              submission.question,
              submission.name,
            )
          : this.getLabelAndName(
              submission.question,
              submission.name,
            );
      const distance = measure(
        site.latitude,
        site.longitude,
        latitude && latitude,
        longitude && longitude,
      );

      if (distance < 500) {
        bounds = this.getSmallBound(latlngObj);
      } else {
        bounds = this.getLargeBound(latlngObj);
      }

      return (
        <div className="submission-list normal-list" key={uuid()}>
          <ul>
            <li>
              <h6>{question}</h6>
              <div className="submission-map">
                {submission.answer && (
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="map-form">
                        <Map
                          style={{
                            height: '258px',
                            marginTop: '1rem',
                          }}
                          center={[latitude, longitude]}
                          zoom={15}
                          maxZoom={19}
                          bounds={bounds}
                          ref={this.mapRef}
                          attributionControl
                          zoomControl
                          doubleClickZoom
                          scrollWheelZoom
                          dragging
                          animate
                          easeLinearity={0.35}
                        >
                          <TileLayer
                            // attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <GeoJSON
                            data={geoData}
                            onEachFeature={this.onEachFeaturePoint}
                            pointToLayer={this.pointToLayer}
                            ref={this.groupRef}
                          />
                          <Legend />
                          <CircleMarker
                            center={[latitude, longitude]}
                            radius={8}
                          >
                            <Popup>
                              <b>
                                <FormattedMessage
                                  id="app.question"
                                  defaultMessage="Question"
                                />
                                :{' '}
                              </b>
                              {question}
                            </Popup>
                          </CircleMarker>
                        </Map>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="map-legend">
                        <p>
                          <span>
                            <FormattedMessage
                              id="app.latitude"
                              defaultMessage="Latitude"
                            />
                            :
                          </span>
                          <label>{latitude}</label>
                        </p>
                        <p>
                          <span>
                            <FormattedMessage
                              id="app.longitude"
                              defaultMessage="Longitude"
                            />
                            :
                          </span>
                          <label>{longitude}</label>
                        </p>
                        <p>
                          <span>
                            <FormattedMessage
                              id="app.altitude"
                              defaultMessage="Altitude"
                            />
                            :
                          </span>
                          <label>{altitude} meters</label>
                        </p>
                        <p>
                          <span>
                            <FormattedMessage
                              id="app.accuracy"
                              defaultMessage="Accuracy"
                            />
                            :
                          </span>
                          <label>
                            {(+accuracy).toFixed(2)} meters
                          </label>
                        </p>
                        <p>
                          <span>
                            {' '}
                            <FormattedMessage
                              id="app.distanceFromSite"
                              defaultMessage="Distance From Site"
                            />
                            :
                          </span>
                          <label>{distance} meters</label>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      );
    }
    if (
      submission.type !== 'photo' &&
      submission.type !== 'geopoint'
    ) {
      return (
        <div className="submission-list normal-list" key={uuid()}>
          <ul>
            <li>
              <h6>
                {typeof submission.question === 'object'
                  ? this.splitSubmissionObj(
                      submission.question,
                      submission.name,
                    )
                  : this.getLabelAndName(
                      submission.question,
                      submission.name,
                    )}
              </h6>
              {submission.type === 'start' ||
              submission.type === 'end' ||
              submission.type === 'datetime' ? (
                <time>
                  <i className="la la-clock-o" />
                  {format(submission.answer, [
                    'MMMM Do YYYY,  h:mm:ss a',
                  ])}
                </time>
              ) : submission.type === 'select one' ? (
                this.splitSubmissionObj(
                  submission.selected['one-one'].label,
                  submission.selected['one-one'].name,
                )
              ) : submission.type === 'select all that apply' ? (
                Object.entries(submission.selected).map(many => (
                  <p key={uuid()}>
                    {this.splitSubmissionObj(
                      many[1].label,
                      many[1].name,
                    )}
                  </p>
                ))
              ) : (
                <p>{submission.answer}</p>
              )}
            </li>
          </ul>
        </div>
      );
    }
  };

  pointToLayer = (feature, latlng) => {
    const icon = new L.Icon({
      iconUrl: MarkerIcon,
      iconRetinaUrl: MarkerIcon,
      iconSize: [28, 28],
      iconAnchor: [13, 27],
      popupAnchor: [2, -24],
      shadowUrl: null,
      shadowSize: null,
      shadowAnchor: null,
    });
    return L.marker(latlng, { icon });
  };

  renderSubmission = submissionData => {
    return submissionData.map(submission => {
      if (
        submission.type === 'group' ||
        submission.type === 'repeat'
      ) {
        return this.handleRepeatedSubmission(submission);
      }
      // else {
      return this.handleUnrepeatedSubmission(submission);
      // }
    });
  };

  render() {
    const {
      props: {
        dateCreated,
        submittedBy,
        submissionData,
        formName,
        is_survey,
      },
      state: { showGallery, selectedImg },
    } = this;

    return (
      <>
        <div
          className={`${
            !is_survey
              ? 'group-submission mrt-30'
              : 'group-submission'
          }`}
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header main-card-header sticky-top">
                  <div className="head-right">
                    <h5>{formName}</h5>

                    {submittedBy && (
                      <div className="submitted-header">
                        <div className="submit-by">
                          <label>by :</label>
                          {submittedBy}
                        </div>
                        <time>
                          <label>on:</label>
                          {format(dateCreated, 'MM-DD-YYYY')}
                        </time>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-body submission-card">
                  {submissionData &&
                    this.renderSubmission(submissionData)}
                  {showGallery && (
                    <div
                      role="button"
                      onKeyDown={this.handleKeyDown}
                      tabIndex="0"
                      className="gallery-zoom fieldsight-popup open"
                      style={{ zIndex: 99999 }}
                      onClick={() => {
                        this.closeModal();
                      }}
                    >
                      <div className="gallery-body">
                        <img
                          src={selectedImg}
                          alt="logo"
                          style={{
                            minHeight: '400px',
                            maxHeight: '400px',
                          }}
                        />
                      </div>
                      <span
                        role="button"
                        tabIndex="-1"
                        onKeyDown={this.handleKeyDown}
                        className="popup-close"
                        onClick={() => {
                          this.closeModal();
                        }}
                      >
                        <i className="la la-close" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Submission;

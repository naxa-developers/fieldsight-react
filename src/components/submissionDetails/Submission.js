import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import uuid from "uuid/v4";
import format from "date-fns/format";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { DotLoader } from "../common/Loader";
class Submission extends Component {
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
                {submission.label ? submission.label : submission.name}
              </Accordion.Toggle>
            </h5>
          </Card.Header>
          <Accordion.Collapse eventKey={submission.name}>
            <Card.Body>
              {submission.elements &&
                submission.elements.map(sub => {
                  return sub.type === "group" || sub.type === "repeated"
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
    if (submission.type === "photo") {
      console.log("photo", submission);
      return (
        <div className="submission-list thumb-list" key={uuid()}>
          <ul>
            <li>
              <div className="content">
                <h6>{submission.question}</h6>
              </div>
              <figure>
                <img
                  src={
                    submission.answer
                      ? submission.answer
                      : "https://images.freeimages.com/images/premium/previews/4335/43356756-road-construction-site.jpg"
                  }
                  alt="image"
                />
              </figure>
            </li>
          </ul>
        </div>
      );
    } else if (submission.type === "geopoint") {
      const splitedGeoLocation = submission.answer.split(" ");
      const latitude = splitedGeoLocation[0];
      const longitude = splitedGeoLocation[1];
      const altitude = splitedGeoLocation[2];
      const accuracy = splitedGeoLocation[3];
      return (
        <div className="submission-list normal-list" key={uuid()}>
          <ul>
            <li>
              <h6>{submission.question}</h6>
              <div className="submission-map">
                <div className="row">
                  <div className="col-lg-4 col-md-4">
                    <div className="map-form">
                      <Map
                        style={{ height: "205px", marginTop: "1rem" }}
                        center={[latitude, longitude]}
                        zoom={13}
                      >
                        <TileLayer
                          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[latitude, longitude]}>
                          <Popup>
                            <b>Name: </b>
                            {name}
                          </Popup>
                        </Marker>
                      </Map>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="map-legend">
                      <p>
                        <span>Latitude:</span>
                        <label>{latitude}</label>
                      </p>
                      <p>
                        <span>Longitude:</span>
                        <label>{longitude}</label>
                      </p>
                      <p>
                        <span>Altitude:</span>
                        <label>{altitude}</label>
                      </p>
                      <p>
                        <span>Accuracy:</span>
                        <label>{accuracy}</label>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="submission-list normal-list" key={uuid()}>
          <ul>
            <li>
              <h6>{submission.question}</h6>
              {submission.type === "start" ||
              submission.type === "end" ||
              submission.type === "datetime" ? (
                <time>
                  <i className="la la-clock-o">
                    {format(submission.answer, ["MMMM Do YYYY,  h:mm:ss a"])}{" "}
                  </i>
                </time>
              ) : (
                <p>{submission.answer}</p>
              )}
            </li>
          </ul>
        </div>
      );
    }
  };

  renderSubmission = submissionData => {
    return submissionData.map((submission, i) => {
      if (submission.type === "group" || submission.type === "repeat") {
        return this.handleRepeatedSubmission(submission);
      } else {
        return this.handleUnrepeatedSubmission(submission);
      }
    });
  };

  render() {
    const { dateCreated, submittedBy, submissionData, dotLoader } = this.props;

    return (
      <div className="group-submission mrt-30">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header main-card-header sticky-top">
                <div className="head-right">
                  <h5>household survey</h5>

                  {submittedBy && (
                    <div className="submitted-header">
                      <div className="submit-by">
                        <label>by :</label> {submittedBy}
                      </div>
                      <time>
                        <label>on:</label> {format(dateCreated, "MM-DD-YYYY")}
                      </time>
                    </div>
                  )}
                </div>
              </div>
              {!dotLoader && (
                <div className="card-body submission-card">
                  {submissionData && this.renderSubmission(submissionData)}
                </div>
              )}
              {dotLoader && <DotLoader />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Submission;

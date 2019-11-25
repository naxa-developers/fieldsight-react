import React from 'react';
import { Fade } from 'react-reveal';
import ReactLoader from 'react-loader-spinner';
import { FormattedMessage } from 'react-intl';

export const DotLoader = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '500px',
    }}
  >
    <ReactLoader
      type="ThreeDots"
      color="#00628E"
      height="50"
      width="50"
    />
  </div>
);

export default () => (
  <Fade>
    <div className="fieldsight-popup open">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
        }}
      >
        <ReactLoader
          type="Ball-Triangle"
          color="#00628E"
          height="50"
          width="50"
        />

        <h6 style={{ color: '#00628E', marginTop: '20px' }}>
          <FormattedMessage
            id="app.loadingPleaseWait!"
            defaultMessage="Loading... Please wait!"
          />
        </h6>
      </div>
    </div>
  </Fade>
);

import React, { Component } from 'react';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';

class GlobalModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      globalUrl: ' ',
      disable: true,
    };
  }

  globalshare = e => {
    const id = this.props.modalDatas;
    const url = this.props.shareUrls;
  };

  onSubmit = e => {
    const id = this.props.modalDatas;
    const url = this.props.shareUrls;

    axios
      .post(url, { id_string: id })
      .then(res => {
        if (res.status === 201) {
          this.setState({
            globalUrl: res.data.share_link,
            disable: false,
          });
        }
      })
      .catch(err => console.log('err', err));
  };

  copyHandler = () => {
    this.input.select();
    document.execCommand('copy');
  };

  render() {
    const { globalUrl, disable } = this.state;
    return (
      <div className="thumb-list globallist">
        <form onSubmit={this.onSubmit}>
          <div className="input-group copyurl">
            <input
              type="text"
              className="form-control"
              ref={el => (this.input = el)}
              placeholder="url"
              value={globalUrl}
              onChange={() => {}}
            />

            <div className="input-group-append">
              <button
                onClick={this.copyHandler}
                className="input-group-text"
                id="url"
                title="copy"
                disabled={disable}
              >
                <FormattedMessage
                  id="app.copy"
                  defaultMessage="Copy"
                />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="fieldsight-btn mrt-30 pull-right"
          >
            <FormattedMessage id="app.share" defaultMessage="Share" />
          </button>
        </form>
      </div>
    );
  }
}

export default GlobalModal;

import axios from "axios";

let csrfVal = window.csrf ? window.csrf : process.env.CSRF;
let tokenVal = window.token ? window.token : process.env.TOKEN;

let baseURL = window.base_url
  ? window.base_url
  : "https://fieldsight.naxa.com.np/";

const setDefault = () => {
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers.common["X-CSRFTOKEN"] = csrfVal;
  axios.defaults.headers.common["Authorization"] = tokenVal;
};

export default setDefault;

import axios from 'axios';
import {
  GET_METRICS_DATA,
  REPORT_LOADER,
  GET_FORM,
  GET_FORM_QUESTIONS,
} from './types';
/* eslint-disable */

export const getMetricsData = projectId => dispatch => {
  dispatch({ type: REPORT_LOADER });
  axios
    .get(`v4/api/reporting/metrics-data/${projectId}/`)
    .then(res => {
      dispatch({ type: GET_METRICS_DATA, payload: res.data });
    })
    .catch(() => {});
};

export const getForms = (projectId, type) => dispatch => {
  dispatch({ type: REPORT_LOADER });
  axios
    .get(
      `v4/api/reporting/project-form-data/${projectId}/?form_type=${type}`,
    )
    .then(res => {
      dispatch({ type: GET_FORM, payload: res.data });
    })
    .catch(() => {});
};

export const getFormQuestions = (projectId, id) => dispatch => {
  dispatch({ type: REPORT_LOADER });
  axios
    .get(`fieldsight/api/project/forms/${projectId}/?id=${id}`)
    .then(res => {
      dispatch({ type: GET_FORM_QUESTIONS, payload: res.data });
    })
    .catch(() => {});
};
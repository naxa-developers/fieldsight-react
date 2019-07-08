import axios from "axios";
import { GET_SUBMISSION_DETAIL } from "./types";

export const getSubmissionDetail = id => dispatch => {
  axios
    .get(`fv3/api/submission/${id}/`)
    .then(res => {
      dispatch({
        type: GET_SUBMISSION_DETAIL,
        payload: res.data
      });
    })
    .catch(err => console.log("err", err));
};
import { GET_TRANSLATION } from "./types";

export const getTranslate = dispatch => {
  dispatch({
    type: GET_TRANSLATION,
    payload: res.data
  });
};

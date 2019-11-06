import { GET_TRANSLATION } from "../actions/types";

const initialState = {
  selected: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSLATION:
      return {
        selected: action.payload
      };
    default:
      return state;
  }
}

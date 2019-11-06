import { GET_TEAMS, GET_TRANSLATION } from "../actions/types";

const initialState = {
  teams: [],
  count: "",
  selected: "en"
};

export default function(state = initialState, action) {
  // console.log(action);

  switch (action.type) {
    case GET_TEAMS:
      return {
        teams: [...action.payload.results],
        count: action.payload.count
      };
    case GET_TRANSLATION:
      return {
        selected: action.payload
      };

    default:
      return state;
  }
}

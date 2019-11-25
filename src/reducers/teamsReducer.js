import { GET_TEAMS, GET_TRANSLATION } from '../actions/types';
/* eslint-disable camelcase */

const initialState = {
  teams: [],
  count: '',
  selected:
    localStorage.getItem('selected') &&
    localStorage.getItem('selected'),
};

export default function(state = initialState, action) {
  // console.log(action);

  switch (action.type) {
    case GET_TEAMS:
      return {
        teams: [...action.payload.results],
        count: action.payload.count,
        selected: 'en',
      };
    case GET_TRANSLATION:
      return {
        selected: action.payload,
        teams: state.teams,
        count: state.count,
      };

    default:
      return state;
  }
}

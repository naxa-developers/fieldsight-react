import { GET_SITE_VIEW } from "../actions/types";

const initialState = {
  generals_forms: [],
  deleted_forms: [],
  breadcrumbs: [],
  scheduled_forms: [],
  stage_forms: [],
  generals_loading: false,
  scheduled_loading: false,
  stage_forms_loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SITE_VIEW:
      return {
        generals_forms:
          action.payload.generals_forms && action.payload.generals_forms,
        scheduled_forms:
          action.payload.scheduled_forms && action.payload.scheduled_forms,
        stage_forms: action.payload.stage_forms && action.payload.stage_forms,
        breadcrumbs: action.payload.breadcrumbs,
        deleted_forms: action.payload.deleted_forms,
        generals_loading: action.payload.generals_forms && true,
        scheduled_loading: action.payload.scheduled_forms && true,
        stage_forms_loading: action.payload.stage_forms && true
      };
    default:
      return state;
  }
}

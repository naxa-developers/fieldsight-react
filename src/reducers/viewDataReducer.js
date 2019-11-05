import { GET_PROJECT_VIEW } from "../actions/types";

const initialState = {
  generals_forms: [],
  scheduled_forms: [],
  stage_forms: [],
  survey_forms: [],
  deleted_forms: [],
  breadcrumbs: [],
  generals_loader: false,
  scheduled_loader: false,
  stage_forms_loader: false,
  survey_forms_loader: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROJECT_VIEW:
      return {
        generals_forms:
          action.payload.generals_forms && action.payload.generals_forms,
        scheduled_forms:
          action.payload.scheduled_forms && action.payload.scheduled_forms,
        stage_forms: action.payload.stage_forms && action.payload.stage_forms,
        survey_forms:
          action.payload.survey_forms && action.payload.survey_forms,
        breadcrumbs: action.payload.breadcrumbs,
        deleted_forms: action.payload.deleted_forms,
        generals_loader: action.payload.generals_forms && true,
        scheduled_loader: action.payload.scheduled_forms && true,
        stage_forms_loader: action.payload.stage_forms && true,
        survey_forms_loader: action.payload.survey_forms && true
      };
    default:
      return state;
  }
}

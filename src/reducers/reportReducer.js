import {
  GET_METRICS_DATA,
  GET_FORM,
  GET_FORM_QUESTIONS,
  GET_REPORTS_LIST,
  APPLY_ACTION_TO_REPORT,
  GET_REPORT_DATA,
  GET_PROJECT_DETAILS,
} from '../actions/types';

const initialState = {
  reportTypes: [],
  metrics: [],
  metaAttributes: [],
  reportLoader: true,
  formTypes: [],
  forms: [],
  formQuestions: [],
  reportList: [],
  regions: [],
  siteTypes: [],
  userRoles: [],
  actionResponse: {},
  reportData: {},
  projectList: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_METRICS_DATA:
      return {
        ...state,
        reportTypes: action.payload.report_types,
        metrics: action.payload.metrics,
        metaAttributes: action.payload.meta_attributes,
        formTypes: action.payload.form_types,
        regions: action.payload.regions,
        siteTypes: action.payload.site_types,
        userRoles: action.payload.user_roles,
        reportLoader: false,
      };
    case GET_FORM:
      return {
        ...state,
        forms: action.payload,
        reportLoader: false,
      };
    case GET_FORM_QUESTIONS:
      return {
        ...state,
        formQuestions: action.payload,
        reportLoader: false,
      };
    case GET_REPORTS_LIST:
      return {
        ...state,
        reportList: action.payload,
        reportLoader: false,
      };
    case APPLY_ACTION_TO_REPORT:
      return {
        ...state,
        actionResponse: action.payload,
        reportLoader: false,
      };
    case GET_REPORT_DATA:
      return {
        ...state,
        reportData: action.payload,
        reportLoader: false,
      };
    case GET_PROJECT_DETAILS: {
      return {
        ...state,
        projectList: action.payload.project_managers,
      };
    }
    default:
      return state;
  }
}

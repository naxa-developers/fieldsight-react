import {
  GET_SUBMISSION_DETAIL,
  STOP_SUBMISSION_LOADER,
  START_SUBMISSION_LOADER,
  POST_SUBMISSION_DETAIL,
  UPDATE_SUBMISSION_DETAIL,
  TOGGLE_NULL_SUBMISSIONS_ANSWER,
  SHOW_SUBMISSION_ERR_MSG,
} from '../actions/types';

import copy from '../utils/cloneNestedObject';
/* eslint-disable camelcase */
/* eslint-disable  no-unused-vars */

/* eslint-disable no-param-reassign */

const initialState = {
  master_submission_data: [],

  submission_data: [],
  date_created: '',
  submitted_by: '',
  site: {},
  submission_history: [],
  status_data: {},
  form_type: {},
  form_name: '',
  fieldsight_instance: null,
  edit_url: null,
  download_url: {},
  loading: false,
  initialLoader: true,
  has_review_permission: false,
  hideNullValues: false,
  submission_err: null,
  breadcrumb: {},
  is_survey: false,
};

const getNullFilteredSubmission = submissions => {
  if (submissions.length === 0) return;
  const FilterNullAnswer = submission => {
    return submission.filter(sub => {
      if (sub.type === 'group' || sub.type === 'repeat') {
        sub.elements = FilterNullAnswer(sub.elements);
        if (sub.elements.length > 0) return true;
      }
      return sub.answer;
    });
  };

  // return new FilterNullAnswer(submissions);
};

const toggleNullSubmission = state => {
  if (state.hideNullValues) {
    return {
      ...state,
      submission_data: state.master_submission_data,
      hideNullValues: false,
    };
  }
  const cloneSubmission = copy(state.submission_data);
  const newSubmission = getNullFilteredSubmission(cloneSubmission);

  return {
    ...state,
    submission_data: newSubmission,
    hideNullValues: true,
  };
};

export default function(state = initialState, action) {
  switch (action.type) {
    // case SHOW_DOT_LOADER:
    //   return {
    //     ...state,
    //     dotLoader: true
    //   };
    case START_SUBMISSION_LOADER:
      return {
        ...state,
        loading: true,
        submission_err: null,
      };
    case STOP_SUBMISSION_LOADER:
      return {
        ...state,
        loading: false,
      };
    case GET_SUBMISSION_DETAIL:
      return {
        ...state,
        submission_data: [...action.payload.submission_data],
        master_submission_data: [...action.payload.submission_data],
        date_created: action.payload.date_created,
        submitted_by: action.payload.submitted_by,
        site: { ...action.payload.site },
        submission_history: [...action.payload.submission_history],
        status_data: { ...action.payload.status_data },
        form_type: { ...action.payload.form_type },
        form_name: action.payload.form_name,
        fieldsight_instance: action.payload.fieldsight_instance,
        edit_url: action.payload.edit_url,
        download_url: action.payload.download_url,
        has_review_permission: action.payload.has_review_permission,
        breadcrumb: action.payload.breadcrumbs,
        is_survey: action.payload.is_survey,
        // initialLoader: false
      };
    case POST_SUBMISSION_DETAIL:
      return {
        ...state,
        submission_history: [
          action.payload,
          ...state.submission_history,
        ],
        status_data: {
          ...state.status_data,
          status_display: action.payload.get_new_status_display,
        },
      };

    case TOGGLE_NULL_SUBMISSIONS_ANSWER:
      return toggleNullSubmission(state);

    case UPDATE_SUBMISSION_DETAIL: {
      return {
        ...state,
        submission_data: [...action.payload.submission_data],
        submitted_by: action.payload.submitted_by,
        edit_url: action.payload.edit_url,
        download_url: action.payload.download_url,
      };
    }

    case SHOW_SUBMISSION_ERR_MSG:
      return {
        submission_err: action.err,
      };
    default:
      return state;
  }
}

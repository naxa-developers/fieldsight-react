import {
  GET_SITE_DASHBOARD,
  GET_SITE_METAS,
  GET_SITE_SUBMISSIONS,
  GET_SITE_DOCUMENTS,
  GET_SITE_LOGS,
  GET_SITE_FORMS,
  GET_RECENT_PICTURES,
  GET_SUBSITES,
  SHOW_DOT_LOADER,
  SHOW_DASHBOARD_LOADERS,
  UPDATE_SITE_LOGO
  // SITE_DASHBOARD_ERR,
  // SITE_METAS_ERR,
  // SITE_SUBMISSIONS_ERR,
  // SITE_DOCUMENTS_ERR,
  // SITE_PICTURES_ERR,
  // SITE_LOGS_ERR
} from "../actions/types";

const initialState = {
  id: "",
  identifier: "",
  name: "",
  address: "",
  location: {},
  logo: "",
  public_desc: "",
  project_id: "",
  region: null,
  total_users: "",
  users: [],
  submissions: {},
  total_subsites: null,
  form_submissions_chart_data: {},
  site_progress_chart_data: {},
  siteMetas: {},
  siteSubmissions: [],
  siteDocuments: [],
  siteLogs: [],
  siteForms: {},
  subSites: [],
  recentPictures: [],
  breadcrumbs: {},
  has_write_permission: false,
  siteDashboardLoader: true,
  siteMetasLoader: true,
  siteSubmissionsLoader: true,
  siteDocumentsLoader: true,
  siteLogsLoader: true,
  sitePicturesLoader: true,
  subSitesLoader: true
  // siteDashboardErr: false,
  // siteMetasErr: false,
  // siteSubmissionsErr: false,
  // siteDocumentsErr: false,
  // siteLogsErr: false,
  // sitePicturesErr: false
};

const getRecentPictures = (state, action) => {
  const picturesKeyArr = Object.keys(action.payload);
  let modifiedPayload = [];
  if (picturesKeyArr.length > 0) {
    modifiedPayload = [
      action.payload.site_featured_images.photo,
      ...action.payload.recent_pictures
    ].filter(Boolean);
  }
  return {
    ...state,
    recentPictures: modifiedPayload,
    sitePicturesLoader: false
  };
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SITE_DASHBOARD:
      return {
        ...state,
        ...action.payload,

        site_progress_chart_data: {
          ...action.payload.site_progress_chart_data
        },
        siteDashboardLoader: false
      };
    // site meta/ information
    case GET_SITE_METAS:
      return {
        ...state,
        siteMetas: action.payload,
        siteMetasLoader: false
      };

    case GET_SITE_SUBMISSIONS:
      return {
        ...state,
        siteSubmissions: [...action.payload.results],
        siteSubmissionsLoader: false
      };
    case GET_SITE_DOCUMENTS:
      return {
        ...state,
        siteDocuments: [...action.payload.documents],
        siteDocumentsLoader: false
      };

    case GET_SITE_LOGS:
      return {
        ...state,
        siteLogs: [...action.payload],
        siteLogsLoader: false
      };

    case GET_SITE_FORMS:
      return {
        ...state,
        siteForms: { ...action.payload },
        showDotLoader: false
      };
    case GET_RECENT_PICTURES:
      return getRecentPictures(state, action);

    case GET_SUBSITES: {
      return {
        ...state,
        subSites: action.payload.results.data,
        subSitesLoader: false
      };
    }
    case SHOW_DOT_LOADER:
      return {
        ...state,
        showDotLoader: true
      };

    case SHOW_DASHBOARD_LOADERS:
      return {
        ...state,
        siteDashboardLoader: true,
        siteMetasLoader: true,
        siteSubmissionsLoader: true,
        siteDocumentsLoader: true,
        siteLogsLoader: true,
        sitePicturesLoader: true
      };

    case UPDATE_SITE_LOGO:
      return {
        ...state,
        logo: action.payload
      };

    // case SITE_DASHBOARD_ERR:
    //   return {
    //     ...state,
    //     siteDashboardErr: true
    //   };

    // case SITE_METAS_ERR:
    //   return {
    //     ...state,
    //     siteMetasErr: true
    //   };

    // case SITE_SUBMISSIONS_ERR:
    //   return {
    //     ...state,
    //     siteSubmissionsErr: true
    //   };

    // case SITE_LOGS_ERR:
    //   return {
    //     ...state,
    //     siteLogsErr: true
    //   };

    // case SITE_PICTURES_ERR:
    //   return {
    //     ...state,
    //     sitePicturesErr: true
    //   };

    // case SITE_DOCUMENTS_ERR:
    //   return {
    //     ...state,
    //     siteDocumentsErr: true
    //   };

    default:
      return state;
  }
}

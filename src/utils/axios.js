import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use((request) => {
  request.headers.app = 'Cult Creative App';
  return request;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  // chat: '/api/chat',
  // kanban: '/api/kanban',
  threads: {
    getAll: '/api/thread/threads',
    getById: (threadId) => `/api/thread/threads/${threadId}`,
    create: '/api/thread/createthread',
    addUser: '/api/thread/adduser',
    sendMessage: '/api/thread/send',
    getMessage: (threadId) => `/api/thread/getmessage/${threadId}`,
    archive: (threadId) => `/api/thread/threads/${threadId}/archive`,
    unarchive: (threadId) => `/api/thread/threads/${threadId}/unarchive`,
  },
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    registerCreator: '/api/auth/registerCreator',
    registerAdmin: '/api/auth/registerAdmin',
    verifyAdmin: '/api/auth/verifyAdmin',
    updateProfileAdmin: '/api/user/updateProfileAdmin',
    changePass: '/api/auth/changePassword',
    getCurrentUser: '/api/auth/currentUser',
    checkCreator: '/api/auth/checkCreator',
    updateCreator: '/api/auth/updateCreator',
    updateProfileCreator: '/api/auth/updateProfileCreator',
    verifyCreator: '/api/auth/verifyCreator',
    resendToken: '/api/auth/resendVerifyToken',
    checkTokenValidity: '/api/auth/checkTokenValidity',
  },
  creators: {
    getCreators: '/api/creator/getAll',
    getCreatorById: '/api/creator/getCreatorByID',
    deleteCreator: '/api/creator/delete',
    updateCreator: '/api/creator/update-creator',
    updateMediaKit: '/api/creator/update-media-kit',
    getCreatorFullInfo: (id) => `/api/creator/getCreatorFullInfoById/${id}`,
  },
  users: {
    newAdmin: '/api/user/newAdmin',
    admins: '/api/user/admins',
    updateProfileNewAdmin: '/api/user/updateProfile/newAdmin',
    createAdmin: '/api/user/createAdmin',
    getAdmins: '/api/user/getAdmins',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
    adminInvite: 'api/auth/adminEmail',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  admin: {
    delete: '/api/admin',
  },
  company: {
    create: '/api/company/createCompany',
    getAll: '/api/company/getCompanies',
    createBrand: '/api/company/createBrand',
    getBrands: '/api/company/getBrands',
    createOneCompany: '/api/company/createOneCompany',
    createOneBrand: '/api/company/createOneBrand',
    getCompany: '/api/company/getCompany',
    delete: '/api/company/deleteCompany',
    edit: '/api/company/editCompany',
    brandDetail: (id) => `/api/company/getBrand/${id}`,
    editBrand: '/api/company/editBrand',
    getOptions: '/api/company/getOptions',
  },
  event: {
    list: '/api/event/',
    create: '/api/event/createEvent',
    delete: '/api/event/deleteEvent',
    update: '/api/event/updateEvent',
  },
  campaign: {
    createCampaign: '/api/campaign/createCampaign',
    updateDefaultTimeline: '/api/campaign/updateDefaultTimeline',
    updateTimelineType: '/api/campaign/updateTimeLineType',
    getDefaultTimeline: '/api/campaign/defaultTimeline',
    getTimelineType: '/api/campaign/timelineType',
    getAllActiveCampaign: '/api/campaign/getAllActiveCampaign',
    getCampaignsByAdminId: '/api/campaign/getAllCampaignsByAdminID',
    getCampaignById: (id) => `/api/campaign/getCampaignById/${id}`,
    pitch: {
      root: '/api/campaign/pitch',
      approve: '/api/campaign/approvepitch',
      reject: '/api/campaign/rejectPitch',
      filter: '/api/campaign/filterPitch',
      detail: (id) => `/api/campaign/pitch/${id}`,
    },
    draft: {
      firstDraft: '/api/campaign/firstDraft',
    },
    changeStage: (id) => `/api/campaign/changeCampaignStage/${id}`,
    closeCampaign: (id) => `/api/campaign/closeCampaign/${id}`,
    editCampaignBrandOrCompany: '/api/campaign/editCampaignBrandOrCompany',
    updateCampaignTimeline: (id) => `/api/campaign/updateCampaignTimeline/${id}`,
  },
};

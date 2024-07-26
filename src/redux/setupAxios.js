import { actionTypes } from "../app/modules/Auth/_redux/authRedux";
import join from "url-join";

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;
const MDA_BACKEND_API = process.env.REACT_APP_MDA_BACKEND_API
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, data = null) => {
  failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(data);
      }
  });

  failedQueue = [];
};

export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    config => {
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      if ( !isAbsoluteURLRegex.test(config.url) ) {
        config.url = join(MDA_BACKEND_API, config.url);
      }

      return config;
    },
    err => Promise.reject(err)
  );

  axios.interceptors.response.use((response) => {
    return response
  }, function (error) {

    const originalRequest = error.config;

    if (error.message != "Network Error" && error.response === undefined) {
      Promise.reject(error);
      window.location = './error';
      return error
    }


    if (error.response.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
        })
            .then(data => {
              store.dispatch({type: actionTypes.Login, payload: { user: data } })
              return axios(originalRequest);
            })
            .catch(err => {
                return Promise.reject(err);
            });
      }      

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function(resolve, reject) {
          axios.post(`users/refresh-token`, {}, {withCredentials: true})
            .then(({ data }) => {
                store.dispatch({type: actionTypes.Login, payload: { user: data } })
                processQueue(null, data);
                resolve(axios(originalRequest));
            })
            .catch(err => {
                processQueue(err, null);
                store.dispatch({type: actionTypes.SetUser, payload: { user: null } })
                reject(err);
            })
            .then(() => {
                isRefreshing = false;
            });
      });   
    }
    return Promise.reject(error);
  });
}
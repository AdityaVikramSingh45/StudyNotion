import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Loaded dynamically per environment
  withCredentials: true,
});

export const apiConnector = (method, url, bodyData = null, headers = {}, params = {}) => {
  return axiosInstance({
    method,
    url,  // just the endpoint path, e.g. '/auth/login'
    data: bodyData,
    headers,
    params,
  });
};

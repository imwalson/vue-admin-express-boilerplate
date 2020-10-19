/**
 * Axios instance attached with interceptors for logging.
 */

const axios = require('axios');
const cfg = require('../config');
const { apiLogger, apiErrorLogger } = require('./logger');

const api = axios.create();

const BASE_URL = cfg.BASE_URL;

/**
 * Logs HTTP method and URL of the axios request.
 * Request headers body (POST) is not logged due to possible huge length as well as security concerns.
 */
api.interceptors.request.use(
  function(config) {
    const metadata = {
      method: config.method.toUpperCase(),
      url: BASE_URL + config.url,
    };
    // eslint-disable-next-line no-param-reassign
    config.url = BASE_URL + config.url;
    apiLogger.info({ config }, '[API Request]');
    apiLogger.info({ request: metadata }, '[API Request]');
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

/**
 * Logs HTTP method, URL, statusCode, statusMessage of the axios request.
 * Response body is not logged due to possible huge length as well as security concerns.
 */
api.interceptors.response.use(
  function(response) {
    const metadata = {
      url: response.config.url,
      method: response.config.method.toUpperCase(),
      status: response.status,
      statusText: response.statusText,
    };
    apiLogger.info({ response: metadata }, `[API Response]`);
    // return response.data;
    return response.headers['content-type'] === 'application/csv' ? response : response.data;
  },
  function(error) {
    const metadata = {
      url: error.config.url,
      method: error.config.method.toUpperCase(),
      status: error.status,
      statusText: error.statusText,
      err: error.message,
    };
    apiErrorLogger.error({ response: metadata }, '[API Error]');
    return Promise.reject(error);
  }
);

module.exports = api;

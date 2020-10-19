import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create();
service.defaults.timeout = 0;
service.defaults.headers.post['Content-Type'] = 'application/json';


// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code === 403) {
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        return;
      }
      if (response.data.code === 500) {
        Message({
          message: response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return response.status === 200 ? Promise.resolve(response) : Promise.reject(response);
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export function request(options) {
  return new Promise((resolve, reject) => {
    service(options)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        if (error.request) {
          reject(error.request);
        } else if (error.response) {
          reject(error.response.data);
        } else {
          reject(error.message);
        }
      });
  });
}

export default request

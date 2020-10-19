import { login } from '@/api/user'
import {
  getToken,
  setToken,
  getUsername,
  setUsername,
  getRoles,
  setRoles,
  clearCookies
} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: getUsername(),
    avatar: 'https://picsum.photos/200',
    roles: getRoles()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email_id: username.trim(), passwd: password }).then(res => {
        const data = res;
        if (data.status === 0) {
          if (data.data.status === 'success') {
            const { resourceKeys, role, token } = data.data;
            // fake avatar
            const avatar = 'https://picsum.photos/200';
            commit('SET_TOKEN', token);
            commit('SET_ROLES', role)
            commit('SET_NAME', username.trim());
            commit('SET_AVATAR', avatar);
            // save to cookies
            setToken(token);
            setRoles(role);
            setUsername(username.trim());
          } else if (data.data.status === 'fail') {
            Message({
              message: data.data.reason,
              type: 'error',
              duration: 5 * 1000
            })
            reject(data.data.reason);
          }
        } else {
          Message({
            message: data.msg,
            type: 'error',
            duration: 5 * 1000
          })
          reject(data.msg);
        }
        resolve();
      }).catch(error => {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
        reject(error);
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      clearCookies() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      clearCookies() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}


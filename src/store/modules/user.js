import { loginByEncryptedData, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    userId: '',
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
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
  },

  actions: {
    // 使用编码后的用户信息登录
    LoginByEncryptedData({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginByEncryptedData(data)
          .then(response => {
            if (!response.data) {
              reject('Login by encrypted data error!')
            }
            if (response.data.resultCode !== '200') {
              reject(response.data.resultMessage)
            }
            const loginRes = response.data
            commit('SET_TOKEN', loginRes.accessToken)
            commit('SET_USERID', loginRes.id)
            setToken(loginRes.accessToken)
            resolve()
          })
          .catch(e => {
            console.error(e)
            throw new Error('Login error.')
          })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            if (!response.data) {
              // 由于mockjs 不支持自定义状态码只能这样hack
              reject('error')
            }
            const data = response.data
            // 只要是管理员 那就直接写死roles 😄
            const isAdmin = data.name.includes('管理员')
            if (isAdmin) {
              commit('SET_ROLES', ['admin'])
            } else {
              reject('getInfo: roles must be a non-null array !')
            }

            commit('SET_NAME', data.name)
            // commit('SET_AVATAR', data.avatar)
            commit('SET_INTRODUCTION', '超级管理员')
            // 依旧写死 😄
            resolve({ roles: 'admin' })
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user

import { getUserListConsole, getlistConsoleRole } from '@/api/system'

const system = {
  state: {
    list: [],
    totalPage: 0,
    totalCount: 0
  },

  mutations: {
    SET_LIST: (state, list) => {
      state.list = list
    },
    SET_TOTAL_PAGE: (state, num) => {
      state.totalPage = num
    },
    SET_TOTAL_COUNT: (state, num) => {
      state.totalCount = num
    }
  },

  actions: {
    GetUserListConsole({ commit }, { pageIndex, pageSize, account, phone }) {
      return new Promise((resolve, reject) => {
        getUserListConsole(pageIndex, pageSize, account, phone)
          .then(response => {
            const data = response.data
            commit('SET_LIST', data.list)
            commit('SET_TOTAL_PAGE', data.totalPage)
            commit('SET_TOTAL_COUNT', data.totalCount)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetlistConsoleRole({ commit }, { pageIndex, pageSize, name }) {
      return new Promise((resolve, reject) => {
        getlistConsoleRole(pageIndex, pageSize, name)
          .then(response => {
            const data = response.data
            commit('SET_LIST', data.list)
            commit('SET_TOTAL_PAGE', data.totalPage)
            commit('SET_TOTAL_COUNT', data.totalCount)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default system

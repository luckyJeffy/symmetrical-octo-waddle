import { getProductInfo, searchProductInfo } from '@/api/product'

const user = {
  state: {
    list: [],
    totalPage: 0,
    totalCount: 0
    // details: {}
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
    // SET_DETAILS: (state, details) => {
    //   state.totalCount = details
    // }
  },

  actions: {
    GetProductInfo({ commit }, { pageIndex, pageSize }) {
      return new Promise((resolve, reject) => {
        getProductInfo(pageIndex, pageSize)
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
    SearchProductInfo({ commit }, value) {
      return new Promise((resolve, reject) => {
        searchProductInfo(value).then(response => {
          const data = response.data
          commit('SET_LIST', data.list)
          commit('SET_TOTAL_PAGE', data.totalPage)
          commit('SET_TOTAL_COUNT', data.totalCount)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    }
    // GetProductDetails({ commit }, id) {
    //   return new Promise((resolve, reject) => {
    //     getProductDetails(id).then(response => {
    //       const data = response.data
    //       commit('SET_DETAILS', data)
    //       resolve()
    //     }).catch(e => {
    //       reject(e)
    //     })
    //   })
    // }
  }
}

export default user

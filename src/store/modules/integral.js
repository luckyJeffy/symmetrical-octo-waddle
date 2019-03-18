import { getlistIntegralProduct } from '@/api/integral'

const integral = {
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
    GetlistIntegralProduct({ commit }, para) {
      return new Promise((resolve, reject) => {
        getlistIntegralProduct(para)
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

export default integral

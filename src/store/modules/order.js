import { getOrderList } from '@/api/order'

const order = {
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
    GetOrderList({ commit }, { pageIndex, pageSize }) {
      return new Promise((resolve, reject) => {
        getOrderList(pageIndex, pageSize)
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

export default order

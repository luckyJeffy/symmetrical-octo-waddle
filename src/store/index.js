import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import user from './modules/user'
import product from './modules/product'
import catalog from './modules/catalog'
import order from './modules/order'
import userList from './modules/userList'
import system from './modules/system'
import integral from './modules/integral'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    user,
    product,
    catalog,
    order,
    userList,
    system,
    integral
  },
  getters
})

export default store

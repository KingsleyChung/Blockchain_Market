import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  userInfo: null
}

const getters = {
  getStorage (state) {
    if (!state.userInfo) {
      state.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }
    return state.userInfo
  }
}

const mutations = {
  setStorage (state, value) {
    state.userInfo = value
    localStorage.setItem('userInfo', JSON.stringify(value))
  },
  removeStorage (state) {
    state.userInfo = null
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default store

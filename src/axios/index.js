import axios from 'axios'
import store from '../store'
import router from '../router'

axios.interceptors.request.use(config => {
  if (store.getters.getStorage) {
    config.headers.Authorization = store.getters.getStorage.token
  }
  return config
}, error => {
  console.log('api request error')
  Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 401 清除token信息并跳转到登录页面
        store.commit('removeStorage')
        // 只有在当前路由不是登录页面才跳转
        router.currentRoute.path !== 'login' &&
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.path }
          })
    }
  }
  console.log(JSON.stringify(error.response)) // console : Error: Request failed with status code 402
  // console.log(error)
  return Promise.reject(error)
})

export default axios

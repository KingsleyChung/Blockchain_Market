import Vue from 'vue'
import Router from 'vue-router'
import Market from '@/pages/Market'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Upload from '@/pages/Upload'
import GoodsDetail from '@/pages/GoodsDetail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Market',
      component: Market
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/detail/:goodsId',
      name: 'Detail',
      component: GoodsDetail
    }
  ]
})

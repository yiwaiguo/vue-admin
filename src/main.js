import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './icons/iconfont.css'
import 'font-awesome/css/font-awesome.css'
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './utils/filters' // global filters
import Fetch from './utils/fetch'
import './assets/plugins/jquery.min'
import './assets/plugins/ztree/jquery.ztree.all.min'
import Validator from './utils/validation'
import { hasPermission } from './utils/index'
import 'babel-polyfill';
require('es6-promise').polyfill();
import 'fetch-detector';
import 'fetch-ie8';

Vue.use(Validator)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// Vue.prototype.baseURL = 'http://192.168.1.60:8083'
Vue.prototype._fetch = Fetch
Vue.prototype.hasPermission = hasPermission

const token = window.localStorage.getItem("token");//这里取到的是缓存的，不是最新的状态
var adminEd = localStorage.getItem("adminEd")//这里取到的是缓存的，不是最新的状态
Vue.prototype._token = token
Vue.prototype._adminEd = adminEd

//生产环境获取配置文件地址
if(process.env.NODE_ENV === 'production' ){
  fetch('./serverconfig.json').then(res => {
    return res.json();
  }).then(res => {
    localStorage.setItem("baseURL", res.ApiUrl);
  })
  Vue.prototype.baseURL = localStorage.getItem('baseURL');
}else{//开发环境
  Vue.prototype.baseURL = process.env.BASE_API
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    // 登录超时
    Fetch.overtime = msg => {
      Cookies.remove('Admin-Token');//移除cookie的token,路由拦截器判断
      setTimeout(() => {
        this.$router.push({path:'/login'});
      },3000)
    };
  }
})

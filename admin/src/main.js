import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from '@/router/index'
import store from '@/store/index'

Vue.config.productionTip = false
Vue.mixin({
  methods: {
    token() {
      return localStorage.getItem('token')
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

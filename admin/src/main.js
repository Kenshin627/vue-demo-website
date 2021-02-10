import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from '@/router/index'
import store from '@/store/index'
import  '@/css/main.css'

// import { mapGetters } from 'vuex'
Vue.config.productionTip = false
Vue.mixin({
  computed: {
    
    dialogTitle() {
      return this.currentModel._id? '编辑' : '添加'
    },
    uploadHeader() {
      return {
        Authorization: this.$store.getters.token
      }
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

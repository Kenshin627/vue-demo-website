import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Categories from '@/views/Categories.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Home },
    { path: '/categories', component: Categories }
]

const router = new VueRouter({
    routes
})

export default router
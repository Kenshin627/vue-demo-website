import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Categories from '@/views/Categories.vue'
import Items from '@/views/Items.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Home },
    { path: '/categories', component: Categories },
    { path: '/items', component: Items }
]

const router = new VueRouter({
    routes
})

export default router
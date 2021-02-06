import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Categories from '@/views/Categories.vue'
import Items from '@/views/Items.vue'
import Heros from '@/views/Heros' 
import Articles from '@/views/Articles'
import Ads from '@/views/Ads'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Home },
    { path: '/categories', component: Categories },
    { path: '/items', component: Items },
    { path: '/heros', component: Heros },
    { path: '/articles', component: Articles },
    { path: '/ads', component: Ads } 
]

const router = new VueRouter({
    routes
})

export default router
import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/main.vue'
import Home from '@/views/Home.vue'
import Categories from '@/views/Categories.vue'
import Items from '@/views/Items.vue'
import Heros from '@/views/Heros' 
import Articles from '@/views/Articles'
import Ads from '@/views/Ads'
import Login from '@/views/Login'
import AdminUsers from '@/views/AdminUsers'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login', component: Login, meta: { isPublic: true }
    },
    { 
        path: '/', component: Main,
        children: [
            { path: '', component: Home },
            { path: '/categories', component: Categories },
            { path: '/items', component: Items },
            { path: '/heros', component: Heros },
            { path: '/articles', component: Articles },
            { path: '/ads', component: Ads },
            { path: '/adminUsers',component: AdminUsers }
        ]
    },
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if(!to.meta.isPublic && !localStorage.getItem('token')){
        Vue.prototype.$message({
            type: 'warning',
            message: '请先登录！'
        })
        next('/login')
    }
    next()
})

export default router
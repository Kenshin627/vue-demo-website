import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: null,
        user: null
    },
    getters: {
        token: state => {
            if(state.token === null) {
                state.token = localStorage.getItem('token') || ''
            }
            return state.token
        },
        user: state => {
            if(state.user === null) {
                state.user = JSON.parse(localStorage.getItem('user')) || ''
            }
            return state.user
        }
    },
    mutations: {
        login(state, payload) {
            localStorage.setItem('token',payload.token)
            localStorage.setItem('user',JSON.stringify(payload.user))
            state.token = payload.token
            state.user = payload.user
        },
        loginOut(state) {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            state.token = null
            state.user = null
        }
    }
})

export default store
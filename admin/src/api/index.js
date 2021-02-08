import axios from 'axios'
import Vue from 'vue'
import router from '../router/index'

const Axios = axios.create({
    baseURL: 'http://localhost:3001/api/admin'
})
Axios.interceptors.request.use(
    config => {
        console.log(config)
        if(config.url !== '/login'){
            config.headers.Authorization = `Bearer ${localStorage.getItem('token') || ''}`
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

Axios.interceptors.response.use( 
    res => {
        return res;
    },  
    err => {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        })
        if (err.response.status === 401) {
            router.push('/login')
        }
    }
)

export default Axios
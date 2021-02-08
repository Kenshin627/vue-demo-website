import axios from 'axios'
import Vue from 'vue'

const Axios = axios.create({
    baseURL: 'http://localhost:3001/api/admin'
})
Axios.interceptors.response.use( 
    res => {
        return res;
    },  
    err => {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.text
        })
    }
)

export default Axios
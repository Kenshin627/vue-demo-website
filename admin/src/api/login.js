import Axios from '@/api/index.js'

export function login(data) {
    return Axios({
        method: 'post',
        url: '/login',
        data
    })
}
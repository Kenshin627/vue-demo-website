import axios from 'axios'

const Axios = axios.create({
    baseURL: 'http://localhost:3001/api/admin'
})

export default Axios
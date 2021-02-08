import Axios from '@/api/index.js'

//create
export function create(data) {
    return Axios({
        url: '/adminUsers',
        method: 'post',
        data
    })
}
//edit
export function edit(data){
    return Axios({
        url: `/adminUsers`,
        method: 'put',
        data
    })
}
//delete
export function remove(id){
    return Axios({
        url: `/adminUsers/${ id }`,
        method: 'delete'
    })
}
//deleteMany
export function deleteMany(data) {
    return Axios({
        url: `/adminUsers/deleteMany`,
        method: 'post',
        data
    })
}
//list
export function list(query) {
    let base = `/adminUsers?num=${ query.currentPage }&size=${ query.size }`
    base += query.name? `&name=${query.name}` : ''
    return Axios({
        url: base,
        method: 'get'
    })
}
//getById
export function getById(id) {
    return Axios({
        url: `/adminUsers/${ id }`,
        method: 'get'
    })
}

export const upLoadUrl = `http://localhost:3001/api/admin/adminUsers/upload`

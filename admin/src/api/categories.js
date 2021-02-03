import Axios from '@/api/index.js'

//create
export function create(data) {
    return Axios({
        url: '/categories',
        method: 'post',
        data
    })
}
//edit
export function edit(data){
    return Axios({
        url: `/categories`,
        method: 'put',
        data
    })
}
//delete
export function remove(id){
    return Axios({
        url: `/categories/${ id }`,
        method: 'delete'
    })
}
//deleteMany
export function deleteMany(data) {
    return Axios({
        url: `/categories/deleteMany`,
        method: 'post',
        data
    })
}
//list
export function list(query) {
    return Axios({
        url: `/categories?getRoot=0&num=${ query.currentPage }&size=${ query.size }`,
        method: 'get'
    })
}
//getById
export function getById(id) {
    return Axios({
        url: `/categories/${ id }`,
        method: 'get'
    })
}
//listForSelect
export function listAllRoot() {
    return Axios({
        url: `/categories?getRoot=1`,
        method: 'get'
    })
}

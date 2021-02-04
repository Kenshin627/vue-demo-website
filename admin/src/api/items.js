import Axios from '@/api/index.js'

//create
export function create(data) {
    return Axios({
        url: '/items',
        method: 'post',
        data
    })
}
//edit
export function edit(data){
    return Axios({
        url: `/items`,
        method: 'put',
        data
    })
}
//delete
export function remove(id){
    return Axios({
        url: `/items/${ id }`,
        method: 'delete'
    })
}
//deleteMany
export function deleteMany(data) {
    return Axios({
        url: `/items/deleteMany`,
        method: 'post',
        data
    })
}
//list
export function list(query) {
    let base = `/items?getRoot=0&num=${ query.currentPage }&size=${ query.size }`
    base += query.name? `&name=${query.name}` : ''
    return Axios({
        url: base,
        method: 'get'
    })
}
//getById
export function getById(id) {
    return Axios({
        url: `/items/${ id }`,
        method: 'get'
    })
}
//listForSelect
export function listAllRoot() {
    return Axios({
        url: `/items?getRoot=1`,
        method: 'get'
    })
}
export const upLoadUrl = `http://localhost:3001/api/admin/items/upload`

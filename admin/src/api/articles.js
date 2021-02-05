import Axios from '@/api/index.js'

//create
export function create(data) {
    return Axios({
        url: '/articles',
        method: 'post',
        data
    })
}
//edit
export function edit(data){
    return Axios({
        url: `/articles`,
        method: 'put',
        data
    })
}
//delete
export function remove(id){
    return Axios({
        url: `/articles/${ id }`,
        method: 'delete'
    })
}
//deleteMany
export function deleteMany(data) {
    return Axios({
        url: `/articles/deleteMany`,
        method: 'post',
        data
    })
}
//list
export function list(query) {
    let base = `/articles?num=${ query.currentPage }&size=${ query.size }`
    base += query.name? `&name=${query.name}` : ''
    return Axios({
        url: base,
        method: 'get'
    })
}
//getById
export function getById(id) {
    return Axios({
        url: `/articles/${ id }`,
        method: 'get'
    })
}

export function fetchCategories(parentName) {
    return Axios({
        url: `/categories/children/${parentName}`,
        method: 'get'
    })
}
export const uploadURL = `http://localhost:3001/api/admin/articles/upload`



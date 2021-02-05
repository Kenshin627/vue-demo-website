import Axios from '@/api/index.js'

//create
export function create(data) {
    return Axios({
        url: '/heros',
        method: 'post',
        data
    })
}
//edit
export function edit(data){
    return Axios({
        url: `/heros`,
        method: 'put',
        data
    })
}
//delete
export function remove(id){
    return Axios({
        url: `/heros/${ id }`,
        method: 'delete'
    })
}
//deleteMany
export function deleteMany(data) {
    return Axios({
        url: `/heros/deleteMany`,
        method: 'post',
        data
    })
}
//list
export function list(query) {
    let base = `/heros?getRoot=0&num=${ query.currentPage }&size=${ query.size }`
    base += query.name? `&name=${query.name}` : ''
    return Axios({
        url: base,
        method: 'get'
    })
}
//getById
export function getById(id) {
    return Axios({
        url: `/heros/${ id }`,
        method: 'get'
    })
}
//listForSelect
export function listAllRoot() {
    return Axios({
        url: `/heros?getRoot=1`,
        method: 'get'
    })
}

export function fetchHeroCategories(parentName) {
    return Axios({
        url: `/categories/children/${parentName}`,
        method: 'get'
    })
}
export function fetchHeroItems() {
    return Axios({
        url: `/items?getAll=1`,
        method: 'get'
    })
}

export function fetchHeros() {
    return Axios({
        url: `/heros?getAll=1`,
        method: 'get'
    })
}

export const uploadURL = `http://localhost:3001/api/admin/heros/upload`

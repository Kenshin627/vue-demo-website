import Axios from '@/api/index.js'

//create
export function create(data) {
    return Axios({
        url: '/ads',
        method: 'post',
        data
    })
}
//edit
export function edit(data){
    return Axios({
        url: `/ads`,
        method: 'put',
        data
    })
}
//delete
export function remove(id){
    return Axios({
        url: `/ads/${ id }`,
        method: 'delete'
    })
}
//deleteMany
export function deleteMany(data) {
    return Axios({
        url: `/ads/deleteMany`,
        method: 'post',
        data
    })
}
//list
export function list(query) {
    let base = `/ads?getRoot=0&num=${ query.currentPage }&size=${ query.size }`
    base += query.name? `&name=${query.name}` : ''
    return Axios({
        url: base,
        method: 'get'
    })
}
//getById
export function getById(id) {
    return Axios({
        url: `/ads/${ id }`,
        method: 'get'
    })
}

export const upLoadUrl = `http://localhost:3001/api/admin/ads/upload`

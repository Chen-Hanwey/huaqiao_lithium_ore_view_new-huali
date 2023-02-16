import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/complaint/list',
    method: 'post',
    data: query
  })
}

export function getInfo(id) {
  return request({
    url: '/complaint/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/complaint',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/complaint',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/complaint/' + id,
    method: 'delete'
  })
}

export function exportList(query) {
  return request({
    url: '/complaint/export',
    method: 'post',
    data: query
  })
}

export function issue(data) {
  return request({
    url: '/complaint/issue',
    method: 'post',
    data: data
  })
}

export function audit(id) {
  return request({
    url: '/complaint/audit/' + id,
    method: 'post'
  })
}

import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/invitation/list',
    method: 'post',
    data: query
  })
}

export function getInfo(id) {
  return request({
    url: '/invitation/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/invitation',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/invitation',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/invitation/' + id,
    method: 'delete'
  })
}

export function exportList(query) {
  return request({
    url: '/invitation/export',
    method: 'post',
    data: query
  })
}

export function getBidList(query) {
  return request({
    url: '/invitation/getBidList',
    method: 'post',
    data: query
  })
}

export function getMyBidList(query) {
  return request({
    url: '/invitation/getMyBidList',
    method: 'post',
    data: query
  })
}

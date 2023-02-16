import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/bid',
    method: 'post',
    data: data
  })
}

export function list(query) {
  return request({
    url: '/bid/list',
    method: 'post',
    data: query
  })
}

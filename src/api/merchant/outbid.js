import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/outbid',
    method: 'post',
    data: data
  })
}

export function list(query) {
  return request({
    url: '/outbid/list',
    method: 'post',
    data: query
  })
}

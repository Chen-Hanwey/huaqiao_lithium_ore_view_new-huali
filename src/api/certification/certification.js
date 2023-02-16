import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/certification/list',
    method: 'post',
    data: query
  })
}

export function getInfo(id) {
  return request({
    url: '/certification/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/certification',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/certification',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/certification/' + id,
    method: 'delete'
  })
}

export function exportList(query) {
  return request({
    url: '/certification/export',
    method: 'post',
    data: query
  })
}

// export function audit(id) {
//   return request({
//     url: '/certification/audit/' + id,
//     method: 'post'
//   })
// }
export function audit(body) {
  return request({
    url: '/certification/audit',
    method: 'post',
    data: body
  })
}

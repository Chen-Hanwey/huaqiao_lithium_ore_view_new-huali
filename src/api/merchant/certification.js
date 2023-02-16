import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/merchant/certification/list',
    method: 'post',
    data: query
  })
}

export function getInfo(id) {
  return request({
    url: '/merchant/certification/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/merchant/certification',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/merchant/certification',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/merchant/certification/' + id,
    method: 'delete'
  })
}

export function exportList(query) {
  return request({
    url: '/merchant/certification/export',
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
    url: '/merchant/certification/audit',
    method: 'post',
    data: body
  })
}

import request from '@/utils/request'

// 查询晨检记录列表
export function listMorningCheck(query) {
  return request({
    url: '/morningCheck/morningCheck/list',
    method: 'post',
    data: query
  })
}

// 查询晨检记录数量
export function countMorningCheck(query) {
  return request({
    url: '/morningCheck/morningCheck/count',
    method: 'post',
    data: query
  })
}

// 查询晨检记录详细
export function getMorningCheck(id) {
  return request({
    url: '/morningCheck/morningCheck/' + id,
    method: 'get'
  })
}

// 新增晨检记录
export function addMorningCheck(data) {
  return request({
    url: '/morningCheck/morningCheck',
    method: 'post',
    data: data
  })
}

// 修改晨检记录
export function updateMorningCheck(data) {
  return request({
    url: '/morningCheck/morningCheck',
    method: 'put',
    data: data
  })
}

// 删除晨检记录
export function delMorningCheck(id) {
  return request({
    url: '/morningCheck/morningCheck/' + id,
    method: 'delete'
  })
}

// 导出晨检记录
export function exportMorningCheck(query) {
  return request({
    url: '/morningCheck/morningCheck/export',
    method: 'post',
    data: query
  })
}

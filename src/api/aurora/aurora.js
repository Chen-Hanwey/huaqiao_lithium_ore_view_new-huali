import request from '@/utils/request'

// 查询告警列表
export function listAurora(query) {
  return request({
    url: '/aurora/aurora/list',
    method: 'post',
    data: query
  })
}

// 查询告警数量
export function countAurora(query) {
  return request({
    url: '/aurora/aurora/count',
    method: 'post',
    data: query
  })
}

// 查询告警详细
export function getAurora(id) {
  return request({
    url: '/aurora/aurora/' + id,
    method: 'get'
  })
}

// 新增告警
export function addAurora(data) {
  return request({
    url: '/aurora/aurora',
    method: 'post',
    data: data
  })
}

// 修改告警
export function updateAurora(data) {
  return request({
    url: '/aurora/aurora',
    method: 'put',
    data: data
  })
}

// 整改
export function rectifyAurora(data) {
  return request({
    url: '/aurora/aurora/rectify',
    method: 'put',
    data: data
  })
}

// 删除告警
export function delAurora(id) {
  return request({
    url: '/aurora/aurora/' + id,
    method: 'delete'
  })
}

// 导出告警
export function exportAurora(query) {
  return request({
    url: '/aurora/aurora/export',
    method: 'post',
    data: query
  })
}

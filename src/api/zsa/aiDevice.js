import request from '@/utils/request'

// 查询ai设备列表
export function listAiDevice(query) {
  return request({
    url: '/place/aiDevice/list',
    method: 'post',
    data: query
  })
}

// 查询ai设备数量
export function countAiDevice(query) {
  return request({
    url: '/place/aiDevice/count',
    method: 'post',
    data: query
  })
}

// 查询ai设备详细
export function getAiDevice(id) {
  return request({
    url: '/place/aiDevice/' + id,
    method: 'get'
  })
}

// 新增ai设备
export function addAiDevice(data) {
  return request({
    url: '/place/aiDevice',
    method: 'post',
    data: data
  })
}

// 修改ai设备
export function updateAiDevice(data) {
  return request({
    url: '/place/aiDevice',
    method: 'put',
    data: data
  })
}

// 删除ai设备
export function delAiDevice(id) {
  return request({
    url: '/place/aiDevice/' + id,
    method: 'delete'
  })
}

// 导出ai设备
export function exportAiDevice(query) {
  return request({
    url: '/place/aiDevice/export',
    method: 'post',
    data: query
  })
}

// 导出ai设备
export function aiDevice(ids) {
  return request({
    url: '/zsareport/api/device/aiDevice/' + ids,
    method: 'post'
  })
}
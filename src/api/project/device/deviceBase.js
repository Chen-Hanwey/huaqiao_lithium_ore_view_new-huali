import request from '@/utils/request'

// 查询设备基础信息列表
export function listDeviceBase(query) {
  return request({
    url: '/device/deviceBase/list',
    method: 'post',
    data: query
  })
}

// 查询设备基础信息数量
export function countDeviceBase(query) {
  return request({
    url: '/device/deviceBase/count',
    method: 'post',
    data: query
  })
}

// 查询设备基础信息详细
export function getDeviceBase(id) {
  return request({
    url: '/device/deviceBase/' + id,
    method: 'get'
  })
}

// 新增设备基础信息
export function addDeviceBase(data) {
  return request({
    url: '/device/deviceBase',
    method: 'post',
    data: data
  })
}

// 修改设备基础信息
export function updateDeviceBase(data) {
  return request({
    url: '/device/deviceBase',
    method: 'put',
    data: data
  })
}

// 删除设备基础信息
export function delDeviceBase(id) {
  return request({
    url: '/device/deviceBase/' + id,
    method: 'delete'
  })
}

// 导出设备基础信息
export function exportDeviceBase(query) {
  return request({
    url: '/device/deviceBase/export',
    method: 'post',
    data: query
  })
}

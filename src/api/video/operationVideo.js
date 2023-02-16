import request from '@/utils/request'

// 查询设备关联管理列表
export function listOperationVideo(query) {
  return request({
    url: '/video/operationVideo/list',
    method: 'post',
    data: query
  })
}

// 查询设备关联管理数量
export function countOperationVideo(query) {
  return request({
    url: '/video/operationVideo/count',
    method: 'post',
    data: query
  })
}

// 查询设备关联管理详细
export function getOperationVideo(id) {
  return request({
    url: '/video/operationVideo/' + id,
    method: 'get'
  })
}

// 新增设备关联管理
export function addOperationVideo(data) {
  return request({
    url: '/video/operationVideo',
    method: 'post',
    data: data
  })
}

// 新增设备关联管理
export function insertOrUpdateOperationVideoList(data) {
  return request({
    url: '/video/operationVideo/insertOrUpdateList',
    method: 'post',
    data: data
  })
}

// 修改设备关联管理
export function updateOperationVideo(data) {
  return request({
    url: '/video/operationVideo',
    method: 'put',
    data: data
  })
}

// 删除设备关联管理
export function delOperationVideo(id) {
  return request({
    url: '/video/operationVideo/' + id,
    method: 'delete'
  })
}

// 导出设备关联管理
export function exportOperationVideo(query) {
  return request({
    url: '/video/operationVideo/export',
    method: 'post',
    data: query
  })
}

// 导出设备关联管理
export function listTreeWithDeviceNum() {
  return request({
    url: '/video/operationVideo/listTreeWithDeviceNum',
    method: 'get'
  })
}

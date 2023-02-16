import request from '@/utils/request'

// 查询预警配置管理列表
export function listMissingRecordConfiguration(query) {
  return request({
    url: '/missingRecord/missingRecordConfiguration/list',
    method: 'post',
    data: query
  })
}

// 查询预警配置管理数量
export function countMissingRecordConfiguration(query) {
  return request({
    url: '/missingRecord/missingRecordConfiguration/count',
    method: 'post',
    data: query
  })
}

// 查询预警配置管理详细
export function getMissingRecordConfiguration(id) {
  return request({
    url: '/missingRecord/missingRecordConfiguration/' + id,
    method: 'get'
  })
}

// 新增预警配置管理
export function addMissingRecordConfiguration(data) {
  return request({
    url: '/missingRecord/missingRecordConfiguration',
    method: 'post',
    data: data
  })
}

// 修改预警配置管理
export function updateMissingRecordConfiguration(data) {
  return request({
    url: '/missingRecord/missingRecordConfiguration',
    method: 'put',
    data: data
  })
}

// 删除预警配置管理
export function delMissingRecordConfiguration(id) {
  return request({
    url: '/missingRecord/missingRecordConfiguration/' + id,
    method: 'delete'
  })
}

// 导出预警配置管理
export function exportMissingRecordConfiguration(query) {
  return request({
    url: '/missingRecord/missingRecordConfiguration/export',
    method: 'post',
    data: query
  })
}

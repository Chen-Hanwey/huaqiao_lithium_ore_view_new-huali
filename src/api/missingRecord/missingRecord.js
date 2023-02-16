import request from '@/utils/request'

// 查询预警推送记录列表
export function listMissingRecord(query) {
  return request({
    url: '/missingRecord/missingRecord/list',
    method: 'post',
    data: query
  })
}

// 查询预警推送记录数量
export function countMissingRecord(query) {
  return request({
    url: '/missingRecord/missingRecord/count',
    method: 'post',
    data: query
  })
}

// 查询预警推送记录详细
export function getMissingRecord(id) {
  return request({
    url: '/missingRecord/missingRecord/' + id,
    method: 'get'
  })
}

// 新增预警推送记录
export function addMissingRecord(data) {
  return request({
    url: '/missingRecord/missingRecord',
    method: 'post',
    data: data
  })
}

// 修改预警推送记录
export function updateMissingRecord(data) {
  return request({
    url: '/missingRecord/missingRecord',
    method: 'put',
    data: data
  })
}

// 删除预警推送记录
export function delMissingRecord(id) {
  return request({
    url: '/missingRecord/missingRecord/' + id,
    method: 'delete'
  })
}

// 导出预警推送记录
export function exportMissingRecord(query) {
  return request({
    url: '/missingRecord/missingRecord/export',
    method: 'post',
    data: query
  })
}

// 处理预警推送记录
export function handleMissingRecord(id) {
  return request({
    url: '/missingRecord/missingRecord/handle/' + id,
    method: 'get'
  })
}

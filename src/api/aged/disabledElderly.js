import request from '@/utils/request'

// 查询失能老人管理列表
export function listDisabledElderly (query) {
  return request({
    url: '/aged/disabledElderly/list',
    method: 'post',
    data: query
  })
}

export function listWithInOrder (query) {
  return request({
    url: '/aged/disabledElderly/listWithInOrder',
    method: 'post',
    data: query
  })
}

// 查询未审核失能老人管理列表
export function listDisabledElderlyNoAudit (query) {
  return request({
    url: '/aged/disabledElderly/list/noAudit',
    method: 'post',
    data: query
  })
}

// 查询失能老人管理数量
export function countDisabledElderly (query) {
  return request({
    url: '/aged/disabledElderly/count',
    method: 'post',
    data: query
  })
}

// 查询失能老人管理详细
export function getDisabledElderly (id) {
  return request({
    url: '/aged/disabledElderly/' + id,
    method: 'get'
  })
}

// 新增失能老人管理
export function addDisabledElderly (data) {
  return request({
    url: '/aged/disabledElderly',
    method: 'post',
    data: data
  })
}


// 新增未审核失能老人管理
export function addDisabledElderlyNoAudit (data) {
  return request({
    url: '/aged/disabledElderly/noAudit',
    method: 'post',
    data: data
  })
}

// 修改失能老人管理
export function updateDisabledElderly (data) {
  return request({
    url: '/aged/disabledElderly',
    method: 'put',
    data: data
  })
}

// 删除失能老人管理
export function delDisabledElderly (id) {
  return request({
    url: '/aged/disabledElderly/' + id,
    method: 'delete'
  })
}

// 导出失能老人管理
export function exportDisabledElderly (query) {
  return request({
    url: '/aged/disabledElderly/export',
    method: 'post',
    data: query
  })
}

// 审核
export function audit (id) {
  return request({
    url: '/aged/disabledElderly/audit/' + id,
    method: 'get'
  })
}

// 查询失能老人管理详细
export function getDisabledElderlyAudit (id) {
  return request({
    url: '/aged/disabledElderly/auditInfo/' + id,
    method: 'get'
  })
}

// 删除失能老人管理
export function delProcessElderly(id) {
  return request({
    url: '/aged/disabledElderly/processRemove/' + id,
    method: 'delete'
  })
}

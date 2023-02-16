import request from '@/utils/request'

// 查询消防安检记录列表
export function listKitchenFireSafetySupervise(query) {
  return request({
    url: '/kitchenFireSafety/kitchenFireSafety/list',
    method: 'post',
    data: query
  })
}

// 查询消防安检记录数量
export function countKitchenFireSafetySupervise(query) {
  return request({
    url: '/kitchenFireSafety/kitchenFireSafety/count',
    method: 'post',
    data: query
  })
}

// 查询消防安检记录详细
export function getKitchenFireSafetySupervise(id) {
  return request({
    url: '/kitchenFireSafety/kitchenFireSafety/' + id,
    method: 'get'
  })
}

// 新增消防安检记录
export function addKitchenFireSafetySupervise(data) {
  return request({
    url: '/kitchenFireSafety/kitchenFireSafety',
    method: 'post',
    data: data
  })
}

// 修改消防安检记录
export function updateKitchenFireSafetySupervise(data) {
  return request({
    url: '/kitchenFireSafety/kitchenFireSafety',
    method: 'put',
    data: data
  })
}

// 删除消防安检记录
export function delKitchenFireSafetySupervise(id) {
  return request({
    url: '/kitchenFireSafety/kitchenFireSafety/' + id,
    method: 'delete'
  })
}

// 导出消防安检记录
export function exportKitchenFireSafetySupervise(query) {
  return request({
    url: '/kitchenFireSafety/kitchenFireSafety/export',
    method: 'post',
    data: query
  })
}

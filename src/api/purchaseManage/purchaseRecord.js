import request from '@/utils/request'

// 查询采购记录列表
export function listPurchaseRecord(query) {
  return request({
    url: '/purchaseRecord/purchaseRecord/list',
    method: 'post',
    data: query
  })
}
// 查询采购记录列表
export function listPurchaseRecords(query) {
  return request({
    url: '/purchaseRecord/purchaseRecord/lists',
    method: 'post',
    data: query
  })
}

// 查询采购记录数量
export function countPurchaseRecord(query) {
  return request({
    url: '/purchaseRecord/purchaseRecord/count',
    method: 'post',
    data: query
  })
}

// 查询采购记录详细
export function getPurchaseRecord(id) {
  return request({
    url: '/purchaseRecord/purchaseRecord/' + id,
    method: 'get'
  })
}

// 新增采购记录
export function addPurchaseRecord(data) {
  return request({
    url: '/purchaseRecord/purchaseRecord',
    method: 'post',
    data: data
  })
}

// 修改采购记录
export function updatePurchaseRecord(data) {
  return request({
    url: '/purchaseRecord/purchaseRecord',
    method: 'put',
    data: data
  })
}

// 修改采购记录
export function updateApplicationPurchaseRecord(data) {
  return request({
    url: '/purchaseRecord/purchaseRecord/applicationEdit',
    method: 'put',
    data: data
  })
}

// 删除采购记录
export function delPurchaseRecord(id) {
  return request({
    url: '/purchaseRecord/purchaseRecord/' + id,
    method: 'delete'
  })
}

// 导出采购记录
export function exportPurchaseRecord(query) {
  return request({
    url: '/purchaseRecord/purchaseRecord/export',
    method: 'post',
    data: query
  })
}

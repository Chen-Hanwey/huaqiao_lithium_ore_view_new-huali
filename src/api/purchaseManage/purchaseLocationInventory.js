import request from '@/utils/request'

// 查询库存列表
export function listPurchaseInventory(query) {
  return request({
    url: '/purchaseInventory/purchaseLocationInventory/list',
    method: 'post',
    data: query
  })
}

// 查询库存数量
export function countPurchaseInventory(query) {
  return request({
    url: '/purchaseInventory/purchaseLocationInventory/count',
    method: 'post',
    data: query
  })
}

// 查询库存详细
export function getPurchaseInventory(id) {
  return request({
    url: '/purchaseInventory/purchaseLocationInventory/' + id,
    method: 'get'
  })
}

// 新增库存
export function addPurchaseInventory(data) {
  return request({
    url: '/purchaseInventory/purchaseLocationInventory',
    method: 'post',
    data: data
  })
}

// 修改库存
export function updatePurchaseInventory(data) {
  return request({
    url: '/purchaseInventory/purchaseLocationInventory',
    method: 'put',
    data: data
  })
}

// 删除库存
export function delPurchaseInventory(id) {
  return request({
    url: '/purchaseInventory/purchaseLocationInventory/' + id,
    method: 'delete'
  })
}

// 导出库存
export function exportPurchaseInventory(query) {
  return request({
    url: '/purchaseInventory/purchaseLocationInventory/export',
    method: 'post',
    data: query
  })
}

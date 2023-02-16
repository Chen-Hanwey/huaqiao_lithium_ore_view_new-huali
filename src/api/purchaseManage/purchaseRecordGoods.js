import request from '@/utils/request'

// 查询采购商品货物记录列表
export function listPurchaseRecordGoods(query) {
  return request({
    url: '/purchaseRecordGoods/purchaseRecordGoods/list',
    method: 'post',
    data: query
  })
}

// 查询采购商品货物记录数量
export function countPurchaseRecordGoods(query) {
  return request({
    url: '/purchaseRecordGoods/purchaseRecordGoods/count',
    method: 'post',
    data: query
  })
}

// 查询采购商品货物记录详细
export function getPurchaseRecordGoods(id) {
  return request({
    url: '/purchaseRecordGoods/purchaseRecordGoods/' + id,
    method: 'get'
  })
}

// 新增采购商品货物记录
export function addPurchaseRecordGoods(data) {
  return request({
    url: '/purchaseRecordGoods/purchaseRecordGoods',
    method: 'post',
    data: data
  })
}

// 修改采购商品货物记录
export function updatePurchaseRecordGoods(data) {
  return request({
    url: '/purchaseRecordGoods/purchaseRecordGoods',
    method: 'put',
    data: data
  })
}

// 删除采购商品货物记录
export function delPurchaseRecordGoods(id) {
  return request({
    url: '/purchaseRecordGoods/purchaseRecordGoods/' + id,
    method: 'delete'
  })
}

// 导出采购商品货物记录
export function exportPurchaseRecordGoods(query) {
  return request({
    url: '/purchaseRecordGoods/purchaseRecordGoods/export',
    method: 'post',
    data: query
  })
}

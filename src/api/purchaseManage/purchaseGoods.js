import request from '@/utils/request'

// 查询采购商品信息列表
export function listPurchaseGoods(query) {
  return request({
    url: '/purchaseGoods/purchaseGoods/list',
    method: 'post',
    data: query
  })
}
// 查询采购商品信息列表
export function listsPurchaseGoods(query) {
  return request({
    url: '/purchaseGoods/purchaseGoods/lists',
    method: 'post',
    data: query
  })
}
// 查询采购商品信息数量
export function countPurchaseGoods(query) {
  return request({
    url: '/purchaseGoods/purchaseGoods/count',
    method: 'post',
    data: query
  })
}

// 查询采购商品信息详细
export function getPurchaseGoods(id) {
  return request({
    url: '/purchaseGoods/purchaseGoods/' + id,
    method: 'get'
  })
}

// 新增采购商品信息
export function addPurchaseGoods(data) {
  return request({
    url: '/purchaseGoods/purchaseGoods',
    method: 'post',
    data: data
  })
}

// 修改采购商品信息
export function updatePurchaseGoods(data) {
  return request({
    url: '/purchaseGoods/purchaseGoods',
    method: 'put',
    data: data
  })
}

// 修改采购供应商和商品的关联形式
export function updateRelate(data) {
  return request({
    url: '/purchaseGoods/purchaseGoods/updateRelate',
    method: 'post',
    data: data
  })
}

// 删除采购商品信息
export function delPurchaseGoods(id) {
  return request({
    url: '/purchaseGoods/purchaseGoods/' + id,
    method: 'delete'
  })
}

// 导出采购商品信息
export function exportPurchaseGoods(query) {
  return request({
    url: '/purchaseGoods/purchaseGoods/export',
    method: 'post',
    data: query
  })
}

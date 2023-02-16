import request from '@/utils/request'

// 查询出库商品列表
export function listPurchaseOut(query) {
  return request({
    url: '/inOutWareHouse/purchaseOut/list',
    method: 'post',
    data: query
  })
}
// 查询出库商品列表
export function listLocationPurchaseOut(query) {
  return request({
    url: '/inOutWareHouse/purchaseOut/locationList',
    method: 'post',
    data: query
  })
}


// 查询出库商品数量
export function countPurchaseOut(query) {
  return request({
    url: '/inOutWareHouse/purchaseOut/count',
    method: 'post',
    data: query
  })
}

// 查询出库商品详细
export function getPurchaseOut(id) {
  return request({
    url: '/inOutWareHouse/purchaseOut/' + id,
    method: 'get'
  })
}

// 新增出库商品
export function addPurchaseOut(data) {
  return request({
    url: '/inOutWareHouse/purchaseOut',
    method: 'post',
    data: data
  })
}

// 修改出库商品
export function updatePurchaseOut(data) {
  return request({
    url: '/inOutWareHouse/purchaseOut',
    method: 'put',
    data: data
  })
}

// 删除出库商品
export function delPurchaseOut(id) {
  return request({
    url: '/inOutWareHouse/purchaseOut/' + id,
    method: 'delete'
  })
}

// 导出出库商品
export function exportPurchaseOut(query) {
  return request({
    url: '/inOutWareHouse/purchaseOut/export',
    method: 'post',
    data: query
  })
}

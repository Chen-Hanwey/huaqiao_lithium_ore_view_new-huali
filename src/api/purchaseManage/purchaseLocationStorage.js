import request from '@/utils/request'

// 查询入库商品列表
export function listPurchaseStorage(query) {
  return request({
    url: '/inOutWarehouse/purchaseLocationStorage/list',
    method: 'post',
    data: query
  })
}

// 查询入库商品数量
export function countPurchaseStorage(query) {
  return request({
    url: '/inOutWarehouse/purchaseLocationStorage/count',
    method: 'post',
    data: query
  })
}

// 查询入库商品详细
export function getPurchaseStorage(id) {
  return request({
    url: '/inOutWarehouse/purchaseLocationStorage/' + id,
    method: 'get'
  })
}

// 新增入库商品
export function addPurchaseStorage(data) {
  return request({
    url: '/inOutWarehouse/purchaseLocationStorage',
    method: 'post',
    data: data
  })
}

// 修改入库商品
export function updatePurchaseStorage(data) {
  return request({
    url: '/inOutWarehouse/purchaseLocationStorage',
    method: 'put',
    data: data
  })
}

// 删除入库商品
export function delPurchaseStorage(id) {
  return request({
    url: '/inOutWarehouse/purchaseLocationStorage/' + id,
    method: 'delete'
  })
}

// 导出入库商品
export function exportPurchaseStorage(query) {
  return request({
    url: '/inOutWarehouse/purchaseLocationStorage/export',
    method: 'post',
    data: query
  })
}

// 根据采购记录添加入库商品
export function addStorageRecords(purchaseRecordIds) {
  return request({
    url: `/inOutWarehouse/purchaseLocationStorage/${purchaseRecordIds}`,
    method: 'post'
  })
}

// 查询入库商品详细
export function getStorageQrCode(type,productIdentification,lotNumber) {
  return request({
    url: '/inOutWarehouse/purchaseLocationStorage/qrCode',
    method: 'get',
    params:{type:type,productIdentification:productIdentification,lotNumber:lotNumber}
  })
}
import request from '@/utils/request'

// 查询入库商品列表
export function listPurchaseStorage(query) {
  return request({
    url: '/inOutWarehouse/purchaseStorage/list',
    method: 'post',
    data: query
  })
}

// 查询入库商品数量
export function countPurchaseStorage(query) {
  return request({
    url: '/inOutWarehouse/purchaseStorage/count',
    method: 'post',
    data: query
  })
}

// 查询入库商品详细
export function getPurchaseStorage(id) {
  return request({
    url: '/inOutWarehouse/purchaseStorage/' + id,
    method: 'get'
  })
}

// 新增入库商品
export function addPurchaseStorage(data) {
  return request({
    url: '/inOutWarehouse/purchaseStorage',
    method: 'post',
    data: data
  })
}

// 修改入库商品
export function updatePurchaseStorage(data) {
  return request({
    url: '/inOutWarehouse/purchaseStorage',
    method: 'put',
    data: data
  })
}

// 删除入库商品
export function delPurchaseStorage(id) {
  return request({
    url: '/inOutWarehouse/purchaseStorage/' + id,
    method: 'delete'
  })
}

// 导出入库商品
export function exportPurchaseStorage(query) {
  return request({
    url: '/inOutWarehouse/purchaseStorage/export',
    method: 'post',
    data: query
  })
}

// 根据采购记录添加入库商品
export function addStorageRecords(purchaseRecordIds) {
  return request({
    url: `/inOutWarehouse/purchaseStorage/${purchaseRecordIds}`,
    method: 'post'
  })
}

// 查询入库商品详细
export function getStorageQrCode(operationId,code,type,productIdentification,lotNumber) {
  return request({
    url: '/inOutWarehouse/purchaseStorage/qrCode',
    method: 'get',
    params:{operationId:operationId,code:code,type:type,productIdentification:productIdentification,lotNumber:lotNumber}
  })
}
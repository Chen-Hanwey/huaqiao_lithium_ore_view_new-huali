import request from '@/utils/request'

// 查询采购供应商列表
export function listPurchaseSupplier(query) {
  return request({
    url: '/purchaseSupplier/purchaseSupplier/list',
    method: 'post',
    data: query
  })
}

// 查询采购供应商数量
export function countPurchaseSupplier(query) {
  return request({
    url: '/purchaseSupplier/purchaseSupplier/count',
    method: 'post',
    data: query
  })
}

// 查询采购供应商详细
export function getPurchaseSupplier(id) {
  return request({
    url: '/purchaseSupplier/purchaseSupplier/' + id,
    method: 'get'
  })
}

// 根据企业id获取供应商树状结构
export function treePurchaseSupplierByEnterpriseId(id) {
  return request({
    url: '/purchaseSupplier/purchaseSupplier/tree/enterpriseId/' + id,
    method: 'get'
  })
}

// 新增采购供应商
export function addPurchaseSupplier(data) {
  return request({
    url: '/purchaseSupplier/purchaseSupplier',
    method: 'post',
    data: data
  })
}

// 修改采购供应商
export function updatePurchaseSupplier(data) {
  return request({
    url: '/purchaseSupplier/purchaseSupplier',
    method: 'put',
    data: data
  })
}

// 删除采购供应商
export function delPurchaseSupplier(id) {
  return request({
    url: '/purchaseSupplier/purchaseSupplier/' + id,
    method: 'delete'
  })
}

// 导出采购供应商
export function exportPurchaseSupplier(query) {
  return request({
    url: '/purchaseSupplier/purchaseSupplier/export',
    method: 'post',
    data: query
  })
}

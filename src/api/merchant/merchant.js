import request from '@/utils/request'

// 查询商户主体信息列表
export function listMerchant(query) {
  return request({
    url: '/merchant/merchant/list',
    method: 'post',
    data: query
  })
}

// 获取商户主体及监管信息树
export function listMerchantTreeWithDept() {
  return request({
    url: '/merchant/merchant/listTreeWithDept',
    method: 'post'
  })
}


// 查询商户主体信息列表(不分页)
export function listAllMerchant(query) {
  return request({
    url: '/merchant/merchant/listAll',
    method: 'post',
    data: query
  })
}

// 查询商户主体信息列表(下拉选择)
export function merchantListForSel(query) {
  return request({
    url: '/merchant/merchant/listForSel',
    method: 'post',
    data: query
  })
}

// 查询商户主体信息数量
export function countMerchant(query) {
  return request({
    url: '/merchant/merchant/count',
    method: 'post',
    data: query
  })
}

// 查询商户主体信息详细
export function getMerchant(id) {
  return request({
    url: '/merchant/merchant/' + id,
    method: 'get'
  })
}

// 新增商户主体信息
export function addMerchant(data) {
  return request({
    url: '/merchant/merchant',
    method: 'post',
    data: data
  })
}

// 修改商户主体信息
export function updateMerchant(data) {
  return request({
    url: '/merchant/merchant',
    method: 'put',
    data: data
  })
}

// 删除商户主体信息
export function delMerchant(id) {
  return request({
    url: '/merchant/merchant/' + id,
    method: 'delete'
  })
}

// 导出商户主体信息
export function exportMerchant(query) {
  return request({
    url: '/merchant/merchant/export',
    method: 'post',
    data: query
  })
}

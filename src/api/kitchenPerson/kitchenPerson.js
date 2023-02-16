import request from '@/utils/request'

// 查询从业人员管理列表
export function listKitchenPerson(query) {
  return request({
    url: '/kitchenPerson/kitchenPerson/list',
    method: 'post',
    data: query
  })
}

export function listAll(query) {
  return request({
    url: '/kitchenPerson/kitchenPerson/listAll',
    method: 'post',
    data: query
  })
}

// 查询从业人员管理数量
export function countKitchenPerson(query) {
  return request({
    url: '/kitchenPerson/kitchenPerson/count',
    method: 'post',
    data: query
  })
}

// 查询从业人员管理详细
export function getKitchenPerson(id) {
  return request({
    url: '/kitchenPerson/kitchenPerson/' + id,
    method: 'get'
  })
}

// 新增从业人员管理
export function addKitchenPerson(data) {
  return request({
    url: '/kitchenPerson/kitchenPerson',
    method: 'post',
    data: data
  })
}

// 修改从业人员管理
export function updateKitchenPerson(data) {
  return request({
    url: '/kitchenPerson/kitchenPerson',
    method: 'put',
    data: data
  })
}

// 删除从业人员管理
export function delKitchenPerson(id) {
  return request({
    url: '/kitchenPerson/kitchenPerson/' + id,
    method: 'delete'
  })
}

// 导出从业人员管理
export function exportKitchenPerson(query) {
  return request({
    url: '/kitchenPerson/kitchenPerson/export',
    method: 'post',
    data: query
  })
}

// 查询后给亲管理人员列表（下拉选择）
export function queryKitchenPersonOptions(query) {
  return request({
    url: '/kitchenPerson/kitchenPerson/listForSel',
    method: 'get',
    data: query
  })
}

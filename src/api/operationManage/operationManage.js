import request from '@/utils/request'

// 查询经营场所管理列表
export function listOperationManage(query) {
  return request({
    url: '/operationManage/operationManage/list',
    method: 'post',
    data: query
  })
}

// 查询经营场所管理数量
export function countOperationManage(query) {
  return request({
    url: '/operationManage/operationManage/count',
    method: 'post',
    data: query
  })
}

// 查询经营场所管理详细
export function getOperationManage(id) {
  return request({
    url: '/operationManage/operationManage/' + id,
    method: 'get'
  })
}

// 新增经营场所管理
export function addOperationManage(data) {
  return request({
    url: '/operationManage/operationManage',
    method: 'post',
    data: data
  })
}

// 修改经营场所管理
export function updateOperationManage(data) {
  return request({
    url: '/operationManage/operationManage',
    method: 'put',
    data: data
  })
}

// 删除经营场所管理
export function delOperationManage(id) {
  return request({
    url: '/operationManage/operationManage/' + id,
    method: 'delete'
  })
}

// 导出经营场所管理
export function exportOperationManage(query) {
  return request({
    url: '/operationManage/operationManage/export',
    method: 'post',
    data: query
  })
}

// 查询经营场所列表(不分页)
export function listAllOperation(query) {
  return request({
    url: '/operationManage/operationManage/listAll',
    method: 'post',
    data: query
  })
}

// 获取表单数据（企业信息以及经营场所信息）
export function getBaseFormData(operationId) {
  return request({
    url: '/operationManage/operationManage/getBaseFormData/' + operationId,
    method: 'post'
  })
}

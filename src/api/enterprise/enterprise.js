import request from '@/utils/request'

// 查询企业主体信息列表
export function listEnterprise(query) {
  return request({
    url: '/enterprise/enterprise/list',
    method: 'post',
    data: query
  })
}

// 查询企业主体信息列表
export function listApprovalEnterprise(query) {
  return request({
    url: '/enterprise/enterprise/listApproval',
    method: 'post',
    data: query
  })
}

// 获取企业主体及监管信息树
export function listEnterpriseTreeWithDept(userType) {
  return request({
    url: '/enterprise/enterprise/listTreeWithDept/' + userType,
    method: 'post'
  })
}


// 查询企业主体信息列表(不分页)
export function listAllEnterprise(query) {
  return request({
    url: '/enterprise/enterprise/listAll',
    method: 'post',
    data: query
  })
}

// 查询企业主体信息列表(下拉选择)
export function enterpriseListForSel(query) {
  return request({
    url: '/enterprise/enterprise/listForSel',
    method: 'post',
    data: query
  })
}

// 查询企业主体信息数量
export function countEnterprise(query) {
  return request({
    url: '/enterprise/enterprise/count',
    method: 'post',
    data: query
  })
}

// 查询企业主体信息详细
export function getEnterprise(id) {
  return request({
    url: '/enterprise/enterprise/' + id,
    method: 'get'
  })
}

// 新增企业主体信息
export function addEnterprise(data) {
  return request({
    url: '/enterprise/enterprise',
    method: 'post',
    data: data
  })
}

// 新增企业申请
export function addEnterpriseApproval(data) {
  return request({
    url: '/enterprise/enterprise/approval',
    method: 'post',
    data: data
  })
}

// 修改企业主体信息
export function updateEnterprise(data) {
  return request({
    url: '/enterprise/enterprise',
    method: 'put',
    data: data
  })
}

// 注销企业主体信息
export function logoutEnterprise(data) {
  return request({
    url: '/enterprise/enterprise/logout',
    method: 'post',
    data: data
  })
}

// 审批企业主体信息
export function auditEnterprise(data) {
  return request({
    url: '/enterprise/enterprise/audit',
    method: 'post',
    data: data
  })
}

// 删除企业主体信息
export function delEnterprise(id) {
  return request({
    url: '/enterprise/enterprise/' + id,
    method: 'delete'
  })
}

// 导出企业主体信息
export function exportEnterprise(query) {
  return request({
    url: '/enterprise/enterprise/export',
    method: 'post',
    data: query
  })
}

//获取企业申请审核结果
export function getApprovalResult(query) {
  return request({
    url: '/enterprise/enterprise/getApprovalResult',
    method: 'get',
    params: query
  })
}

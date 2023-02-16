import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}

export function treeselectAnon() {
  return request({
    url: '/system/dept/treeselectAnon',
    method: 'get'
  })
}
export function treeselectAnonPart() {
  return request({
    url: '/system/dept/treeselectAnonPart',
    method: 'get'
  })
}

// 查询部门下拉树结构
export function getDeptAndUserByDeptId(data) {
  return request({
    url: '/system/dept/getDeptAndUserByDeptId',
    method: 'get',
    params: data
  })
}

// 查询部门下拉树结构
export function getDeptAndUserByParentDept(data) {
  return request({
    url: '/system/dept/getDeptAndUserByParentDept',
    method: 'get',
    params: data
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}

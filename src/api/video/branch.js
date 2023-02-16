import request from '@/utils/request'
// 查询和家亲-组织列表
export function listBranch(query) {
  return request({
    url: '/hejq/branch/list',
    method: 'get',
    params: query
  })
}

// 查询和家亲-组织详细
export function getBranch(id) {
  return request({
    url: '/hejq/branch/' + id,
    method: 'get'
  })
}

// 新增和家亲-组织
export function addBranch(data) {
  return request({
    url: '/hejq/branch',
    method: 'post',
    data: data
  })
}

// 修改和家亲-组织
export function updateBranch(data) {
  return request({
    url: '/hejq/branch',
    method: 'put',
    data: data
  })
}

// 删除和家亲-组织
export function delBranch(id) {
  return request({
    url: '/hejq/branch/' + id,
    method: 'delete'
  })
}

// 导出和家亲-组织
export function exportBranch(query) {
  return request({
    url: '/hejq/branch/export',
    method: 'get',
    params: query
  })
}

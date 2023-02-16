import request from '@/utils/request'

// 查询陪餐管理列表
export function listAccompanyManage(query) {
  return request({
    url: '/accompanyManage/accompanyManage/list',
    method: 'post',
    data: query
  })
}

// 查询陪餐管理数量
export function countAccompanyManage(query) {
  return request({
    url: '/accompanyManage/accompanyManage/count',
    method: 'post',
    data: query
  })
}

// 查询陪餐管理详细
export function getAccompanyManage(id) {
  return request({
    url: '/accompanyManage/accompanyManage/' + id,
    method: 'get'
  })
}

// 新增陪餐管理
export function addAccompanyManage(data) {
  return request({
    url: '/accompanyManage/accompanyManage',
    method: 'post',
    data: data
  })
}

// 修改陪餐管理
export function updateAccompanyManage(data) {
  return request({
    url: '/accompanyManage/accompanyManage',
    method: 'put',
    data: data
  })
}

// 删除陪餐管理
export function delAccompanyManage(id) {
  return request({
    url: '/accompanyManage/accompanyManage/' + id,
    method: 'delete'
  })
}

// 导出陪餐管理
export function exportAccompanyManage(query) {
  return request({
    url: '/accompanyManage/accompanyManage/export',
    method: 'post',
    data: query
  })
}

import request from '@/utils/request'

// 查询企业基本信息列表
export function listIntroduction(query) {
  return request({
    url: '/Introduction/Introduction/list',
    method: 'post',
    data: query
  })
}

// 查询企业基本信息数量
export function countIntroduction(query) {
  return request({
    url: '/Introduction/Introduction/count',
    method: 'post',
    data: query
  })
}

// 查询企业基本信息详细
export function getIntroduction(id) {
  return request({
    url: '/Introduction/Introduction/' + id,
    method: 'get'
  })
}

// 新增企业基本信息
export function addIntroduction(data) {
  return request({
    url: '/Introduction/Introduction',
    method: 'post',
    data: data
  })
}

// 修改企业基本信息
export function updateIntroduction(data) {
  return request({
    url: '/Introduction/Introduction',
    method: 'put',
    data: data
  })
}

// 删除企业基本信息
export function delIntroduction(id) {
  return request({
    url: '/Introduction/Introduction/' + id,
    method: 'delete'
  })
}

// 导出企业基本信息
export function exportIntroduction(query) {
  return request({
    url: '/Introduction/Introduction/export',
    method: 'post',
    data: query
  })
}

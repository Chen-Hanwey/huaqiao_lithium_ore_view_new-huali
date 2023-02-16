import request from '@/utils/request'

// 查询食安指数扣分明细列表
export function listScoreDetail(query) {
  return request({
    url: '/sazs/scoreDetail/list',
    method: 'post',
    data: query
  })
}

// 查询食安指数扣分明细数量
export function countScoreDetail(query) {
  return request({
    url: '/sazs/scoreDetail/count',
    method: 'post',
    data: query
  })
}

// 查询食安指数扣分明细详细
export function getScoreDetail(id) {
  return request({
    url: '/sazs/scoreDetail/' + id,
    method: 'get'
  })
}

// 新增食安指数扣分明细
export function addScoreDetail(data) {
  return request({
    url: '/sazs/scoreDetail',
    method: 'post',
    data: data
  })
}

// 修改食安指数扣分明细
export function updateScoreDetail(data) {
  return request({
    url: '/sazs/scoreDetail',
    method: 'put',
    data: data
  })
}

// 删除食安指数扣分明细
export function delScoreDetail(id) {
  return request({
    url: '/sazs/scoreDetail/' + id,
    method: 'delete'
  })
}

// 导出食安指数扣分明细
export function exportScoreDetail(query) {
  return request({
    url: '/sazs/scoreDetail/export',
    method: 'post',
    data: query
  })
}

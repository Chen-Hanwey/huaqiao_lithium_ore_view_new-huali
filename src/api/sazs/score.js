import request from '@/utils/request'

// 查询食安指数得分列表
export function listScore(query) {
  return request({
    url: '/sazs/score/list',
    method: 'post',
    data: query
  })
}

// 查询食安指数得分数量
export function countScore(query) {
  return request({
    url: '/sazs/score/count',
    method: 'post',
    data: query
  })
}

// 查询食安指数得分详细
export function getScore(id) {
  return request({
    url: '/sazs/score/' + id,
    method: 'get'
  })
}

// 新增食安指数得分
export function addScore(data) {
  return request({
    url: '/sazs/score',
    method: 'post',
    data: data
  })
}

// 修改食安指数得分
export function updateScore(data) {
  return request({
    url: '/sazs/score',
    method: 'put',
    data: data
  })
}

// 删除食安指数得分
export function delScore(id) {
  return request({
    url: '/sazs/score/' + id,
    method: 'delete'
  })
}

// 导出食安指数得分
export function exportScore(query) {
  return request({
    url: '/sazs/score/export',
    method: 'post',
    data: query
  })
}

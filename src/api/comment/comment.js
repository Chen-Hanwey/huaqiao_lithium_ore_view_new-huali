import request from '@/utils/request'

// 查询评论管理列表
export function listComment(query) {
  return request({
    url: '/common/comment/list',
    method: 'post',
    data: query
  })
}

// 查询评论管理数量
export function countComment(query) {
  return request({
    url: '/common/comment/count',
    method: 'post',
    data: query
  })
}

// 查询评论管理详细
export function getComment(id) {
  return request({
    url: '/common/comment/' + id,
    method: 'get'
  })
}

// 新增评论管理
export function addComment(data) {
  return request({
    url: '/common/comment',
    method: 'post',
    data: data
  })
}

// 修改评论管理
export function updateComment(data) {
  return request({
    url: '/common/comment',
    method: 'put',
    data: data
  })
}

// 删除评论管理
export function delComment(id) {
  return request({
    url: '/common/comment/' + id,
    method: 'delete'
  })
}

// 导出评论管理
export function exportComment(query) {
  return request({
    url: '/common/comment/export',
    method: 'post',
    data: query
  })
}

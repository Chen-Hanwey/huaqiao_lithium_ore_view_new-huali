import request from '@/utils/request'

// 查询在线培训列表
export function listTrain(query) {
  return request({
    url: '/train/train/list',
    method: 'post',
    data: query
  })
}

// 查询在线培训数量
export function countTrain(query) {
  return request({
    url: '/train/train/count',
    method: 'post',
    data: query
  })
}

// 查询在线培训详细
export function getTrain(id) {
  return request({
    url: '/train/train/' + id,
    method: 'get'
  })
}

// 新增在线培训
export function addTrain(data) {
  return request({
    url: '/train/train',
    method: 'post',
    data: data
  })
}

// 修改在线培训
export function updateTrain(data) {
  return request({
    url: '/train/train',
    method: 'put',
    data: data
  })
}

// 删除在线培训
export function delTrain(id) {
  return request({
    url: '/train/train/' + id,
    method: 'delete'
  })
}

// 导出在线培训
export function exportTrain(query) {
  return request({
    url: '/train/train/export',
    method: 'post',
    data: query
  })
}

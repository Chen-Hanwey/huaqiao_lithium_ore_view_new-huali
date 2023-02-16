import request from '@/utils/request'

// 查询考试管理列表
export function listExam(query) {
  return request({
    url: '/check/check/list',
    method: 'post',
    data: query
  })
}

// 查询考试管理详细
export function getExam(id) {
  return request({
    url: '/check/check/' + id,
    method: 'get'
  })
}

// 新增考试管理
export function addExam(data) {
  return request({
    url: '/check/check',
    method: 'post',
    data: data
  })
}

// 修改考试管理
export function updateExam(data) {
  return request({
    url: '/check/check',
    method: 'put',
    data: data
  })
}

// 删除考试管理
export function delExam(id) {
  return request({
    url: '/check/check/' + id,
    method: 'delete'
  })
}

// 导出考试管理
export function exportExam(query) {
  return request({
    url: '/check/check/export',
    method: 'post',
    data: query
  })
}

// 导出考试统计结果
export function exportStatistics(query) {
  return request({
    url: '/check/check/exportStatistics',
    method: 'post',
    data: query
  })
}

export function statistic(id) {
  return request({
    url: '/check/check/statistic/' + id,
    method: 'get'
  })
}

export function statisticHistory(data) {
  return request({
    url: '/check/check/statistic',
    method: 'post',
    data: data
  })
}


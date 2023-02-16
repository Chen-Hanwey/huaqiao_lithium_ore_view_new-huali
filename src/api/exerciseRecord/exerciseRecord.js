import request from '@/utils/request'

// 查询演练记录信息列表
export function listExerciseRecord(query) {
  return request({
    url: '/exerciseRecord/exerciseRecord/list',
    method: 'post',
    data: query
  })
}

// 查询演练记录信息数量
export function countExerciseRecord(query) {
  return request({
    url: '/exerciseRecord/exerciseRecord/count',
    method: 'post',
    data: query
  })
}

// 查询演练记录信息详细
export function getExerciseRecord(id) {
  return request({
    url: '/exerciseRecord/exerciseRecord/' + id,
    method: 'get'
  })
}

// 新增演练记录信息
export function addExerciseRecord(data) {
  return request({
    url: '/exerciseRecord/exerciseRecord',
    method: 'post',
    data: data
  })
}

// 修改演练记录信息
export function updateExerciseRecord(data) {
  return request({
    url: '/exerciseRecord/exerciseRecord',
    method: 'put',
    data: data
  })
}

// 删除演练记录信息
export function delExerciseRecord(id) {
  return request({
    url: '/exerciseRecord/exerciseRecord/' + id,
    method: 'delete'
  })
}

// 导出演练记录信息
export function exportExerciseRecord(query) {
  return request({
    url: '/exerciseRecord/exerciseRecord/export',
    method: 'post',
    data: query
  })
}

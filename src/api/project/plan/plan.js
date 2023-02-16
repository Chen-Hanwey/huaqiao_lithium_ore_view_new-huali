import request from '@/utils/request'

// 查询开采计划列表
export function listPlan(query) {
  return request({
    url: '/plan/plan/list',
    method: 'post',
    data: query
  })
}

// 查询开采计划数量
export function countPlan(query) {
  return request({
    url: '/plan/plan/count',
    method: 'post',
    data: query
  })
}

// 查询开采计划详细
export function getPlan(id) {
  return request({
    url: '/plan/plan/' + id,
    method: 'get'
  })
}

// 新增开采计划
export function addPlan(data) {
  return request({
    url: '/plan/plan',
    method: 'post',
    data: data
  })
}

// 修改开采计划
export function updatePlan(data) {
  return request({
    url: '/plan/plan',
    method: 'put',
    data: data
  })
}

// 删除开采计划
export function delPlan(id) {
  return request({
    url: '/plan/plan/' + id,
    method: 'delete'
  })
}

// 导出开采计划
export function exportPlan(query) {
  return request({
    url: '/plan/plan/export',
    method: 'post',
    data: query
  })
}

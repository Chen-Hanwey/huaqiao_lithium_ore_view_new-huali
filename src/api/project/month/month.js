import request from '@/utils/request'

// 查询月度计划列表
export function listMonth(query) {
  return request({
    url: '/month/month/list',
    method: 'post',
    data: query
  })
}

// 查询月度计划数量
export function countMonth(query) {
  return request({
    url: '/month/month/count',
    method: 'post',
    data: query
  })
}

// 查询月度计划详细
export function getMonth(id) {
  return request({
    url: '/month/month/' + id,
    method: 'get'
  })
}

// 新增月度计划
export function addMonth(data) {
  return request({
    url: '/month/month',
    method: 'post',
    data: data
  })
}

// 修改月度计划
export function updateMonth(data) {
  return request({
    url: '/month/month',
    method: 'put',
    data: data
  })
}

// 删除月度计划
export function delMonth(id) {
  return request({
    url: '/month/month/' + id,
    method: 'delete'
  })
}

// 导出月度计划
export function exportMonth(query) {
  return request({
    url: '/month/month/export',
    method: 'post',
    data: query
  })
}

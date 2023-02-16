import request from '@/utils/request'

// 查询消杀记录列表
export function listKillProcessSupervise(query) {
  return request({
    url: '/killProcessSupervise/killProcessSupervise/list',
    method: 'post',
    data: query
  })
}

// 查询消杀记录数量
export function countKillProcessSupervise(query) {
  return request({
    url: '/killProcessSupervise/killProcessSupervise/count',
    method: 'post',
    data: query
  })
}

// 查询消杀记录详细
export function getKillProcessSupervise(id) {
  return request({
    url: '/killProcessSupervise/killProcessSupervise/' + id,
    method: 'get'
  })
}

// 新增消杀记录
export function addKillProcessSupervise(data) {
  return request({
    url: '/killProcessSupervise/killProcessSupervise',
    method: 'post',
    data: data
  })
}

// 修改消杀记录
export function updateKillProcessSupervise(data) {
  return request({
    url: '/killProcessSupervise/killProcessSupervise',
    method: 'put',
    data: data
  })
}

// 删除消杀记录
export function delKillProcessSupervise(id) {
  return request({
    url: '/killProcessSupervise/killProcessSupervise/' + id,
    method: 'delete'
  })
}

// 导出消杀记录
export function exportKillProcessSupervise(query) {
  return request({
    url: '/killProcessSupervise/killProcessSupervise/export',
    method: 'post',
    data: query
  })
}

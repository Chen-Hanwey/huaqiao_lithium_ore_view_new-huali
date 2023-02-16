import request from '@/utils/request'

// 查询食材检测信息列表
export function listFoodInspection(query) {
  return request({
    url: '/foodInspection/foodInspection/list',
    method: 'post',
    data: query
  })
}

// 查询食材检测信息数量
export function countFoodInspection(query) {
  return request({
    url: '/foodInspection/foodInspection/count',
    method: 'post',
    data: query
  })
}

// 查询食材检测信息详细
export function getFoodInspection(id) {
  return request({
    url: '/foodInspection/foodInspection/' + id,
    method: 'get'
  })
}

// 新增食材检测信息
export function addFoodInspection(data) {
  return request({
    url: '/foodInspection/foodInspection',
    method: 'post',
    data: data
  })
}

// 修改食材检测信息
export function updateFoodInspection(data) {
  return request({
    url: '/foodInspection/foodInspection',
    method: 'put',
    data: data
  })
}

// 删除食材检测信息
export function delFoodInspection(id) {
  return request({
    url: '/foodInspection/foodInspection/' + id,
    method: 'delete'
  })
}

// 导出食材检测信息
export function exportFoodInspection(query) {
  return request({
    url: '/foodInspection/foodInspection/export',
    method: 'post',
    data: query
  })
}

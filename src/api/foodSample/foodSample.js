import request from '@/utils/request'

// 查询产品(菜品)留样列表
export function listFoodSample(query) {
  return request({
    url: '/foodSample/foodSample/list',
    method: 'post',
    data: query
  })
}

// 查询产品(菜品)留样数量
export function countFoodSample(query) {
  return request({
    url: '/foodSample/foodSample/count',
    method: 'post',
    data: query
  })
}

// 查询产品(菜品)留样详细
export function getFoodSample(id) {
  return request({
    url: '/foodSample/foodSample/' + id,
    method: 'get'
  })
}

// 新增产品(菜品)留样
export function addFoodSample(data) {
  return request({
    url: '/foodSample/foodSample',
    method: 'post',
    data: data
  })
}

// 修改产品(菜品)留样
export function updateFoodSample(data) {
  return request({
    url: '/foodSample/foodSample',
    method: 'put',
    data: data
  })
}

// 删除产品(菜品)留样
export function delFoodSample(id) {
  return request({
    url: '/foodSample/foodSample/' + id,
    method: 'delete'
  })
}

// 导出产品(菜品)留样
export function exportFoodSample(query) {
  return request({
    url: '/foodSample/foodSample/export',
    method: 'post',
    data: query
  })
}

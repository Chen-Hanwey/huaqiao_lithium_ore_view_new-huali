import request from '@/utils/request'

// 查询菜品管理列表
export function listDishesInfo(query) {
  return request({
    url: '/dishesInfo/dishesInfo/list',
    method: 'post',
    data: query
  })
}

// 查询菜品管理数量
export function countDishesInfo(query) {
  return request({
    url: '/dishesInfo/dishesInfo/count',
    method: 'post',
    data: query
  })
}

// 查询菜品管理详细
export function getDishesInfo(id) {
  return request({
    url: '/dishesInfo/dishesInfo/' + id,
    method: 'get'
  })
}

// 新增菜品管理
export function addDishesInfo(data) {
  return request({
    url: '/dishesInfo/dishesInfo',
    method: 'post',
    data: data
  })
}

// 修改菜品管理
export function updateDishesInfo(data) {
  return request({
    url: '/dishesInfo/dishesInfo',
    method: 'put',
    data: data
  })
}

// 删除菜品管理
export function delDishesInfo(id) {
  return request({
    url: '/dishesInfo/dishesInfo/' + id,
    method: 'delete'
  })
}

// 导出菜品管理
export function exportDishesInfo(query) {
  return request({
    url: '/dishesInfo/dishesInfo/export',
    method: 'post',
    data: query
  })
}

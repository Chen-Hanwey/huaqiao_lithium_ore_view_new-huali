import request from '@/utils/request'

// 查询产品(菜品)留样单品列表
export function listFoodSampleItem(query) {
  return request({
    url: '/foodSampleItem/foodSampleItem/list',
    method: 'post',
    data: query
  })
}

// 查询产品(菜品)留样单品列表,按名称不重样作为陪餐的菜单选项
export function listFoodSampleItemDistinct(query) {
  return request({
    url: '/foodSampleItem/foodSampleItem/listDistinct',
    method: 'post',
    data: query
  })
}

// 查询产品(菜品)留样单品数量
export function countFoodSampleItem(query) {
  return request({
    url: '/foodSampleItem/foodSampleItem/count',
    method: 'post',
    data: query
  })
}

// 查询产品(菜品)留样单品详细
export function getFoodSampleItem(id) {
  return request({
    url: '/foodSampleItem/foodSampleItem/' + id,
    method: 'get'
  })
}

// 新增产品(菜品)留样单品
export function addFoodSampleItem(data) {
  return request({
    url: '/foodSampleItem/foodSampleItem',
    method: 'post',
    data: data
  })
}

// 修改产品(菜品)留样单品
export function updateFoodSampleItem(data) {
  return request({
    url: '/foodSampleItem/foodSampleItem',
    method: 'put',
    data: data
  })
}

// 删除产品(菜品)留样单品
export function delFoodSampleItem(id) {
  return request({
    url: '/foodSampleItem/foodSampleItem/' + id,
    method: 'delete'
  })
}

// 导出产品(菜品)留样单品
export function exportFoodSampleItem(query) {
  return request({
    url: '/foodSampleItem/foodSampleItem/export',
    method: 'post',
    data: query
  })
}

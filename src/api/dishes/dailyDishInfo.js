import request from '@/utils/request'

// 查询每日菜品列表
export function listDailyDishInfo(query) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo/list',
    method: 'post',
    data: query
  })
}

export function listSample(query) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo/listSample',
    method: 'post',
    data: query
  })
}

// 查询每日菜品数量
export function countDailyDishInfo(query) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo/count',
    method: 'post',
    data: query
  })
}

// 查询每日菜品详细
export function getDailyDishInfo(id) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo/' + id,
    method: 'get'
  })
}

// 查询每日菜品详细
export function getDailyDishQrCode(id) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo/qrCode',
    method: 'get',
    params: {id:id}
  })
}

// 新增每日菜品
export function addDailyDishInfo(data) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo',
    method: 'post',
    data: data
  })
}

// 修改每日菜品
export function updateDailyDishInfo(data) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo',
    method: 'put',
    data: data
  })
}

// 删除每日菜品
export function delDailyDishInfo(id) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo/' + id,
    method: 'delete'
  })
}

// 导出每日菜品
export function exportDailyDishInfo(query) {
  return request({
    url: '/dailyDishInfo/dailyDishInfo/export',
    method: 'post',
    data: query
  })
}

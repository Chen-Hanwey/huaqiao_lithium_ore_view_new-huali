import request from '@/utils/request'

// 查询天气预报列表
export function listWeather (query) {
  return request({
    url: '/weather/weather/list',
    method: 'post',
    data: query
  })
}

// 查询天气预报数量
export function countWeather (query) {
  return request({
    url: '/weather/weather/count',
    method: 'post',
    data: query
  })
}

// 查询天气预报详细
export function getWeather (id) {
  return request({
    url: '/weather/weather/' + id,
    method: 'get'
  })
}

// 新增天气预报
export function addWeather (data) {
  return request({
    url: '/weather/weather',
    method: 'post',
    data: data
  })
}

// 修改天气预报
export function updateWeather (data) {
  return request({
    url: '/weather/weather',
    method: 'put',
    data: data
  })
}

// 删除天气预报
export function delWeather (id) {
  return request({
    url: '/weather/weather/' + id,
    method: 'delete'
  })
}

// 导出天气预报
export function exportWeather (query) {
  return request({
    url: '/weather/weather/export',
    method: 'post',
    data: query
  })
}

// 手动执行定时任务
export function importWeather () {
  return request({
    url: '/weather/weather/importWeather',
    method: 'get'
  })
}
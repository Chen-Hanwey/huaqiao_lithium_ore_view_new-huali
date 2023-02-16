import request from '@/utils/request'

// 查询食安指数配置列表
export function listConfig(query) {
  return request({
    url: '/sazs/config/list',
    method: 'post',
    data: query
  })
}

//获取配置项
export function getConfigs() {
  return request({
    url: '/sazs/config/configs',
    method: 'get'
  })
}


// 修改食安指数配置
export function updateConfigs(data) {
  return request({
    url: '/sazs/config/configs',
    method: 'put',
    data: data
  })
}


// 查询食安指数配置数量
export function countConfig(query) {
  return request({
    url: '/sazs/config/count',
    method: 'post',
    data: query
  })
}

// 查询食安指数配置详细
export function getConfig(id) {
  return request({
    url: '/sazs/config/' + id,
    method: 'get'
  })
}

// 新增食安指数配置
export function addConfig(data) {
  return request({
    url: '/sazs/config',
    method: 'post',
    data: data
  })
}

// 修改食安指数配置
export function updateConfig(data) {
  return request({
    url: '/sazs/config',
    method: 'put',
    data: data
  })
}

// 删除食安指数配置
export function delConfig(id) {
  return request({
    url: '/sazs/config/' + id,
    method: 'delete'
  })
}

// 导出食安指数配置
export function exportConfig(query) {
  return request({
    url: '/sazs/config/export',
    method: 'post',
    data: query
  })
}

import request from '@/utils/request'

// 查询矿山产量列表
export function listProduction (query) {
  return request({
    url: '/production/production/list',
    method: 'post',
    data: query
  })
}

// 查询矿山产量数量
export function countProduction (query) {
  return request({
    url: '/production/production/count',
    method: 'post',
    data: query
  })
}

// 查询矿山产量详细
export function getProduction (id) {
  return request({
    url: '/production/production/' + id,
    method: 'get'
  })
}

// 新增矿山产量
export function addProduction (data) {
  return request({
    url: '/production/production',
    method: 'post',
    data: data
  })
}

// 修改矿山产量
export function updateProduction (data) {
  return request({
    url: '/production/production',
    method: 'put',
    data: data
  })
}

// 删除矿山产量
export function delProduction (id) {
  return request({
    url: '/production/production/' + id,
    method: 'delete'
  })
}

// 导出矿山产量
export function exportProduction (query) {
  return request({
    url: '/production/production/export',
    method: 'post',
    data: query
  })
}
// 查询矿山产量月产量
export function getSummonth () {
  return request({
    url: '/production/production/summonth',
    method: 'get'
  })
}
// 查询矿山产量日产量
export function getSumday () {
  return request({
    url: '/production/production/sumday',
    method: 'get'
  })
}

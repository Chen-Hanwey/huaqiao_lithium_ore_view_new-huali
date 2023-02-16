import request from '@/utils/request'

// 查询App版本控制列表
export function listAppVersions(query) {
  return request({
    url: '/system/appVersions/list',
    method: 'get',
    params: query
  })
}

// 查询App版本控制详细
export function getAppVersions(id) {
  return request({
    url: '/system/appVersions/' + id,
    method: 'get'
  })
}

// 新增App版本控制
export function addAppVersions(data) {
  return request({
    url: '/system/appVersions',
    method: 'post',
    data: data
  })
}

// 修改App版本控制
export function updateAppVersions(data) {
  return request({
    url: '/system/appVersions',
    method: 'put',
    data: data
  })
}

// 删除App版本控制
export function delAppVersions(id) {
  return request({
    url: '/system/appVersions/' + id,
    method: 'delete'
  })
}

// 导出App版本控制
export function exportAppVersions(query) {
  return request({
    url: '/system/appVersions/export',
    method: 'get',
    params: query
  })
}

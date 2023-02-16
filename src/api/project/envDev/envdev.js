import request from '@/utils/request'


// 查询环境监测设备信息列表
export function listEnvdev(query) {
  return request({
    url: '/project/envdev/list',
    method: 'get',
    params: query
  })
}
export function allListEnvdev(query) {
  return request({
    url: '/project/envdev/allList',
    method: 'get',
    params: query
  })
}
// 查询环境监测设备信息详细
export function getEnvdev(devId) {
  return request({
    url: '/project/envdev/' + devId,
    method: 'get'
  })
}

// 新增环境监测设备信息
export function addEnvdev(data) {
  return request({
    url: '/project/envdev',
    method: 'post',
    data: data
  })
}

// 修改环境监测设备信息
export function updateEnvdev(data) {
  return request({
    url: '/project/envdev',
    method: 'put',
    data: data
  })
}

// 删除环境监测设备信息
export function delEnvdev(devId) {
  return request({
    url: '/project/envdev/' + devId,
    method: 'delete'
  })
}

// 导出环境监测设备信息
export function exportEnvdev(query) {
  return request({
    url: '/project/envdev/export',
    method: 'get',
    params: query
  })
}

export function tree(query) {
  return request({
    url: '/project/envdev/tree',
    method: 'get',
    params: query
  })
}

export function listEnvRecord(query) {
  return request({
    url: '/project/record/list',
    method: 'get',
    params: query
  })
}

// 查询环境监测设备信息详细
export function getEnvRecord(id) {
  return request({
    url: '/project/record/' + id,
    method: 'get'
  })
}

// 导出环境监测设备信息
export function exportEnvRecord(query) {
  return request({
    url: '/project/record/export',
    method: 'get',
    params: query
  })
}

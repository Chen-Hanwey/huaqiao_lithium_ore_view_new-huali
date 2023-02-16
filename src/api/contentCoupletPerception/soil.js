import request from '@/utils/request'

// 查询物联感知设备列表
export function listDetails (query) {
  return request({
    url: '/soil/monitor/list',
    method: 'get',
    params: query
  })
}

// 获取环境监测设备树
export function getEnvDevicTree(query) {
  return request({
    url:'/soil/monitor/getEnvDevicTree',
    method: 'get',
    params: query
  })
}

// 查询物联感知设备列表
export function getProductList () {
  return request({
    url: '/soil/monitor/getProductList',
    method: 'get',
  })
}

// 查询物联感知设备详细
export function getDetails (id) {
  return request({
    url: '/soil/monitor/' + id,
    method: 'get'
  })
}

// 新增物联感知设备
export function addDetails (data) {
  return request({
    url: '/soil/monitor',
    method: 'post',
    data: data
  })
}

// 修改物联感知设备
export function updateDetails (data) {
  return request({
    url: '/soil/monitor',
    method: 'put',
    data: data
  })
}

// 删除物联感知设备
export function delDetails (id) {
  return request({
    url: '/soil/monitor/' + id,
    method: 'delete'
  })
}

// 导出物联感知设备
export function exportDetails (query) {
  return request({
    url: '/soil/monitor/export',
    method: 'get',
    params: query
  })
}

export function listDeviceProperty (query) {
  return request({
    url: '/soil/monitor/devicePropertyList',
    method: 'get',
    params: query
  })
}

export function devicePropertyHistory (query) {
  return request({
    url: '/soil/monitor/devicePropertyHistory',
    method: 'get',
    params: query
  })
}


export function environmentList (query) {
  return request({
    url: '/soil/monitor/environmentList',
    method: 'get',
    params: query
  })
}

export function selectUser () {
  return request({
    url: '/soil/monitor/selectUser',
    method: 'get'
  })
}
//查询平均值
export function historyAvgList (query) {
  return request({
    url: '/environmentmonitor/history/avgList',
    method: 'get',
    params: query
  })
}

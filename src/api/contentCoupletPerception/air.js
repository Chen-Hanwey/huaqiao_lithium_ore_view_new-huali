import request from '@/utils/request'
// 查询物联感知设备列表
export function listDetails (query) {
  return request({
    url: '/environmentmonitor/air/list',
    method: 'get',
    params: query
  })
}

// 查询物联感知设备详细
export function getDetails (id) {
  return request({
    url: '/environmentmonitor/air/' + id,
    method: 'get'
  })
}

// 新增物联感知设备
export function addDetails (data) {
  return request({
    url: '/environmentmonitor/air',
    method: 'post',
    data: data
  })
}

// 修改物联感知设备
export function updateDetails (data) {
  return request({
    url: '/environmentmonitor/air',
    method: 'put',
    data: data
  })
}

// 删除物联感知设备
export function delDetails (id) {
  return request({
    url: '/environmentmonitor/air/' + id,
    method: 'delete'
  })
}

// 导出物联感知设备
export function exportDetails (query) {
  return request({
    url: '/environmentmonitor/air',
    method: 'get',
    params: query
  })
}

export function listDeviceProperty (query) {
  return request({
    url: '/environmentmonitor/air/devicePropertyList',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: '/environmentmonitor/history/list',
    method: 'get',
    params: query
  })
}

// 校验环境监测配置
export function checkConfigure() {
  return request({
    url: '/environmentmonitor/air/checkConfigure',
    method: 'get',
  })
}

// 获取环境监测设备树
export function getEnvDevicTree(query) {
  return request({
    url:'/environmentmonitor/air/getEnvDevicTree',
    method: 'get',
    params: query
  })
}

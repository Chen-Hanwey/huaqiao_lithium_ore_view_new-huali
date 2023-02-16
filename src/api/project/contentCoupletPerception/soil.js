import request from '@/utils/request'
import { Router_smart_town_admin } from '@/utils/serviceUrlRouter'

// 查询物联感知设备列表
export function listDetails (query) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/list',
    method: 'get',
    params: query
  })
}

// 获取环境监测设备树
export function getEnvDevicTree(query) {
  return request({
    url:Router_smart_town_admin()+ '/vid/tree/getEnvDevicTree',
    method: 'get',
    params: query
  })
}

// 查询物联感知设备列表
export function getProductList () {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/getProductList',
    method: 'get',
  })
}

// 查询物联感知设备详细
export function getDetails (id) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/' + id,
    method: 'get'
  })
}

// 新增物联感知设备
export function addDetails (data) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor',
    method: 'post',
    data: data
  })
}

// 修改物联感知设备
export function updateDetails (data) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor',
    method: 'put',
    data: data
  })
}

// 删除物联感知设备
export function delDetails (id) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/' + id,
    method: 'delete'
  })
}

// 导出物联感知设备
export function exportDetails (query) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/export',
    method: 'get',
    params: query
  })
}

export function listDeviceProperty (query) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/devicePropertyList',
    method: 'get',
    params: query
  })
}

export function devicePropertyHistory (query) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/devicePropertyHistory',
    method: 'get',
    params: query
  })
}


export function environmentList (query) {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/environmentList',
    method: 'get',
    params: query
  })
}

export function selectUser () {
  return request({
    url: Router_smart_town_admin() + '/soil/monitor/selectUser',
    method: 'get'
  })
}
//查询平均值
export function historyAvgList (query) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/history/avgList',
    method: 'get',
    params: query
  })
}

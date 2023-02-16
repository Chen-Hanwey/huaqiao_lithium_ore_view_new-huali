import request from '@/utils/request'
import { Router_smart_town_admin } from '@/utils/serviceUrlRouter'
// 查询物联感知设备列表
export function listDetails (query) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/air/list',
    method: 'get',
    params: query
  })
}

// 查询物联感知设备详细
export function getDetails (id) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/air/' + id,
    method: 'get'
  })
}

// 新增物联感知设备
export function addDetails (data) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/air',
    method: 'post',
    data: data
  })
}

// 修改物联感知设备
export function updateDetails (data) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/air',
    method: 'put',
    data: data
  })
}

// 删除物联感知设备
export function delDetails (id) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/air/' + id,
    method: 'delete'
  })
}

// 导出物联感知设备
export function exportDetails (query) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/air',
    method: 'get',
    params: query
  })
}

export function listDeviceProperty (query) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/air/devicePropertyList',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: Router_smart_town_admin()+'/environmentmonitor/history/list',
    method: 'get',
    params: query
  })
}

// 校验环境监测配置
export function checkConfigure() {
  return request({
    url: Router_smart_town_admin() +'/environmentmonitor/air/checkConfigure',
    method: 'get',
  })
}

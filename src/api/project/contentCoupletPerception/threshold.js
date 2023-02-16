import request from '@/utils/request'
import { Router_smart_town_admin } from '@/utils/serviceUrlRouter'
// 查询阈值设置列表
export function listThreshold(query) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/threshold/list',
    method: 'get',
    params: query
  })
}

// 查询阈值设置详细
export function getThreshold(devName) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/threshold/' + devName,
    method: 'get'
  })
}
export function selectOneByType(devType) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/threshold/selectOneByType/' + devType,
    method: 'get'
  })
}


// 新增阈值设置
export function addThreshold(data) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/threshold',
    method: 'post',
    data: data
  })
}

// 修改阈值设置
export function updateThreshold(data) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/threshold',
    method: 'put',
    data: data
  })
}

// 删除阈值设置
export function delThreshold(id) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/threshold/' + id,
    method: 'delete'
  })
}

// 导出阈值设置
export function exportThreshold(query) {
  return request({
    url: Router_smart_town_admin() + '/environmentmonitor/threshold/export',
    method: 'get',
    params: query
  })
}

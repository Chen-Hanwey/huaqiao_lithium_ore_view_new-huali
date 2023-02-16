import request from '@/utils/request'

// 查询监控设备离线主体列上报接口列表
export function listOfflineOrgReport(query) {
  return request({
    url: '/offlineOrgReport/offlineOrgReport/list',
    method: 'post',
    data: query
  })
}

// 查询监控设备离线主体列上报接口数量
export function countOfflineOrgReport(query) {
  return request({
    url: '/offlineOrgReport/offlineOrgReport/count',
    method: 'post',
    data: query
  })
}

// 查询监控设备离线主体列上报接口详细
export function getOfflineOrgReport(id) {
  return request({
    url: '/offlineOrgReport/offlineOrgReport/' + id,
    method: 'get'
  })
}

// 新增监控设备离线主体列上报接口
export function addOfflineOrgReport(data) {
  return request({
    url: '/offlineOrgReport/offlineOrgReport',
    method: 'post',
    data: data
  })
}

// 修改监控设备离线主体列上报接口
export function updateOfflineOrgReport(data) {
  return request({
    url: '/offlineOrgReport/offlineOrgReport',
    method: 'put',
    data: data
  })
}

// 删除监控设备离线主体列上报接口
export function delOfflineOrgReport(id) {
  return request({
    url: '/offlineOrgReport/offlineOrgReport/' + id,
    method: 'delete'
  })
}

// 导出监控设备离线主体列上报接口
export function exportOfflineOrgReport(query) {
  return request({
    url: '/offlineOrgReport/offlineOrgReport/export',
    method: 'post',
    data: query
  })
}

// 同步
export function offlineOrgReport(id) {
  return request({
    url: '/zsareport/api/monitor/offlineOrgReport/' + id,
    method: 'post'
  })
}

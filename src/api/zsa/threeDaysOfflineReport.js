import request from '@/utils/request'

// 查询监控设备离线连续三天上报接口(T+1. 上报)列表
export function listThreeDaysOfflineReport(query) {
  return request({
    url: '/threeDaysOfflineReport/threeDaysOfflineReport/list',
    method: 'post',
    data: query
  })
}

// 查询监控设备离线连续三天上报接口(T+1. 上报)数量
export function countThreeDaysOfflineReport(query) {
  return request({
    url: '/threeDaysOfflineReport/threeDaysOfflineReport/count',
    method: 'post',
    data: query
  })
}

// 查询监控设备离线连续三天上报接口(T+1. 上报)详细
export function getThreeDaysOfflineReport(id) {
  return request({
    url: '/threeDaysOfflineReport/threeDaysOfflineReport/' + id,
    method: 'get'
  })
}

// 新增监控设备离线连续三天上报接口(T+1. 上报)
export function addThreeDaysOfflineReport(data) {
  return request({
    url: '/threeDaysOfflineReport/threeDaysOfflineReport',
    method: 'post',
    data: data
  })
}

// 修改监控设备离线连续三天上报接口(T+1. 上报)
export function updateThreeDaysOfflineReport(data) {
  return request({
    url: '/threeDaysOfflineReport/threeDaysOfflineReport',
    method: 'put',
    data: data
  })
}

// 删除监控设备离线连续三天上报接口(T+1. 上报)
export function delThreeDaysOfflineReport(id) {
  return request({
    url: '/threeDaysOfflineReport/threeDaysOfflineReport/' + id,
    method: 'delete'
  })
}

// 导出监控设备离线连续三天上报接口(T+1. 上报)
export function exportThreeDaysOfflineReport(query) {
  return request({
    url: '/threeDaysOfflineReport/threeDaysOfflineReport/export',
    method: 'post',
    data: query
  })
}

// 同步
export function threeDaysOfflineReport(id) {
  return request({
    url: '/zsareport/api/monitor/threeDaysOfflineReport/' + id,
    method: 'post'
  })
}

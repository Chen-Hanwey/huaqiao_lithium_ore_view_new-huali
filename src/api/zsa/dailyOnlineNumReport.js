import request from '@/utils/request'

// 查询监控设备在线情况上报接口列表
export function listDailyOnlineNumReport(query) {
  return request({
    url: '/dailyOnlineNumReport/dailyOnlineNumReport/list',
    method: 'post',
    data: query
  })
}

// 查询监控设备在线情况上报接口数量
export function countDailyOnlineNumReport(query) {
  return request({
    url: '/dailyOnlineNumReport/dailyOnlineNumReport/count',
    method: 'post',
    data: query
  })
}

// 查询监控设备在线情况上报接口详细
export function getDailyOnlineNumReport(id) {
  return request({
    url: '/dailyOnlineNumReport/dailyOnlineNumReport/' + id,
    method: 'get'
  })
}

// 新增监控设备在线情况上报接口
export function addDailyOnlineNumReport(data) {
  return request({
    url: '/dailyOnlineNumReport/dailyOnlineNumReport',
    method: 'post',
    data: data
  })
}

// 修改监控设备在线情况上报接口
export function updateDailyOnlineNumReport(data) {
  return request({
    url: '/dailyOnlineNumReport/dailyOnlineNumReport',
    method: 'put',
    data: data
  })
}

// 删除监控设备在线情况上报接口
export function delDailyOnlineNumReport(id) {
  return request({
    url: '/dailyOnlineNumReport/dailyOnlineNumReport/' + id,
    method: 'delete'
  })
}

// 导出监控设备在线情况上报接口
export function exportDailyOnlineNumReport(query) {
  return request({
    url: '/dailyOnlineNumReport/dailyOnlineNumReport/export',
    method: 'post',
    data: query
  })
}

// 同步
export function dailyOnlineNumReport(id) {
  return request({
    url: '/zsareport/api/monitor/dailyOnlineNumReport/' + id,
    method: 'post'
  })
}
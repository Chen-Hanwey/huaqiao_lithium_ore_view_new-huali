import request from '@/utils/request'

// 查询视频故障数据上报列表
export function listInsertMonitorReport(query) {
  return request({
    url: '/insertMonitorReport/insertMonitorReport/list',
    method: 'post',
    data: query
  })
}

// 查询视频故障数据上报数量
export function countInsertMonitorReport(query) {
  return request({
    url: '/insertMonitorReport/insertMonitorReport/count',
    method: 'post',
    data: query
  })
}

// 查询视频故障数据上报详细
export function getInsertMonitorReport(id) {
  return request({
    url: '/insertMonitorReport/insertMonitorReport/' + id,
    method: 'get'
  })
}

// 新增视频故障数据上报
export function addInsertMonitorReport(data) {
  return request({
    url: '/insertMonitorReport/insertMonitorReport',
    method: 'post',
    data: data
  })
}

// 修改视频故障数据上报
export function updateInsertMonitorReport(data) {
  return request({
    url: '/insertMonitorReport/insertMonitorReport',
    method: 'put',
    data: data
  })
}

// 删除视频故障数据上报
export function delInsertMonitorReport(id) {
  return request({
    url: '/insertMonitorReport/insertMonitorReport/' + id,
    method: 'delete'
  })
}

// 导出视频故障数据上报
export function exportInsertMonitorReport(query) {
  return request({
    url: '/insertMonitorReport/insertMonitorReport/export',
    method: 'post',
    data: query
  })
}

// 同步
export function insertMonitorReport(id) {
  return request({
    url: '/zsareport/api/ai/insertMessageDataFk/' + id,
    method: 'post'
  })
}

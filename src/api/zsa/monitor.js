import request from '@/utils/request'

// 查询主体视频设备列表
export function listMonitor(query) {
  return request({
    url: '/place/monitor/list',
    method: 'post',
    data: query
  })
}

// 查询主体视频设备数量
export function countMonitor(query) {
  return request({
    url: '/place/monitor/count',
    method: 'post',
    data: query
  })
}

// 查询主体视频设备详细
export function getMonitor(id) {
  return request({
    url: '/place/monitor/' + id,
    method: 'get'
  })
}

// 新增主体视频设备
export function addMonitor(data) {
  return request({
    url: '/place/monitor',
    method: 'post',
    data: data
  })
}

// 修改主体视频设备
export function updateMonitor(data) {
  return request({
    url: '/place/monitor',
    method: 'put',
    data: data
  })
}

// 删除主体视频设备
export function delMonitor(id) {
  return request({
    url: '/place/monitor/' + id,
    method: 'delete'
  })
}

// 导出主体视频设备
export function exportMonitor(query) {
  return request({
    url: '/place/monitor/export',
    method: 'post',
    data: query
  })
}

// 同步
export function monitor(id) {
  return request({
    url: '/zsareport/api/monitor/monitor/' + id,
    method: 'post'
  })
}

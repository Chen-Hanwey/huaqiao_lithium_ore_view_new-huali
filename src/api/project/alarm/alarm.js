import request from '@/utils/request'

// 查询事件告警列表
export function listAlarm (query) {
  return request({
    url: '/alarm/alarm/list',
    method: 'post',
    data: query
  })
}

// 查询告警类型列表
export function listTypeAll (query) {
  return request({
    url: '/incident/type/listAll',
    method: 'get',
    params: query
  })
}

//告警误报处理
export function handleIncidentFalse (data) {
  return request({
    url: '/alarm/alarm/handleFalse',
    method: 'post',
    data: data
  })
}

//告警确认处理
export function handleIncidentConfirm (data) {
  return request({
    url: '/alarm/alarm/handleConfirm',
    method: 'post',
    data: data
  })
}

// 查询事件告警数量
export function countAlarm (query) {
  return request({
    url: '/alarm/alarm/count',
    method: 'post',
    data: query
  })
}

// 查询事件告警详细
export function getAlarm (id) {
  return request({
    url: '/alarm/alarm/' + id,
    method: 'get'
  })
}

// 新增事件告警
export function addAlarm (data) {
  return request({
    url: '/alarm/alarm',
    method: 'post',
    data: data
  })
}

// 修改事件告警
export function updateAlarm (data) {
  return request({
    url: '/alarm/alarm',
    method: 'put',
    data: data
  })
}

// 删除事件告警
export function delAlarm (id) {
  return request({
    url: '/alarm/alarm/' + id,
    method: 'delete'
  })
}

// 导出事件告警
export function exportAlarm (query) {
  return request({
    url: '/alarm/alarm/export',
    method: 'post',
    data: query
  })
}

import request from '@/utils/request'

// 查询告警列表
export function listAlert (query) {
  return request({
    url: '/devic/monitor/alert/list',
    method: 'get',
    params: query
  })
}

// 查询告警详细
export function getAlert (id) {
  return request({
    url: '/devic/monitor/alert/' + id,
    method: 'get'
  })
}

// 查询告警详细
export function getAlertData (query) {
  return request({
    url: '/env/common/getAlertData',
    method: 'get',
    params: query
  })
}

// 查询告警详细
export function getAttributeData (query) {
  return request({
    url: '/env/common/getAttributeData',
    method: 'get',
    params: query
  })
}


// 新增告警
export function addAlert (data) {
  return request({
    url: '/devic/monitor/alert',
    method: 'post',
    data: data
  })
}

// 修改告警
export function updateAlert (data) {
  return request({
    url: '/devic/monitor/alert',
    method: 'put',
    data: data
  })
}

// 删除告警
export function delAlert (id) {
  return request({
    url: '/devic/monitor/alert/' + id,
    method: 'delete'
  })
}

// 导出告警
export function exportAlert (query) {
  return request({
    url: '/devic/monitor/alert/export',
    method: 'get',
    params: query
  })
}

//查询详细 流程
export function getTasksInfoProcess (data) {
  return request({
    url: '/devic/monitor/alert/getTasksInfoProcessId',
    method: 'get',
    params: data
  })
}

//告警误报处理
export function handleTaskFalse (data) {
  return request({
    url: '/devic/monitor/alert/handleFalse',
    method: 'post',
    data: data
  })
}

//告警确认处理
export function handleTaskConfirm (data) {
  return request({
    url: '/devic/monitor/alert/handleConfirm',
    method: 'post',
    data: data
  })
}

// 流程处理 完成
export function answerAssignClose (data) {
  return request({
    url: '/devic/monitor/alert/answerAssignClose',
    method: 'post',
    data: data
  })
}

// 流程处理 走一步
export function answerDispatchHandle (data) {
  return request({
    url: '/devic/monitor/alert/answerDispatchHandle',
    method: 'post',
    data: data
  })
}

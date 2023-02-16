import request from '@/utils/request'

// 查询告警事件列表
export function listEvent (query) {
  return request({
    url: '/event/event/list',
    method: 'post',
    data: query
  })
}

// 查询告警事件数量
export function countEvent (query) {
  return request({
    url: '/event/event/count',
    method: 'post',
    data: query
  })
}

// 查询告警事件详细
export function getEvent (id) {
  return request({
    url: '/event/event/' + id,
    method: 'get'
  })
}

// 新增告警事件
export function addEvent (data) {
  return request({
    url: '/event/event',
    method: 'post',
    data: data
  })
}




// 处理告警事件
export function handle (data) {
  return request({
    url: '/event/event/handle',
    method: 'post',
    data: data
  })
}
// 修改告警事件
export function updateEvent (data) {
  return request({
    url: '/event/event',
    method: 'put',
    data: data
  })
}

// 删除告警事件
export function delEvent (id) {
  return request({
    url: '/event/event/' + id,
    method: 'delete'
  })
}

// 导出告警事件
export function exportEvent (query) {
  return request({
    url: '/event/event/export',
    method: 'post',
    data: query
  })
}

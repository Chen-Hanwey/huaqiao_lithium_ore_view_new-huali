import request from '@/utils/request'

// 查询事件订阅列表
export function listSubscribe (query) {
  return request({
    url: '/subscribe/subscribe/list',
    method: 'post',
    data: query
  })
}

// 查询事件订阅数量
export function countSubscribe (query) {
  return request({
    url: '/subscribe/subscribe/count',
    method: 'post',
    data: query
  })
}

// 查询事件订阅详细
export function getSubscribe (id) {
  return request({
    url: '/subscribe/subscribe/' + id,
    method: 'get'
  })
}

// 订阅
export function subscribe (type, id) {
  return request({
    url: '/subscribe/subscribe/subscribe/' + type + '/' + id,
    method: 'get'
  })
}

// 取消订阅
export function unSubscribe (type, id) {
  return request({
    url: '/subscribe/subscribe/unSubscribe/' + type + '/' + id,
    method: 'get'
  })
}

// 新增事件订阅
export function addSubscribe (data) {
  return request({
    url: '/subscribe/subscribe',
    method: 'post',
    data: data
  })
}

// 修改事件订阅
export function updateSubscribe (data) {
  return request({
    url: '/subscribe/subscribe',
    method: 'put',
    data: data
  })
}

// 删除事件订阅
export function delSubscribe (id) {
  return request({
    url: '/subscribe/subscribe/' + id,
    method: 'delete'
  })
}

// 导出事件订阅
export function exportSubscribe (query) {
  return request({
    url: '/subscribe/subscribe/export',
    method: 'post',
    data: query
  })
}

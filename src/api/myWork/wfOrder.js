import request from '@/utils/request'

// 查询工单信息列表
export function listWfOrder (query) {
  return request({
    url: '/wfOrder/wfOrder/list',
    method: 'post',
    data: query
  })
}

// 查询所有工单信息数量
export function countWfOrder (query) {
  return request({
    url: '/wfOrder/wfOrder/count',
    method: 'post',
    data: query
  })
}

// 查询我的工单信息数量
export function countMyWfOrder () {
  return request({
    url: '/event/event/workCount',
    method: 'post'
  })
}

export function todoTypes () {
  return request({
    url: '/wfOrder/wfOrder/todoTypes',
    method: 'get'
  })
}

import request from '@/utils/request'

// 查询轮巡预案列表
export function listPoll(query) {
  return request({
    url: '/hejq/poll/list',
    method: 'get',
    params: query
  })
}

// 查询轮巡预案详细
export function getPoll(id) {
  return request({
    url: '/hejq/poll/' + id,
    method: 'get'
  })
}

// 新增轮巡预案
export function addPoll(data) {
  return request({
    url: '/hejq/poll',
    method: 'post',
    data: data
  })
}

// 修改轮巡预案
export function updatePoll(data) {
  return request({
    url: '/hejq/poll',
    method: 'put',
    data: data
  })
}

// 删除轮巡预案
export function delPoll(id) {
  return request({
    url: '/hejq/poll/' + id,
    method: 'delete'
  })
}

// 导出轮巡预案
export function exportPoll(query) {
  return request({
    url: '/hejq/poll/export',
    method: 'get',
    params: query
  })
}

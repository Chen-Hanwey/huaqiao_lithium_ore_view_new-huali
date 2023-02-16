import request from '@/utils/request'

// 查询设备心跳接口列表
export function listHeartBeat(query) {
  return request({
    url: '/heartBeat/heartBeat/list',
    method: 'post',
    data: query
  })
}

// 查询设备心跳接口数量
export function countHeartBeat(query) {
  return request({
    url: '/heartBeat/heartBeat/count',
    method: 'post',
    data: query
  })
}

// 查询设备心跳接口详细
export function getHeartBeat(id) {
  return request({
    url: '/heartBeat/heartBeat/' + id,
    method: 'get'
  })
}

// 新增设备心跳接口
export function addHeartBeat(data) {
  return request({
    url: '/heartBeat/heartBeat',
    method: 'post',
    data: data
  })
}

// 修改设备心跳接口
export function updateHeartBeat(data) {
  return request({
    url: '/heartBeat/heartBeat',
    method: 'put',
    data: data
  })
}

// 删除设备心跳接口
export function delHeartBeat(id) {
  return request({
    url: '/heartBeat/heartBeat/' + id,
    method: 'delete'
  })
}

// 导出设备心跳接口
export function exportHeartBeat(query) {
  return request({
    url: '/heartBeat/heartBeat/export',
    method: 'post',
    data: query
  })
}

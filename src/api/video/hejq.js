import request from '@/utils/request'

// 获取播放地址
export function getDeviceStream(data) {
  return request({
    url: '/third/hejq/getDeviceStream',
    method: 'post',
    data: data
  })
}
// 云存储回放时间查询
export function queryRecords(data) {
  return request({
    url: '/third/hejq/queryRecords',
    method: 'post',
    data: data
  })
}
// 云存储回放时间查询
export function getPlayback(data) {
  return request({
    url: '/third/hejq/getPlayback',
    method: 'post',
    data: data
  })
}

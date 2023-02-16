import request from '@/utils/request'

// 获取设备列表（视频平台）
export function getPlatFormDevList(query) {
  return request({
    url: '/videoPlatform/getPlatFormDevList',
    method: 'post',
    data: query
  })
}

//获取设备分组树
export function getGroupTree() {
  return request({
    url: '/videoPlatform/getGroupTree',
    method: 'get'
  })
}

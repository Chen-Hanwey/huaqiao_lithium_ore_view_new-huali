import request from '@/utils/request'

// 查询上传温控设备数据详细记录接口列表
export function listUpWkNode(query) {
  return request({
    url: '/upWkNode/upWkNode/list',
    method: 'post',
    data: query
  })
}

// 查询上传温控设备数据详细记录接口数量
export function countUpWkNode(query) {
  return request({
    url: '/upWkNode/upWkNode/count',
    method: 'post',
    data: query
  })
}

// 查询上传温控设备数据详细记录接口详细
export function getUpWkNode(id) {
  return request({
    url: '/upWkNode/upWkNode/' + id,
    method: 'get'
  })
}

// 新增上传温控设备数据详细记录接口
export function addUpWkNode(data) {
  return request({
    url: '/upWkNode/upWkNode',
    method: 'post',
    data: data
  })
}

// 修改上传温控设备数据详细记录接口
export function updateUpWkNode(data) {
  return request({
    url: '/upWkNode/upWkNode',
    method: 'put',
    data: data
  })
}

// 删除上传温控设备数据详细记录接口
export function delUpWkNode(id) {
  return request({
    url: '/upWkNode/upWkNode/' + id,
    method: 'delete'
  })
}

// 导出上传温控设备数据详细记录接口
export function exportUpWkNode(query) {
  return request({
    url: '/upWkNode/upWkNode/export',
    method: 'post',
    data: query
  })
}

// 同步
export function upWkNode(id) {
  return request({
    url: '/zsareport/api/device/upWkNode/' + id,
    method: 'post'
  })
}
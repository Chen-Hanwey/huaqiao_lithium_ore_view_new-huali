import request from '@/utils/request'

// 查询上传物联设备(除温控设备外)数据详细记录接口列表
export function listUpStock(query) {
  return request({
    url: '/upStock/upStock/list',
    method: 'post',
    data: query
  })
}

// 查询上传物联设备(除温控设备外)数据详细记录接口数量
export function countUpStock(query) {
  return request({
    url: '/upStock/upStock/count',
    method: 'post',
    data: query
  })
}

// 查询上传物联设备(除温控设备外)数据详细记录接口详细
export function getUpStock(id) {
  return request({
    url: '/upStock/upStock/' + id,
    method: 'get'
  })
}

// 新增上传物联设备(除温控设备外)数据详细记录接口
export function addUpStock(data) {
  return request({
    url: '/upStock/upStock',
    method: 'post',
    data: data
  })
}

// 修改上传物联设备(除温控设备外)数据详细记录接口
export function updateUpStock(data) {
  return request({
    url: '/upStock/upStock',
    method: 'put',
    data: data
  })
}

// 删除上传物联设备(除温控设备外)数据详细记录接口
export function delUpStock(id) {
  return request({
    url: '/upStock/upStock/' + id,
    method: 'delete'
  })
}

// 导出上传物联设备(除温控设备外)数据详细记录接口
export function exportUpStock(query) {
  return request({
    url: '/upStock/upStock/export',
    method: 'post',
    data: query
  })
}

// 同步
export function upStock(id) {
  return request({
    url: '/zsareport/api/device/upStock/' + id,
    method: 'post'
  })
}
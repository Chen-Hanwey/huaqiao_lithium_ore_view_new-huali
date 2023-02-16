import request from '@/utils/request'

// 查询上传物联设备统计接口列表
export function listUpContentUnion(query) {
  return request({
    url: '/upContentUnion/upContentUnion/list',
    method: 'post',
    data: query
  })
}

// 查询上传物联设备统计接口数量
export function countUpContentUnion(query) {
  return request({
    url: '/upContentUnion/upContentUnion/count',
    method: 'post',
    data: query
  })
}

// 查询上传物联设备统计接口详细
export function getUpContentUnion(id) {
  return request({
    url: '/upContentUnion/upContentUnion/' + id,
    method: 'get'
  })
}

// 新增上传物联设备统计接口
export function addUpContentUnion(data) {
  return request({
    url: '/upContentUnion/upContentUnion',
    method: 'post',
    data: data
  })
}

// 修改上传物联设备统计接口
export function updateUpContentUnion(data) {
  return request({
    url: '/upContentUnion/upContentUnion',
    method: 'put',
    data: data
  })
}

// 删除上传物联设备统计接口
export function delUpContentUnion(id) {
  return request({
    url: '/upContentUnion/upContentUnion/' + id,
    method: 'delete'
  })
}

// 导出上传物联设备统计接口
export function exportUpContentUnion(query) {
  return request({
    url: '/upContentUnion/upContentUnion/export',
    method: 'post',
    data: query
  })
}

// 同步
export function upContentUnion(id) {
  return request({
    url: '/zsareport/api/device/upContentUnion/' + id,
    method: 'post'
  })
}
import request from '@/utils/request'

// 查询违规抓拍信息列表
export function listViolationCaptureReport(query) {
  return request({
    url: '/place/violationCaptureReport/list',
    method: 'post',
    data: query
  })
}

// 查询违规抓拍信息数量
export function countViolationCaptureReport(query) {
  return request({
    url: '/place/violationCaptureReport/count',
    method: 'post',
    data: query
  })
}

// 查询违规抓拍信息详细
export function getViolationCaptureReport(id) {
  return request({
    url: '/place/violationCaptureReport/' + id,
    method: 'get'
  })
}

// 新增违规抓拍信息
export function addViolationCaptureReport(data) {
  return request({
    url: '/place/violationCaptureReport',
    method: 'post',
    data: data
  })
}

// 修改违规抓拍信息
export function updateViolationCaptureReport(data) {
  return request({
    url: '/place/violationCaptureReport',
    method: 'put',
    data: data
  })
}

// 删除违规抓拍信息
export function delViolationCaptureReport(id) {
  return request({
    url: '/place/violationCaptureReport/' + id,
    method: 'delete'
  })
}

// 导出违规抓拍信息
export function exportViolationCaptureReport(query) {
  return request({
    url: '/place/violationCaptureReport/export',
    method: 'post',
    data: query
  })
}

// 导出违规抓拍信息
export function violationCaptureReport(id) {
  return request({
    url: '/zsareport/api/ai/violationCaptureReport/' + id,
    method: 'post'
  })
}
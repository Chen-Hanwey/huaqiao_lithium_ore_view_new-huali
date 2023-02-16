import request from '@/utils/request'

// 查询水质标准列表
export function listStandard(query) {
  return request({
    url: '/envMonitorStandard/standard/list',
    method: 'get',
    params: query
  })
}

// 查询水质标准详细
export function getStandard() {
  return request({
    url: '/envMonitorStandard/standard/' + 1,
    method: 'get'
  })
}

// 新增水质标准
export function addStandard(data) {
  return request({
    url: '/envMonitorStandard/standard',
    method: 'post',
    data: data
  })
}

// 修改水质标准
export function updateStandard(data) {
  return request({
    url: '/envMonitorStandard/standard',
    method: 'put',
    data: data
  })
}

// 删除水质标准
export function delStandard(id) {
  return request({
    url: '/envMonitorStandard/standard/' + id,
    method: 'delete'
  })
}

// 导出水质标准
export function exportStandard(query) {
  return request({
    url: '/envMonitorStandard/standard/export',
    method: 'get',
    params: query
  })
}

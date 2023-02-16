import request from '@/utils/request'
// 查询阈值设置列表
export function listThreshold(query) {
  return request({
    url: '/environmentmonitor/threshold/list',
    method: 'get',
    params: query
  })
}

// 查询阈值设置详细
export function getThreshold(devName) {
  return request({
    url: '/environmentmonitor/threshold/' + devName,
    method: 'get'
  })
}
export function selectOneByType(devType) {
  return request({
    url: '/environmentmonitor/threshold/selectOneByType/' + devType,
    method: 'get'
  })
}

export function selectOneByEnterpriseIdAndDevType(enterpriseId,devType) {
  return request({
    url: '/environmentmonitor/threshold/selectOneByEnterpriseIdAndDevType/' + enterpriseId+'/'+devType,
    method: 'get'
  })
}

// 新增阈值设置
export function addThreshold(data) {
  return request({
    url: '/environmentmonitor/threshold',
    method: 'post',
    data: data
  })
}

// 修改阈值设置
export function updateThreshold(data) {
  return request({
    url: '/environmentmonitor/threshold',
    method: 'put',
    data: data
  })
}

// 删除阈值设置
export function delThreshold(id) {
  return request({
    url: '/environmentmonitor/threshold/' + id,
    method: 'delete'
  })
}

// 导出阈值设置
export function exportThreshold(query) {
  return request({
    url: '/environmentmonitor/threshold/export',
    method: 'get',
    params: query
  })
}

import request from '@/utils/request'

// 查询视频主体设备-子表列表
export function listMonitorBranch(query) {
  return request({
    url: '/place/monitorBranch/list',
    method: 'post',
    data: query
  })
}

export function listMonitorBranchAll(query) {
  return request({
    url: '/place/monitorBranch/listAll',
    method: 'post',
    data: query
  })
}


// 查询视频主体设备-子表数量
export function countMonitorBranch(query) {
  return request({
    url: '/place/monitorBranch/count',
    method: 'post',
    data: query
  })
}

// 查询视频主体设备-子表详细
export function getMonitorBranch(id) {
  return request({
    url: '/place/monitorBranch/' + id,
    method: 'get'
  })
}

// 新增视频主体设备-子表
export function addMonitorBranch(data) {
  return request({
    url: '/place/monitorBranch',
    method: 'post',
    data: data
  })
}

// 修改视频主体设备-子表
export function updateMonitorBranch(data) {
  return request({
    url: '/place/monitorBranch',
    method: 'put',
    data: data
  })
}

// 删除视频主体设备-子表
export function delMonitorBranch(id) {
  return request({
    url: '/place/monitorBranch/' + id,
    method: 'delete'
  })
}

// 导出视频主体设备-子表
export function exportMonitorBranch(query) {
  return request({
    url: '/place/monitorBranch/export',
    method: 'post',
    data: query
  })
}

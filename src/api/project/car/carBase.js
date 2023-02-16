import request from '@/utils/request'

// 查询车辆基础信息列表
export function listCarBase (query) {
  return request({
    url: '/base/carBase/list',
    method: 'post',
    data: query
  })
}

// 查询车辆基础信息数量
export function countCarBase (query) {
  return request({
    url: '/base/carBase/count',
    method: 'post',
    data: query
  })
}

// 查询车辆基础信息详细
export function getCarBase (id) {
  return request({
    url: '/base/carBase/' + id,
    method: 'get'
  })
}

// 查询车辆基础信息详细
export function getCarBasePut (id) {
  return request({
    url: '/base/carBase/put/' + id,
    method: 'get'
  })
}

// 查询车辆基础信息详细
export function getCarBaseNo (no) {
  return request({
    url: '/base/carBase/no/' + no,
    method: 'get'
  })
}

// 新增车辆基础信息
export function addCarBase (data) {
  return request({
    url: '/base/carBase',
    method: 'post',
    data: data
  })
}

// 修改车辆基础信息
export function updateCarBase (data) {
  return request({
    url: '/base/carBase',
    method: 'put',
    data: data
  })
}

// 删除车辆基础信息
export function delCarBase (id) {
  return request({
    url: '/base/carBase/' + id,
    method: 'delete'
  })
}

// 导出车辆基础信息
export function exportCarBase (query) {
  return request({
    url: '/base/carBase/export',
    method: 'post',
    data: query
  })
}

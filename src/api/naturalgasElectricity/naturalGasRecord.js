import request from '@/utils/request'

// 查询天然气使用记录（费用管理）列表
export function listNaturalGasRecord(query) {
  return request({
    url: '/naturalgasElectricity/naturalGasRecord/list',
    method: 'post',
    data: query
  })
}

// 查询天然气使用记录（费用管理）数量
export function countNaturalGasRecord(query) {
  return request({
    url: '/naturalgasElectricity/naturalGasRecord/count',
    method: 'post',
    data: query
  })
}

// 查询天然气使用记录（费用管理）详细
export function getNaturalGasRecord(id) {
  return request({
    url: '/naturalgasElectricity/naturalGasRecord/' + id,
    method: 'get'
  })
}

// 新增天然气使用记录（费用管理）
export function addNaturalGasRecord(data) {
  return request({
    url: '/naturalgasElectricity/naturalGasRecord',
    method: 'post',
    data: data
  })
}

// 修改天然气使用记录（费用管理）
export function updateNaturalGasRecord(data) {
  return request({
    url: '/naturalgasElectricity/naturalGasRecord',
    method: 'put',
    data: data
  })
}

// 删除天然气使用记录（费用管理）
export function delNaturalGasRecord(id) {
  return request({
    url: '/naturalgasElectricity/naturalGasRecord/' + id,
    method: 'delete'
  })
}

// 导出天然气使用记录（费用管理）
export function exportNaturalGasRecord(query) {
  return request({
    url: '/naturalgasElectricity/naturalGasRecord/export',
    method: 'post',
    data: query
  })
}

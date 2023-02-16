import request from '@/utils/request'

// 查询天然气设备管理列表
export function listNaturalGasDev(query) {
  return request({
    url: '/naturalgasElectricity/naturalGasDev/list',
    method: 'post',
    data: query
  })
}

// 查询天然气设备管理数量
export function countNaturalGasDev(query) {
  return request({
    url: '/naturalgasElectricity/naturalGasDev/count',
    method: 'post',
    data: query
  })
}

// 查询天然气设备管理详细
export function getNaturalGasDev(id) {
  return request({
    url: '/naturalgasElectricity/naturalGasDev/' + id,
    method: 'get'
  })
}

// 新增天然气设备管理
export function addNaturalGasDev(data) {
  return request({
    url: '/naturalgasElectricity/naturalGasDev',
    method: 'post',
    data: data
  })
}

// 修改天然气设备管理
export function updateNaturalGasDev(data) {
  return request({
    url: '/naturalgasElectricity/naturalGasDev',
    method: 'put',
    data: data
  })
}

// 删除天然气设备管理
export function delNaturalGasDev(id) {
  return request({
    url: '/naturalgasElectricity/naturalGasDev/' + id,
    method: 'delete'
  })
}

// 导出天然气设备管理
export function exportNaturalGasDev(query) {
  return request({
    url: '/naturalgasElectricity/naturalGasDev/export',
    method: 'post',
    data: query
  })
}

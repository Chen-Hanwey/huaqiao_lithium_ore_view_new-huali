import request from '@/utils/request'

// 查询在线培训参加人员列表
export function listTrainPerson(query) {
  return request({
    url: '/train/trainPerson/list',
    method: 'post',
    data: query
  })
}

// 查询在线培训参加人员数量
export function countTrainPerson(query) {
  return request({
    url: '/train/trainPerson/count',
    method: 'post',
    data: query
  })
}

// 查询在线培训参加人员详细
export function getTrainPerson(id) {
  return request({
    url: '/train/trainPerson/' + id,
    method: 'get'
  })
}

// 新增在线培训参加人员
export function addTrainPerson(data) {
  return request({
    url: '/train/trainPerson',
    method: 'post',
    data: data
  })
}

// 修改在线培训参加人员
export function updateTrainPerson(data) {
  return request({
    url: '/train/trainPerson',
    method: 'put',
    data: data
  })
}

// 删除在线培训参加人员
export function delTrainPerson(id) {
  return request({
    url: '/train/trainPerson/' + id,
    method: 'delete'
  })
}

// 导出在线培训参加人员
export function exportTrainPerson(query) {
  return request({
    url: '/train/trainPerson/export',
    method: 'post',
    data: query
  })
}

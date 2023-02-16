import request from '@/utils/request'

// 查询人员列表
export function listPeopleBase(query) {
  return request({
    url: '/people/peopleBase/list',
    method: 'post',
    data: query
  })
}

// 查询人员数量
export function countPeopleBase(query) {
  return request({
    url: '/people/peopleBase/count',
    method: 'post',
    data: query
  })
}

// 查询人员详细
export function getPeopleBase(id) {
  return request({
    url: '/people/peopleBase/' + id,
    method: 'get'
  })
}

// 新增人员
export function addPeopleBase(data) {
  return request({
    url: '/people/peopleBase',
    method: 'post',
    data: data
  })
}

// 修改人员
export function updatePeopleBase(data) {
  return request({
    url: '/people/peopleBase',
    method: 'put',
    data: data
  })
}

// 删除人员
export function delPeopleBase(id) {
  return request({
    url: '/people/peopleBase/' + id,
    method: 'delete'
  })
}

// 导出人员
export function exportPeopleBase(query) {
  return request({
    url: '/people/peopleBase/export',
    method: 'post',
    data: query
  })
}

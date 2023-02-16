import request from '@/utils/request'

// 查询晨检记录员工情况列表
export function listMorningCheckPerson(query) {
  return request({
    url: '/morningCheckPerson/morningCheckPerson/list',
    method: 'post',
    data: query
  })
}

// 查询晨检记录员工情况数量
export function countMorningCheckPerson(query) {
  return request({
    url: '/morningCheckPerson/morningCheckPerson/count',
    method: 'post',
    data: query
  })
}

// 查询晨检记录员工情况详细
export function getMorningCheckPerson(id) {
  return request({
    url: '/morningCheckPerson/morningCheckPerson/' + id,
    method: 'get'
  })
}

// 新增晨检记录员工情况
export function addMorningCheckPerson(data) {
  return request({
    url: '/morningCheckPerson/morningCheckPerson',
    method: 'post',
    data: data
  })
}

// 修改晨检记录员工情况
export function updateMorningCheckPerson(data) {
  return request({
    url: '/morningCheckPerson/morningCheckPerson',
    method: 'put',
    data: data
  })
}

// 删除晨检记录员工情况
export function delMorningCheckPerson(id) {
  return request({
    url: '/morningCheckPerson/morningCheckPerson/' + id,
    method: 'delete'
  })
}

// 导出晨检记录员工情况
export function exportMorningCheckPerson(query) {
  return request({
    url: '/morningCheckPerson/morningCheckPerson/export',
    method: 'post',
    data: query
  })
}

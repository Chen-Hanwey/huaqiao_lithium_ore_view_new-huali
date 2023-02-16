import request from '@/utils/request'

// 查询卫生防疫列表
export function listEpidemicPrevention(query) {
  return request({
    url: '/epidemicPrevention/epidemicPrevention/list',
    method: 'post',
    data: query
  })
}

// 查询卫生防疫数量
export function countEpidemicPrevention(query) {
  return request({
    url: '/epidemicPrevention/epidemicPrevention/count',
    method: 'post',
    data: query
  })
}

// 查询卫生防疫详细
export function getEpidemicPrevention(id) {
  return request({
    url: '/epidemicPrevention/epidemicPrevention/' + id,
    method: 'get'
  })
}

// 新增卫生防疫
export function addEpidemicPrevention(data) {
  return request({
    url: '/epidemicPrevention/epidemicPrevention',
    method: 'post',
    data: data
  })
}

// 修改卫生防疫
export function updateEpidemicPrevention(data) {
  return request({
    url: '/epidemicPrevention/epidemicPrevention',
    method: 'put',
    data: data
  })
}

// 删除卫生防疫
export function delEpidemicPrevention(id) {
  return request({
    url: '/epidemicPrevention/epidemicPrevention/' + id,
    method: 'delete'
  })
}

// 导出卫生防疫
export function exportEpidemicPrevention(query) {
  return request({
    url: '/epidemicPrevention/epidemicPrevention/export',
    method: 'post',
    data: query
  })
}

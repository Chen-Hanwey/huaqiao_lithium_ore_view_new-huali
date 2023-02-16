import request from '@/utils/request'

// 查询陪餐人员打分列表
export function listAccompanyScore(query) {
  return request({
    url: '/accompanyScore/accompanyScore/list',
    method: 'post',
    data: query
  })
}

// 查询陪餐人员打分数量
export function countAccompanyScore(query) {
  return request({
    url: '/accompanyScore/accompanyScore/count',
    method: 'post',
    data: query
  })
}

// 查询陪餐人员打分详细
export function getAccompanyScore(id) {
  return request({
    url: '/accompanyScore/accompanyScore/' + id,
    method: 'get'
  })
}

// 新增陪餐人员打分
export function addAccompanyScore(data) {
  return request({
    url: '/accompanyScore/accompanyScore',
    method: 'post',
    data: data
  })
}

// 修改陪餐人员打分
export function updateAccompanyScore(data) {
  return request({
    url: '/accompanyScore/accompanyScore',
    method: 'put',
    data: data
  })
}

// 删除陪餐人员打分
export function delAccompanyScore(id) {
  return request({
    url: '/accompanyScore/accompanyScore/' + id,
    method: 'delete'
  })
}

// 导出陪餐人员打分
export function exportAccompanyScore(query) {
  return request({
    url: '/accompanyScore/accompanyScore/export',
    method: 'post',
    data: query
  })
}

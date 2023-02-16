import request from '@/utils/request'

// 查询企业质量评分列表
export function listQualityScore(query) {
  return request({
    url: '/qualityScore/qualityScore/list',
    method: 'post',
    data: query
  })
}

// 查询企业质量评分数量
export function countQualityScore(query) {
  return request({
    url: '/qualityScore/qualityScore/count',
    method: 'post',
    data: query
  })
}

// 查询企业质量评分详细
export function getQualityScore(id) {
  return request({
    url: '/qualityScore/qualityScore/' + id,
    method: 'get'
  })
}

// 新增企业质量评分
export function addQualityScore(data) {
  return request({
    url: '/qualityScore/qualityScore',
    method: 'post',
    data: data
  })
}

// 修改企业质量评分
export function updateQualityScore(data) {
  return request({
    url: '/qualityScore/qualityScore',
    method: 'put',
    data: data
  })
}

// 删除企业质量评分
export function delQualityScore(id) {
  return request({
    url: '/qualityScore/qualityScore/' + id,
    method: 'delete'
  })
}

// 导出企业质量评分
export function exportQualityScore(query) {
  return request({
    url: '/qualityScore/qualityScore/export',
    method: 'post',
    data: query
  })
}

// 获取评分统计集合
export function getScoreStatisticsList(query) {
  return request({
    url: '/qualityScore/qualityScore/statisticsList',
    method: 'post',
    data: query
  })
}

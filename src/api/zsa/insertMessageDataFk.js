import request from '@/utils/request'

// 查询AI抓拍预警反馈处理列表
export function listInsertMessageDataFk(query) {
  return request({
    url: '/insertMessageDataFk/insertMessageDataFk/list',
    method: 'post',
    data: query
  })
}

// 查询AI抓拍预警反馈处理数量
export function countInsertMessageDataFk(query) {
  return request({
    url: '/insertMessageDataFk/insertMessageDataFk/count',
    method: 'post',
    data: query
  })
}

// 查询AI抓拍预警反馈处理详细
export function getInsertMessageDataFk(id) {
  return request({
    url: '/insertMessageDataFk/insertMessageDataFk/' + id,
    method: 'get'
  })
}

// 新增AI抓拍预警反馈处理
export function addInsertMessageDataFk(data) {
  return request({
    url: '/insertMessageDataFk/insertMessageDataFk',
    method: 'post',
    data: data
  })
}

// 修改AI抓拍预警反馈处理
export function updateInsertMessageDataFk(data) {
  return request({
    url: '/insertMessageDataFk/insertMessageDataFk',
    method: 'put',
    data: data
  })
}

// 删除AI抓拍预警反馈处理
export function delInsertMessageDataFk(id) {
  return request({
    url: '/insertMessageDataFk/insertMessageDataFk/' + id,
    method: 'delete'
  })
}

// 导出AI抓拍预警反馈处理
export function exportInsertMessageDataFk(query) {
  return request({
    url: '/insertMessageDataFk/insertMessageDataFk/export',
    method: 'post',
    data: query
  })
}

// 同步
export function insertMessageDataFk(id) {
  return request({
    url: '/zsareport/api/ai/insertMessageDataFk/' + id,
    method: 'post'
  })
}
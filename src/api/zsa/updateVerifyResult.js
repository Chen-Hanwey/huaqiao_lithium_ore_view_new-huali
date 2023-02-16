import request from '@/utils/request'

// 查询AI核验结果接口列表
export function listUpdateVerifyResult(query) {
  return request({
    url: '/updateVerifyResult/updateVerifyResult/list',
    method: 'post',
    data: query
  })
}

// 查询AI核验结果接口数量
export function countUpdateVerifyResult(query) {
  return request({
    url: '/updateVerifyResult/updateVerifyResult/count',
    method: 'post',
    data: query
  })
}

// 查询AI核验结果接口详细
export function getUpdateVerifyResult(id) {
  return request({
    url: '/updateVerifyResult/updateVerifyResult/' + id,
    method: 'get'
  })
}

// 新增AI核验结果接口
export function addUpdateVerifyResult(data) {
  return request({
    url: '/updateVerifyResult/updateVerifyResult',
    method: 'post',
    data: data
  })
}

// 修改AI核验结果接口
export function updateUpdateVerifyResult(data) {
  return request({
    url: '/updateVerifyResult/updateVerifyResult',
    method: 'put',
    data: data
  })
}

// 删除AI核验结果接口
export function delUpdateVerifyResult(id) {
  return request({
    url: '/updateVerifyResult/updateVerifyResult/' + id,
    method: 'delete'
  })
}

// 导出AI核验结果接口
export function exportUpdateVerifyResult(query) {
  return request({
    url: '/updateVerifyResult/updateVerifyResult/export',
    method: 'post',
    data: query
  })
}

// 同步
export function updateVerifyResult(id) {
  return request({
    url: '/zsareport/api/api/updateVerifyResult/' + id,
    method: 'post'
  })
}
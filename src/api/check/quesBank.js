import request from '@/utils/request'

// 查询检查库分类管理列表
export function listQuesBank(query) {
  return request({
    url: '/check/quesBank/list',
    method: 'post',
    data: query
  })
}

// 查询检查库分类管理详细
export function getQuesBank(id) {
  return request({
    url: '/check/quesBank/' + id,
    method: 'get'
  })
}

// 新增检查库分类管理
export function addQuesBank(data) {
  return request({
    url: '/check/quesBank',
    method: 'post',
    data: data
  })
}

// 修改检查库分类管理
export function updateQuesBank(data) {
  return request({
    url: '/check/quesBank',
    method: 'put',
    data: data
  })
}

// 删除检查库分类管理
export function delQuesBank(id) {
  return request({
    url: '/check/quesBank/' + id,
    method: 'delete'
  })
}

// 导出检查库分类管理
export function exportQuesBank(query) {
  return request({
    url: '/check/quesBank/export',
    method: 'post',
    data: query
  })
}

// 获取所有检查库列表
export function listAll() {
  return request({
    url: '/check/quesBank/listAll',
    method: 'get'
  })
}
